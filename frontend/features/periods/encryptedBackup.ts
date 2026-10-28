/** Encrypted diary backup format v1. AES-GCM + PBKDF2 SHA-256; all cryptography runs locally. */
import type {PeriodEntry} from "./types";
import {parseDiaryBackup,validateEntry} from "./storage";
const encoder=new TextEncoder(),decoder=new TextDecoder();
const toB64=(a:Uint8Array)=>btoa(Array.from(a,x=>String.fromCharCode(x)).join(""));
const fromB64=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const iterations=310000;
async function keyFor(password:string,salt:Uint8Array,rounds:number){
 const base=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveKey"]);
 return crypto.subtle.deriveKey({name:"PBKDF2",salt:new Uint8Array(salt),iterations:rounds,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
}
export async function encryptDiary(entries:PeriodEntry[],password:string):Promise<string>{
 if(password.length<12)throw Error("Use a password of at least 12 characters.");
 if(entries.length>1000||!entries.every(validateEntry))throw Error("Invalid diary entries");
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await keyFor(password,salt,iterations);
 const plaintext=encoder.encode(JSON.stringify({format:"minime-period-diary",version:2,entries}));
 const ciphertext=await crypto.subtle.encrypt({name:"AES-GCM",iv:new Uint8Array(iv)},key,plaintext);
 return JSON.stringify({format:"minime-encrypted-diary",version:1,kdf:"PBKDF2-SHA256",iterations,salt:toB64(salt),iv:toB64(iv),ciphertext:toB64(new Uint8Array(ciphertext))},null,2);
}
export async function decryptDiary(text:string,password:string):Promise<PeriodEntry[]>{
 if(text.length>1500000||!password)throw Error("Invalid encrypted backup");
 const b=JSON.parse(text) as Record<string,unknown>;
 if(!b||b.format!=="minime-encrypted-diary"||b.version!==1||b.kdf!=="PBKDF2-SHA256"||b.iterations!==iterations||typeof b.salt!=="string"||typeof b.iv!=="string"||typeof b.ciphertext!=="string")throw Error("Unsupported backup format");
 const salt=fromB64(b.salt),iv=fromB64(b.iv),cipher=fromB64(b.ciphertext);
 if(salt.length!==16||iv.length!==12||cipher.length>1100000)throw Error("Invalid backup structure");
 const key=await keyFor(password,salt,iterations);
 const plaintext=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(iv)},key,cipher);
 return parseDiaryBackup(decoder.decode(plaintext));
}
export function downloadText(text:string,filename:string){
 const url=URL.createObjectURL(new Blob([text],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
