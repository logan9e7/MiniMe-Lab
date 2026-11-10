import * as SQLite from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import type {CycleEntry} from "./tracking";

export type LocalCycle=CycleEntry&{dirty:boolean;owner_id:string|null};
const databaseName="minime-private-v2.db";
const keyName="minime.sqlite.cipher.key.v2";
let connection:Promise<SQLite.SQLiteDatabase>|null=null;
const flowSet=new Set(["none","spotting","light","medium","heavy"]);
export function validateCycle(entry:CycleEntry):CycleEntry{
 const date=entry.entry_date;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+"T12:00:00Z")))throw Error("Invalid date");
 if(!flowSet.has(entry.flow))throw Error("Invalid flow");
 if(!Number.isFinite(entry.pain)||entry.pain<0||entry.pain>10)throw Error("Pain must be between 0 and 10");
 return {entry_date:date,flow:entry.flow,pain:Math.round(entry.pain),notes:String(entry.notes||"").slice(0,500),period_start:!!entry.period_start};
}
async function open():Promise<SQLite.SQLiteDatabase>{
 const db=await SQLite.openDatabaseAsync(databaseName);
 try{
  const cipher=await db.getFirstAsync<{cipher_version:string}>("PRAGMA cipher_version");
  if(!cipher?.cipher_version)throw Error("This Android build does not support encrypted SQLite. Install a new native build; plaintext records were NOT created.");
  let key=await SecureStore.getItemAsync(keyName);
  if(!key){
   // The key never enters source code, settings, backups, or the sync service.
   key=Array.from(Crypto.getRandomBytes(32),b=>b.toString(16).padStart(2,"0")).join("");
   await SecureStore.setItemAsync(keyName,key,{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});
  }
  if(!/^[0-9a-f]{64}$/.test(key))throw Error("Invalid device encryption key");
  await db.execAsync(`PRAGMA key = "x'${key}'";`);
  await db.getFirstAsync("SELECT count(*) AS count FROM sqlite_master"); // detect wrong key before modifying schema
  await db.execAsync(`CREATE TABLE IF NOT EXISTS cycle_journal (
   entry_date TEXT PRIMARY KEY NOT NULL,
   flow TEXT NOT NULL, pain INTEGER NOT NULL,
   notes TEXT NOT NULL, period_start INTEGER NOT NULL,
   dirty INTEGER NOT NULL DEFAULT 1,
   owner_id TEXT
  );`);
  return db;
 }catch(e){await db.closeAsync();throw e}
}
export function localDatabase():Promise<SQLite.SQLiteDatabase>{
 if(!connection)connection=open().catch(e=>{connection=null;throw e});
 return connection;
}
export async function getLocalCycles():Promise<LocalCycle[]>{
 const db=await localDatabase();
 const rows=await db.getAllAsync<{entry_date:string;flow:string;pain:number;notes:string;period_start:number;dirty:number;owner_id:string|null}>("SELECT * FROM cycle_journal ORDER BY entry_date DESC LIMIT 1000");
 return rows.map(r=>({...validateCycle({...r,flow:r.flow as CycleEntry["flow"],period_start:!!r.period_start}),dirty:!!r.dirty,owner_id:r.owner_id}));
}
export async function putLocalCycle(entry:CycleEntry,owner_id:string|null=null,dirty=true){
 const e=validateCycle(entry),db=await localDatabase();
 await db.runAsync(`INSERT INTO cycle_journal(entry_date,flow,pain,notes,period_start,dirty,owner_id)
 VALUES(?,?,?,?,?,?,?)
 ON CONFLICT(entry_date) DO UPDATE SET
 flow=excluded.flow,pain=excluded.pain,notes=excluded.notes,period_start=excluded.period_start,
 dirty=excluded.dirty,owner_id=COALESCE(cycle_journal.owner_id,excluded.owner_id)`,
 e.entry_date,e.flow,e.pain,e.notes,e.period_start?1:0,dirty?1:0,owner_id);
}
export async function deleteLocalCycle(date:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error("Invalid date");
 const db=await localDatabase();await db.runAsync("DELETE FROM cycle_journal WHERE entry_date=?",date);
}
export async function markCycleSynced(entry:CycleEntry,owner_id:string){
 const db=await localDatabase();
 const e=validateCycle(entry);
 // Don't mark a newer edit as synced while an older snapshot was being uploaded.
 await db.runAsync(
  "UPDATE cycle_journal SET dirty=0, owner_id=? WHERE entry_date=? AND flow=? AND pain=? AND notes=? AND period_start=? AND dirty=1",
  owner_id,e.entry_date,e.flow,e.pain,e.notes,e.period_start?1:0
 );
}
export async function mergeLocalCycles(entries:CycleEntry[],options:{owner_id?:string;dirty?:boolean}={}):Promise<{added:number;skipped:number}>{
 const db=await localDatabase();
 let added=0,skipped=0;
 // Never overwrite a local record during backup restore or cloud import.
 for(const entry of entries){
  const e=validateCycle(entry);
  const result=await db.runAsync("INSERT OR IGNORE INTO cycle_journal(entry_date,flow,pain,notes,period_start,dirty,owner_id) VALUES(?,?,?,?,?,?,?)",e.entry_date,e.flow,e.pain,e.notes,e.period_start?1:0,options.dirty===false?0:1,options.owner_id??null);
  if(result.changes)added++;else skipped++;
 }
 return {added,skipped};
}
export async function migrateSecureStoreDiary():Promise<number>{
 // Non-destructive migration: legacy entries stay in SecureStore if any operation fails.
 const db=await localDatabase();
 const legacy=await import("./offlineCycle");
 const entries=await legacy.listOfflineCycles();
 let imported=0;
 for(const e of entries){
  const result=await db.runAsync("INSERT OR IGNORE INTO cycle_journal(entry_date,flow,pain,notes,period_start,dirty,owner_id) VALUES(?,?,?,?,?,1,NULL)",e.entry_date,e.flow,e.pain,e.notes,e.period_start?1:0);
  imported+=result.changes;
 }
 return imported;
}
