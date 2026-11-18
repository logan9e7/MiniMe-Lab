import {supabase} from "./supabase";
import {getLocalCycles,markCycleSynced,mergeLocalCycles} from "./localDatabase";
import type {CycleEntry} from "./tracking";

async function owner(){
 if(!supabase)throw Error("Cloud sync is not configured.");
 const {data,error}=await supabase.auth.getUser();
 if(error||!data.user)throw Error("Sign in on Me before syncing your private records.");
 return {client:supabase,id:data.user.id};
}
export type SyncReport={
 uploaded:number;
 alreadyOnServer:number;
 conflicts:number;
 skippedOtherAccount:number;
};
export function sameCycle(a:CycleEntry,b:CycleEntry):boolean{
 return a.entry_date===b.entry_date&&a.flow===b.flow&&a.pain===b.pain
  &&a.notes===b.notes&&a.period_start===b.period_start;
}
const batchSize=100;
/** Explicit foreground-only sync. Never overwrites remote or locally newer edits.
 * Identical same-date entries are acknowledged; divergent entries remain dirty.
 * Queries only pending dates in bounded chunks to avoid Supabase row-limit drift.
 */
export async function syncLocalCycles():Promise<SyncReport>{
 const {client,id}=await owner();
 const pending=(await getLocalCycles()).filter(x=>x.dirty);
 const report:SyncReport={uploaded:0,alreadyOnServer:0,conflicts:0,skippedOtherAccount:0};
 const eligible=pending.filter(entry=>{
  if(entry.owner_id&&entry.owner_id!==id){report.skippedOtherAccount++;return false}
  return true;
 });
 if(!eligible.length)return report;
 const remoteByDate=new Map<string,CycleEntry>();
 for(let start=0;start<eligible.length;start+=batchSize){
  const chunk=eligible.slice(start,start+batchSize);
  const {data,error}=await client.from("cycle_entries")
   .select("entry_date,flow,pain,notes,period_start")
   .eq("user_id",id).in("entry_date",chunk.map(entry=>entry.entry_date));
  if(error)throw Error(`Unable to check existing cloud records: ${error.message}`);
  for(const row of (data??[]) as CycleEntry[])remoteByDate.set(row.entry_date,row);
 }
 for(const entry of eligible){
  const remote=remoteByDate.get(entry.entry_date);
  if(remote){
   if(sameCycle(entry,remote)){
    await markCycleSynced(entry,id);
    report.alreadyOnServer++;
   }else{
    report.conflicts++;
   }
   continue;
  }
  const {error}=await client.from("cycle_entries").insert({
   user_id:id,entry_date:entry.entry_date,flow:entry.flow,
   pain:entry.pain,notes:entry.notes,period_start:entry.period_start
  });
  if(error){
   // Another device can insert the same unique (user_id, entry_date) after our lookup.
   // Re-read that date, then acknowledge only an identical record.
   if(error.code==="23505"){
    const {data:competing,error:readError}=await client.from("cycle_entries")
     .select("entry_date,flow,pain,notes,period_start")
     .eq("user_id",id).eq("entry_date",entry.entry_date).maybeSingle();
    if(readError)throw Error(`Unable to resolve cloud duplicate: ${readError.message}`);
    if(competing){
     if(sameCycle(entry,competing as CycleEntry)){
      await markCycleSynced(entry,id);
      report.alreadyOnServer++;
     }else report.conflicts++;
     continue;
    }
   }
   throw Error(`Uploaded ${report.uploaded} entries; remaining records are pending. ${error.message}`);
  }
  await markCycleSynced(entry,id);
  report.uploaded++;
 }
 return report;
}
/** Explicit cloud import; paginated, additive and never overwrites device entries. */
export async function importCloudCycles():Promise<{added:number;skipped:number}>{
 const {client,id}=await owner();
 const pageSize=250,totals={added:0,skipped:0};
 let offset=0;
 while(true){
  const {data,error}=await client.from("cycle_entries")
   .select("entry_date,flow,pain,notes,period_start")
   .eq("user_id",id).order("entry_date",{ascending:false})
   .range(offset,offset+pageSize-1);
  if(error)throw Error(`Imported ${totals.added} records before interruption: ${error.message}`);
  const page=(data??[]) as CycleEntry[];
  if(!page.length)break;
  const result=await mergeLocalCycles(page,{owner_id:id,dirty:false});
  totals.added+=result.added;
  totals.skipped+=result.skipped;
  offset+=page.length;
  if(page.length<pageSize)break;
 }
 return totals;
}
