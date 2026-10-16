"use client";
import {useEffect,useState} from "react";
const API=process.env.NEXT_PUBLIC_API_URL||"https://minime-lab-api.onrender.com";
type Article={title:string;url:string;source:string};
type Gene={symbol:string;url:string;source:string};
const choices=[["fertility","🥚 Fertility"],["pregnancy","🤰 Pregnancy"],["menstruation","🌸 Periods"],["genetics","🧬 Genetics"],["twins","👯 Twins"],["chromosomes","🔬 Chromosomes"]];
export default function ScienceLibrary(){
 const [topic,setTopic]=useState("genetics"),[articles,setArticles]=useState<Article[]>([]),[genes,setGenes]=useState<Gene[]>([]),[busy,setBusy]=useState(true),[error,setError]=useState(false);
 useEffect(()=>{const ctrl=new AbortController();setBusy(true);setError(false);fetch(API+"/api/science/search?topic="+encodeURIComponent(topic),{signal:ctrl.signal}).then(async r=>{if(!r.ok)throw Error("Unavailable");return r.json()}).then(d=>setArticles(d.articles||[])).catch(e=>{if(e.name!=="AbortError"){setError(true);setArticles([])}}).finally(()=>{if(!ctrl.signal.aborted)setBusy(false)});return()=>ctrl.abort()},[topic]);
 useEffect(()=>{const ctrl=new AbortController();fetch(API+"/api/science/genes",{signal:ctrl.signal}).then(r=>r.json()).then(d=>setGenes(d.genes||[])).catch(()=>{});return()=>ctrl.abort()},[]);
 return <section className="panel mt-8 p-6 md:p-10"><p className="text-xs font-bold uppercase tracking-widest text-violet-600">Powered by public science data</p><h2 className="mt-3 text-3xl font-black">🔬 Science Discovery Hub</h2><p className="mt-3 text-slate-600">Pick a topic and explore real educational articles from the US National Library of Medicine. No AI-made facts.</p>
 <div className="mt-5 flex flex-wrap gap-2">{choices.map(([id,label])=><button key={id} aria-pressed={topic===id} onClick={()=>setTopic(id)} className={"rounded-full px-4 py-2 text-sm font-semibold transition "+(topic===id?"bg-violet-600 text-white":"bg-lavender hover:bg-pink")}>{label}</button>)}</div>
 <div className="mt-6 grid gap-3 md:grid-cols-2" aria-live="polite">{busy?<p>Finding science articles…</p>:error?<p>Science source unavailable right now. Try again later.</p>:articles.length?articles.map((a,i)=><a key={a.url+i} href={a.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-400"><p className="font-bold">{a.title} ↗</p><p className="mt-2 text-xs text-slate-500">{a.source}</p></a>):<p>No articles returned for this topic. Try another.</p>}</div>
 <h3 className="mt-8 text-xl font-black">🧬 Meet a gene</h3><p className="mt-2 text-sm text-slate-600">Explore curated gene reference pages. These are educational examples, not personal genetic risk results.</p><div className="mt-4 flex flex-wrap gap-2">{genes.map(g=><a key={g.symbol} href={g.url} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-mint px-4 py-3 font-bold hover:underline">{g.symbol} ↗</a>)}</div>
 <p className="mt-6 text-xs text-slate-500">Source: MedlinePlus, U.S. National Library of Medicine. External resources are informational, not medical advice. MiniMe Lab is not endorsed by MedlinePlus.</p>
 </section>
}
