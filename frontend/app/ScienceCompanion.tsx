"use client";
import {useState} from "react";
const API=process.env.NEXT_PUBLIC_API_URL||"https://minime-lab-api.onrender.com";
type Source={title:string;summary?:string;url:string;source:string};
type Result={topic:string|null;status:string;message:string;sources:Source[]};
const ideas=["Why do twins happen?","What happens during ovulation?","What are chromosomes?","How does pregnancy develop?"];
export default function ScienceCompanion(){
 const [question,setQuestion]=useState(""),[result,setResult]=useState<Result|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
 async function submit(value:string){if(value.trim().length<5)return;setQuestion(value);setLoading(true);setResult(null);setError("");try{const r=await fetch(API+"/api/discover/ask?question="+encodeURIComponent(value));if(!r.ok)throw Error("Science API unavailable");setResult(await r.json())}catch{setError("The science library could not be reached. Try again shortly.")}finally{setLoading(false)}}
 return <section className="mt-10 rounded-3xl bg-gradient-to-br from-purple-100 to-emerald-100 p-6 md:p-10" aria-label="Science companion">
 <p className="text-xs font-bold uppercase tracking-widest text-violet-700">🤖 Your source-grounded science buddy</p><h2 className="mt-3 text-3xl font-black">Ask MiniMe anything about biology</h2><p className="mt-3 max-w-2xl text-slate-700">Our science buddy finds relevant reading from trusted sources. It won't guess your fertility, interpret DNA tests, or make medical diagnoses.</p>
 <div className="mt-5 flex flex-wrap gap-2">{ideas.map(q=><button key={q} onClick={()=>void submit(q)} className="rounded-full bg-white px-3 py-2 text-sm font-semibold hover:bg-violet-50">{q}</button>)}</div>
 <form onSubmit={e=>{e.preventDefault();void submit(question)}} className="mt-5 flex flex-col gap-3 sm:flex-row"><input className="min-w-0 flex-1 rounded-2xl bg-white p-4" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={200} placeholder="Ask your curious question…" aria-label="Question for science buddy"/><button disabled={loading||question.trim().length<5} className="rounded-2xl bg-violet-700 px-6 py-3 font-bold text-white disabled:opacity-50">{loading?"Searching…":"Find the science →"}</button></form>
 {error&&<p role="status" className="mt-4 text-sm">{error}</p>}
 {result&&<div className="mt-6 rounded-2xl bg-white p-5" aria-live="polite"><p className="font-bold">🔎 {result.status==="retrieved"?"Here's what I found":"Science buddy"}</p><p className="mt-2 text-sm text-slate-600">{result.message}</p>{result.sources.length>0&&<div className="mt-4 grid gap-3 md:grid-cols-2">{result.sources.map((s,i)=><a key={s.url+i} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border p-4 hover:border-violet-500"><b>{s.title} ↗</b>{s.summary&&<p className="mt-2 text-sm text-slate-600">{s.summary}</p>}<p className="mt-2 text-xs text-violet-700">{s.source}</p></a>)}</div>}</div>}
 <p className="mt-5 text-xs text-slate-600">Source retrieval, not a generative LLM. Original articles are linked for verification. Educational use only.</p></section>
}
