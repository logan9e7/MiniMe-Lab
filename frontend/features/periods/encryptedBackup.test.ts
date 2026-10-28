import {test} from "node:test";
import assert from "node:assert/strict";
import {webcrypto} from "node:crypto";
import {encryptDiary,decryptDiary} from "./encryptedBackup.ts";
Object.defineProperty(globalThis,"crypto",{value:webcrypto,configurable:true});
const entry={date:"2026-01-01",flow:"medium",periodStart:true,pain:2,mood:"neutral",symptoms:[],notes:"sensitive",updatedAt:"2026-01-01T00:00:00Z"} as const;
test("encrypted backup round-trip",async()=>{const data=await encryptDiary([entry as any],"strong password example");assert.ok(!data.includes("sensitive"));assert.equal((await decryptDiary(data,"strong password example")).length,1)});
test("wrong password rejected",async()=>{const data=await encryptDiary([entry as any],"strong password example");await assert.rejects(()=>decryptDiary(data,"incorrect password example"))});
