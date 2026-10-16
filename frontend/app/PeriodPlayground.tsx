"use client";
import {useEffect,useState} from "react";
const API=process.env.NEXT_PUBLIC_API_URL||"https://minime-lab-api.onrender.com";
type Phase={name:string;start:number;end:number};
type Period={phases:Phase[];notice:string};
export default function PeriodPlayground(){
 const [cycle,setCycle]=useState(28),[length,setLength]=useState(5),[data,setData]=useState<Period|null>(null),[selected,setSelected]=useState(1),[error,setError]=useState(false);
 useEffect(()=>{const ctrl=new AbortController();setError(false);fetch(API+"/api/period",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cycle_length:cycle,period_length:length}),signal:ctrl.signal}).then(async r=>{if(!r.ok)throw Error("Request failed");return r.json()}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(true)});return()=>ctrl.abort()},[cycle,length]);
 const phases=data?.phases??[];
 const active=phases.filter(p=>selected>=p.start&&selected<=p.end);
 return <div className="mt-5 space-y-5">
 <div className="grid gap-5 sm:grid-cols-2"><label className="font-semibold">Cycle length: {cycle} days<input aria-label="Cycle length" className="mt-3 w-full" type="range" min="21" max="35" value={cycle} onChange={e=>{const v=+e.target.value;setCycle(v);setSelected(Math.min(selected,v))}}/></label><label className="font-semibold">Period length: {length} days<input aria-label="Period length" className="mt-3 w-full" type="range" min="2" max="10" value={length} onChange={e=>setLength(+e.target.value)}/></label></div>
 <p className="text-sm text-slate-600">Tap a day to explore what can happen during a cycle. Phases overlap.</p>
 <div className="grid grid-cols-7 gap-2">{Array.from({length:cycle},(_,i)=>i+1).map(d=><button key={d} onClick={()=>setSelected(d)} aria-pressed={selected===d} className={"rounded-xl px-1 py-3 text-sm font-semibold transition hover:scale-105 "+(selected===d?"bg-violet-600 text-white shadow-lg":d<=length?"bg-pink":"bg-lavender")}>{d}</button>)}</div>
 <div className="rounded-2xl bg-mint p-5" aria-live="polite"><p className="text-xs font-bold uppercase tracking-widest text-slate-600">Day {selected}</p><h3 className="mt-2 text-xl font-black">{active.length?active.map(p=>p.name).join(" + "):"Explore the cycle"}</h3><p className="mt-2 text-sm">These are approximate phases, not a prediction of your individual hormones or fertility.</p></div>
 <p className="text-sm text-slate-600">{error?"API unavailable — try again shortly.":data?.notice??"Loading interactive cycle model…"}</p>
 </div>
}
