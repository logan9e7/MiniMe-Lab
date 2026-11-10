import * as SecureStore from "expo-secure-store";
import type {CycleEntry} from "./tracking";

/** Offline-only device journal. Entries never upload automatically.
 * SecureStore encrypts each entry using Android Keystore / iOS Keychain.
 * A bounded index avoids exceeding secure-storage item size limits.
 */
const prefix="minime.offline.cycle.v1.";
const indexKey=prefix+"dates";
const maxEntries=90;
const validDate=(date:string)=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date+"T12:00:00Z"));
async function dates():Promise<string[]>{
 const raw=await SecureStore.getItemAsync(indexKey);
 if(!raw)return [];
 const parsed:unknown=JSON.parse(raw);
 if(!Array.isArray(parsed))throw Error("Local diary index is invalid. No records were changed.");
 return parsed.filter((x):x is string=>typeof x==="string"&&validDate(x)).slice(0,maxEntries);
}
export async function listOfflineCycles():Promise<CycleEntry[]>{
 const keys=await dates();
 const entries=await Promise.all(keys.map(async date=>{
  const raw=await SecureStore.getItemAsync(prefix+date);
  if(!raw)return null;
  const value:CycleEntry=JSON.parse(raw);
  return value.entry_date===date?value:null;
 }));
 return entries.filter((x):x is CycleEntry=>x!==null).sort((a,b)=>b.entry_date.localeCompare(a.entry_date));
}
export async function saveOfflineCycle(entry:CycleEntry):Promise<void>{
 if(!validDate(entry.entry_date))throw Error("Invalid entry date");
 if(!["none","spotting","light","medium","heavy"].includes(entry.flow))throw Error("Invalid flow");
 const safe:CycleEntry={entry_date:entry.entry_date,flow:entry.flow,pain:Math.max(0,Math.min(10,Math.round(entry.pain))),notes:entry.notes.slice(0,500),period_start:Boolean(entry.period_start)};
 // Write the encrypted record first, then the index. Never evict a record silently.
 const existing=await dates();
 if(!existing.includes(safe.entry_date)&&existing.length>=maxEntries)throw Error("Local diary is full (90 days). Export or remove older records before adding more.");
 await SecureStore.setItemAsync(prefix+safe.entry_date,JSON.stringify(safe),{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});
 const updated=[safe.entry_date,...existing.filter(x=>x!==safe.entry_date)].sort((a,b)=>b.localeCompare(a));
 await SecureStore.setItemAsync(indexKey,JSON.stringify(updated),{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});
}
export async function deleteOfflineCycle(date:string):Promise<void>{
 if(!validDate(date))throw Error("Invalid date");
 const updated=(await dates()).filter(x=>x!==date);
 // Remove from index first, so a failed delete cannot resurrect the entry.
 await SecureStore.setItemAsync(indexKey,JSON.stringify(updated),{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});
 await SecureStore.deleteItemAsync(prefix+date);
}
