/** Optional local WebAssembly math accelerator. Never uploads health data. */
export type WasmSummary={count:number;mean:number;median:number;sd:number|null;min:number;max:number;cv:number|null};
type WasmExports={memory:WebAssembly.Memory;cycle_stats:(input:number,count:number,output:number)=>void;malloc:(bytes:number)=>number;free:(ptr:number)=>void};
let cached:Promise<WasmExports|null>|undefined;
async function load():Promise<WasmExports|null>{
 if(typeof window==="undefined"||typeof WebAssembly==="undefined")return null;
 try{
  const response=await fetch("/wasm/diary_math.wasm",{cache:"force-cache"});
  if(!response.ok)return null;
  const bytes=await response.arrayBuffer();
  const result=await WebAssembly.instantiate(bytes,{env:{}});const exp=result.instance.exports as unknown as WasmExports;
  if(!exp.memory||!exp.cycle_stats||!exp.malloc||!exp.free)return null;
  return exp;
 }catch{return null}
}
export async function wasmCycleSummary(intervals:number[]):Promise<WasmSummary|null>{
 if(!cached)cached=load();const exp=await cached;
 if(!exp||!intervals.length||intervals.length>1000)return null;
 const inPtr=exp.malloc(intervals.length*8),outPtr=exp.malloc(7*8);
 if(!inPtr||!outPtr){if(inPtr)exp.free(inPtr);if(outPtr)exp.free(outPtr);return null}
 try{
  new Float64Array(exp.memory.buffer,inPtr,intervals.length).set(intervals);
  exp.cycle_stats(inPtr,intervals.length,outPtr);
  const x=Array.from(new Float64Array(exp.memory.buffer,outPtr,7));
  if(!Number.isFinite(x[0])||x[0]<1)return null;
  return {count:x[0],mean:x[1],median:x[2],sd:Number.isFinite(x[3])?x[3]:null,min:x[4],max:x[5],cv:Number.isFinite(x[6])?x[6]:null};
 }catch{return null}finally{exp.free(inPtr);exp.free(outPtr)}
}
