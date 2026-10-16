"use client";
import {useEffect,useState} from "react";
const API=process.env.NEXT_PUBLIC_API_URL||"https://minime-lab-api.onrender.com";
type Topic={title:string;summary:string};
const fallback=[{title:"Cycle variation",summary:"Cycles and ovulation timing vary."},{title:"Twin biology",summary:"Identical and fraternal twins have different biological origins."},{title:"Pregnancy dating",summary:"Clinical dating commonly begins at the last menstrual period."}];
export default function DiscoveryCards(){
 const [topics,setTopics]=useState<Topic[]>(fallback),[index,setIndex]=useState(0),[revealed,setRevealed]=useState(false);
 useEffect(()=>{const ctrl=new AbortController();fetch(API+"/api/education",{signal:ctrl.signal}).then(r=>r.json()).then(d=>{if(Array.isArray(d.topics)&&d.topics.length)setTopics(d.topics)}).catch(()=>{});return()=>ctrl.abort()},[]);
 const item=topics[index%topics.length];
 return <div className="mt-6 space-y-4"><p className="text-sm text-slate-600">Flip a science card and discover something new.</p><button onClick={()=>setRevealed(!revealed)} className="block w-full rounded-3xl bg-lavender p-10 text-center shadow-sm transition hover:scale-[1.01]" aria-label="Flip learning card"><div className="text-5xl">{revealed?"💡":"❔"}</div><p className="mt-5 text-xl font-black">{revealed?item.summary:item.title}</p><p className="mt-4 text-sm">{revealed?"Tap to flip back":"Tap to reveal"}</p></button><button onClick={()=>{setIndex((index+1)%topics.length);setRevealed(false)}} className="rounded-full bg-violet-600 px-6 py-3 font-bold text-white">Next surprise →</button></div>
}
