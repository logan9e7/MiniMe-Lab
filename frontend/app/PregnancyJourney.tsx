"use client";
import {useEffect,useState} from "react";
const API=process.env.NEXT_PUBLIC_API_URL||"https://minime-lab-api.onrender.com";
type Result={week:number;trimester:number;notice:string};
const stages=[["🌱","Early beginnings","Cells develop and the foundations of major organs form."],["🫧","Growing and changing","Development continues throughout the second trimester."],["🌟","Getting ready","Growth and maturation continue toward birth."]];
export default function PregnancyJourney(){
 const [week,setWeek]=useState(12),[data,setData]=useState<Result|null>(null),[error,setError]=useState(false);
 useEffect(()=>{const ctrl=new AbortController();setError(false);fetch(API+"/api/pregnancy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({week}),signal:ctrl.signal}).then(async r=>{if(!r.ok)throw Error("API unavailable");return r.json()}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(true)});return()=>ctrl.abort()},[week]);
 const trimester=data?.trimester??(week<=12?1:week<=27?2:3),stage=stages[trimester-1];
 return <div className="mt-6 space-y-5"><label className="block font-semibold">Travel to week {week}<input className="mt-4 w-full" type="range" min="1" max="42" value={week} onChange={e=>setWeek(+e.target.value)}/></label>
 <div className="flex flex-wrap gap-2">{[8,16,24,32,40].map(w=><button key={w} onClick={()=>setWeek(w)} className={"rounded-full px-4 py-2 text-sm font-semibold "+(week===w?"bg-violet-600 text-white":"bg-lavender")}>Week {w}</button>)}</div>
 <div className="rounded-3xl bg-mint p-8 text-center" aria-live="polite"><div className="text-7xl" aria-hidden="true">{stage[0]}</div><p className="mt-5 text-sm font-bold uppercase tracking-widest">Trimester {trimester}</p><h3 className="mt-2 text-2xl font-black">{stage[1]}</h3><p className="mx-auto mt-3 max-w-md">{stage[2]}</p></div>
 <p className="text-sm text-slate-600">{error?"The API is resting; this educational view still works.":data?.notice??"Loading educational milestones…"}</p></div>
}
