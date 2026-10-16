"use client";
import {useEffect,useState} from "react";
const BASE=process.env.NEXT_PUBLIC_API_URL||"https://minime-lab-api.onrender.com";
type TwinGuide={types:{name:string;origin:string}[];personal_probability:null;notice:string};
export default function TwinScience(){
 const [data,setData]=useState<TwinGuide|null>(null);
 const [error,setError]=useState(false);
 useEffect(()=>{const ctrl=new AbortController();fetch(BASE+"/api/twins/guide",{signal:ctrl.signal}).then(r=>{if(!r.ok)throw Error("API");return r.json()}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(true)});return()=>ctrl.abort()},[]);
 return <div className="mt-5 rounded-2xl bg-lavender p-5" aria-live="polite">
 <h3 className="font-bold">🧬 Twin biology API</h3>
 {data? <><div className="mt-3 grid gap-3 sm:grid-cols-2">{data.types.map(item=><article key={item.name} className="rounded-xl bg-white p-4"><b>{item.name}</b><p className="mt-2 text-sm">{item.origin}</p></article>)}</div><p className="mt-3 text-sm">{data.notice}</p></>:<p className="mt-2 text-sm">{error?"API is unavailable; the explanations above remain available.":"Loading biology guide…"}</p>}
 </div>
}
