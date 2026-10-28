"use client";
import {useEffect,useState} from "react";
type Fertility={estimated_ovulation_day:number;illustrative_window_start:number;illustrative_window_end:number;within_illustrative_window:boolean;pregnancy_probability:null;disclaimer:string};
export default function ApiScience({cycle,day}:{cycle:number;day:number}){
 const [result,setResult]=useState<Fertility|null>(null);
 const [status,setStatus]=useState<"loading"|"ready"|"error">("loading");
 useEffect(()=>{const abort=new AbortController();setStatus("loading");
 fetch((process.env.NEXT_PUBLIC_API_URL||"https://minime-lab-api.onrender.com")+"/api/fertility",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cycle_length:cycle,intercourse_day:day}),signal:abort.signal})
 .then(async r=>{if(!r.ok)throw new Error("API unavailable");return await r.json()})
 .then((data:Fertility)=>{setResult(data);setStatus("ready")})
 .catch(e=>{if(e.name!=="AbortError"){setResult(null);setStatus("error")}});
 return ()=>abort.abort()},[cycle,day]);
 return <div className="mt-4 rounded-2xl border border-violet-200 bg-white p-5" aria-live="polite">
 <h3 className="font-bold">🧪 Python science engine</h3>
 {status==="loading"&&<p className="mt-2 text-sm">Checking calculation with FastAPI… Free hosting may take a moment to wake.</p>}
 {status==="error"&&<p className="mt-2 text-sm">API temporarily unavailable. The visual calendar above is illustrative only.</p>}
 {status==="ready"&&result&&<><p className="mt-2">Estimated ovulation: day <strong>{result.estimated_ovulation_day}</strong></p><p>Illustrative fertile window: days <strong>{result.illustrative_window_start}–{result.illustrative_window_end}</strong></p><p className="mt-2 font-semibold">{result.within_illustrative_window?"Selected day falls within the illustrative window.":"Selected day falls outside the illustrative window."}</p><p className="mt-3 text-sm text-slate-600">{result.disclaimer}</p></>}
 </div>
}
