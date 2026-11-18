import test from "node:test";
import assert from "node:assert/strict";
import {sameCycle,pendingBatches} from "./cycleSyncCore.ts";

const example={
 entry_date:"2026-11-18",flow:"light",pain:3,notes:"test entry",period_start:false
};
test("identical local/cloud content can be acknowledged",()=>{
 assert.equal(sameCycle(example,{...example}),true);
});
test("matching dates with differing content remain conflicts",()=>{
 for(const change of [
  {flow:"heavy"},{pain:6},{notes:"new note"},{period_start:true},
  {entry_date:"2026-11-19"}
 ])assert.equal(sameCycle(example,{...example,...change}),false);
});
test("large local histories are split into bounded query chunks without dropping dates",()=>{
 const entries=Array.from({length:2351},(_,i)=>({entry_date:String(i)}));
 const batches=pendingBatches(entries,100);
 assert.equal(batches.length,24);
 assert.ok(batches.every(chunk=>chunk.length<=100));
 assert.deepEqual(batches.flat(),entries);
 assert.deepEqual(pendingBatches([]),[]);
});
test("invalid lookup batch sizes are rejected",()=>{
 assert.throws(()=>pendingBatches([1],0));
 assert.throws(()=>pendingBatches([1],501));
});
