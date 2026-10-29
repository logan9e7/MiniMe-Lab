/** Invalidate outstanding reads before clearing data on account changes. */
export function privateHistory<T>(load:()=>Promise<T[]>,publish:(items:T[])=>void,onError:(message:string)=>void){
 let generation=0,owner:string|null=null,disposed=false;
 async function refresh(){
  if(disposed||!owner)return;
  const request=++generation;
  try{const items=await load();if(!disposed&&request===generation)publish(items)}
  catch(e){if(!disposed&&request===generation)onError(e instanceof Error?e.message:"Unable to load records")}
 }
 return {
  changeOwner(next:string|null){
   if(disposed||next===owner)return false;
   owner=next;++generation;publish([]);return true;
  },
  refresh,
  dispose(){disposed=true;++generation},
 };
}
