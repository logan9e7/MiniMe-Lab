import {supabase} from "./supabase";
import {getLocalCycles,markCycleSynced,mergeLocalCycles} from "./localDatabase";
import type {CycleEntry} from "./tracking";

async function owner(){
 if(!supabase)throw Error("Cloud sync is not configured.");
 const {data,error}=await supabase.auth.getUser();
 if(error||!data.user)throw Error("Sign in on Me before syncing your private records.");
 return {client:supabase,id:data.user.id};
}
export type SyncReport={uploaded:number;alreadyOnServer:number;skippedOtherAccount:number};
/** Explicit, foreground-only sync. Does not run on sign-in or background network changes.
 * Never overwrites cloud entries; a matching date is considered a conflict.
 */
export async function syncLocalCycles():Promise<SyncReport>{
 const {client,id}=await owner();
 const local=(await getLocalCycles()).filter(x=>x.dirty);
 const report:SyncReport={uploaded:0,alreadyOnServer:0,skippedOtherAccount:0};
 if(!local.length)return report;
 const {data:existing,error:readError}=await client.from("cycle_entries").select("entry_date").eq("user_id",id).limit(2000);
 if(readError)throw readError;
 const dates=new Set((existing||[]).map(x=>x.entry_date as string));
 for(const entry of local){
  if(entry.owner_id&&entry.owner_id!==id){report.skippedOtherAccount++;continue}
  if(dates.has(entry.entry_date)){report.alreadyOnServer++;continue}
  const {error}=await client.from("cycle_entries").insert({
   user_id:id,entry_date:entry.entry_date,flow:entry.flow,
   pain:entry.pain,notes:entry.notes,period_start:entry.period_start
  });
  if(error){ // Preserve pending item for explicit retry. Never claim partial success silently.
   throw Error(`Uploaded ${report.uploaded} entries; remaining records are pending. ${error.message}`);
  }
  await markCycleSynced(entry,id);
  report.uploaded++;dates.add(entry.entry_date);
 }
 return report;
}
/** Requires explicit user action; import is additive and does not overwrite local notes. */
export async function importCloudCycles():Promise<{added:number;skipped:number}>{
 const {client,id}=await owner();
 const {data,error}=await client.from("cycle_entries").select("entry_date,flow,pain,notes,period_start").eq("user_id",id).order("entry_date",{ascending:false}).limit(2000);
 if(error)throw error;
 return mergeLocalCycles((data??[]) as CycleEntry[],{owner_id:id,dirty:false});
}
