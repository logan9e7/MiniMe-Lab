import {useEffect,useRef,useState} from "react";
import {supabase} from "./supabase";
import {privateHistory} from "./privateHistory";

export function usePrivateHistory<T>(load:()=>Promise<T[]>,reset:()=>void){
 const [items,setItems]=useState<T[]>([]),[error,setError]=useState("");
 const resetRef=useRef(reset);resetRef.current=reset;
 const controller=useRef<ReturnType<typeof privateHistory<T>>|null>(null);
 useEffect(()=>{
  const history=privateHistory(load,setItems,setError);controller.current=history;
  if(!supabase){setError("Supabase is not configured.");return ()=>history.dispose()}
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
   if(history.changeOwner(session?.user.id??null)){
    resetRef.current();setError("");
    // Defer API work until the synchronous auth callback has completed.
    setTimeout(()=>{void history.refresh()},0);
   }
  });
  return ()=>{subscription.unsubscribe();history.dispose();controller.current=null};
 },[load]);
 return {items,error,refresh:()=>controller.current?.refresh()??Promise.resolve()};
}
