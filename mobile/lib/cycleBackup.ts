import {gcm} from "@noble/ciphers/aes";
import {bytesToHex,hexToBytes,utf8ToBytes,bytesToUtf8} from "@noble/ciphers/utils";
import {pbkdf2} from "@noble/hashes/pbkdf2";
import {sha256} from "@noble/hashes/sha256";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import {getLocalCycles,mergeLocalCycles,validateCycle} from "./localDatabase";
import type {CycleEntry} from "./tracking";

const iterations=150000;
type Envelope={format:"minime-cycle-backup";version:1;kdf:"pbkdf2-sha256";iterations:number;salt:string;nonce:string;ciphertext:string};
function derive(password:string,salt:Uint8Array,count:number){
 if(password.length<12)throw Error("Backup passphrase must have at least 12 characters");
 return pbkdf2(sha256,utf8ToBytes(password),salt,{c:count,dkLen:32});
}
function decodeEnvelope(value:unknown):Envelope{
 if(!value||typeof value!=="object")throw Error("Invalid backup");
 const e=value as Envelope;
 if(e.format!=="minime-cycle-backup"||e.version!==1||e.kdf!=="pbkdf2-sha256"||e.iterations!==iterations||typeof e.ciphertext!=="string"||typeof e.salt!=="string"||typeof e.nonce!=="string")throw Error("Unsupported or invalid backup");
 if(e.ciphertext.length>4_000_000||!/^([0-9a-f]{2})+$/.test(e.ciphertext)||!/^[0-9a-f]{32}$/.test(e.salt)||!/^[0-9a-f]{24}$/.test(e.nonce))throw Error("Invalid encrypted backup data");
 return e;
}
export async function createEncryptedBackup(password:string):Promise<string>{
 const salt=Crypto.getRandomBytes(16),nonce=Crypto.getRandomBytes(12);
 const key=derive(password,salt,iterations);
 const records=(await getLocalCycles()).map(({dirty,owner_id,...entry})=>entry);
 const payload=JSON.stringify({version:1,created_at:new Date().toISOString(),entries:records});
 const ciphertext=gcm(key,nonce).encrypt(utf8ToBytes(payload));
 const envelope:Envelope={format:"minime-cycle-backup",version:1,kdf:"pbkdf2-sha256",iterations,salt:bytesToHex(salt),nonce:bytesToHex(nonce),ciphertext:bytesToHex(ciphertext)};
 return JSON.stringify(envelope);
}
/** Only ciphertext is written to the temporary file. The passphrase never persists. */
export async function shareEncryptedBackup(password:string):Promise<number>{
 const body=await createEncryptedBackup(password);
 if(!await Sharing.isAvailableAsync())throw Error("File sharing is unavailable on this device");
 const file=(FileSystem.cacheDirectory??FileSystem.documentDirectory)+"minime-cycle-backup-"+Date.now()+".minime";
 await FileSystem.writeAsStringAsync(file,body,{encoding:FileSystem.EncodingType.UTF8});
 try{await Sharing.shareAsync(file,{mimeType:"application/octet-stream",dialogTitle:"Save encrypted MiniMe backup"});}
 finally{await FileSystem.deleteAsync(file,{idempotent:true})}
 return body.length;
}
export async function restoreEncryptedBackup(password:string):Promise<{added:number;skipped:number}>{
 const picked=await DocumentPicker.getDocumentAsync({type:"*/*",copyToCacheDirectory:true,multiple:false});
 if(picked.canceled)throw Error("Import cancelled");
 const asset=picked.assets[0];
 if(asset.size&&asset.size>2_000_000)throw Error("Backup file is too large");
 const text=await FileSystem.readAsStringAsync(asset.uri,{encoding:FileSystem.EncodingType.UTF8});
 if(text.length>2_000_000)throw Error("Backup file is too large");
 let parsed:unknown;try{parsed=JSON.parse(text)}catch{throw Error("Invalid backup JSON")}
 const envelope=decodeEnvelope(parsed);
 let data:unknown;
 try{
  const key=derive(password,hexToBytes(envelope.salt),iterations);
  const plain=gcm(key,hexToBytes(envelope.nonce)).decrypt(hexToBytes(envelope.ciphertext));
  data=JSON.parse(bytesToUtf8(plain));
 }catch{throw Error("Wrong passphrase or damaged backup; no records were imported")}
 const payload=data as {version?:number;entries?:unknown};
 if(payload?.version!==1||!Array.isArray(payload.entries)||payload.entries.length>2000)throw Error("Invalid backup contents");
 const records:CycleEntry[]=payload.entries.map(raw=>{
  if(!raw||typeof raw!=="object")throw Error("Invalid entry in backup");
  const e=raw as CycleEntry;
  return validateCycle(e);
 });
 return mergeLocalCycles(records);
}
