"use client";
import {useState} from "react";
import {saferSex,rights,quickAnswers,type InfoCard} from "./content";
import {mensHealth} from "./mensHealth";
import HealthEducation from "./HealthEducation";
type Tab="basics"|"compare"|"men"|"rights"|"questions";
function Cards({items}:{items:InfoCard[]}){return <div className="grid gap-4 md:grid-cols-2">{items.map(item=><article key={item.title} className="rounded-2xl border border-violet-100 bg-white p-5"><h3 className="text-lg font-black">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>{item.link&&<a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-violet-700 underline">{item.linkLabel||"Read official source"}</a>}</article>)}</div>}
export default function SafeSexLab(){
 const [tab,setTab]=useState<Tab>("basics");
 return <section className="space-y-5" aria-labelledby="safe-sex-title">
 <div className="rounded-3xl bg-gradient-to-r from-violet-100 to-pink-100 p-6"><p className="text-xs font-black uppercase tracking-widest text-violet-800">No shame · Just facts</p><h2 id="safe-sex-title" className="mt-2 text-3xl font-black">💜 Safe Sex & Women's Rights</h2><p className="mt-3 max-w-3xl text-sm leading-6">For unmarried adult women and anyone seeking reliable sexual-health education. Learn about pregnancy prevention, STI protection, consent and rights in India. Your relationship status does not change your right to respectful information.</p><p className="mt-3 text-xs text-slate-600">Adults 18+. Educational information only; not medical or legal advice. Indian legal information is jurisdiction-specific and may change.</p></div>
 <div className="flex flex-wrap gap-2" role="tablist" aria-label="Safe sex topics">{([["basics","Protection & health"],["compare","Explore & compare"],["men","Men’s health"],["rights","Rights in India"],["questions","Common questions"]] as const).map(([id,label])=><button type="button" role="tab" aria-selected={tab===id} key={id} onClick={()=>setTab(id)} className={"rounded-full px-4 py-3 text-sm font-bold "+(tab===id?"bg-violet-700 text-white":"bg-violet-100 text-violet-900")}>{label}</button>)}</div>
 {tab==="basics"&&<Cards items={saferSex}/>}
 {tab==="compare"&&<HealthEducation/>}
 {tab==="men"&&<><p className="rounded-2xl bg-violet-50 p-4 text-sm text-slate-700">Common sexual and reproductive health questions for men and anyone with a penis or testicles. Symptoms are not diagnoses. Seek clinical advice when concerned.</p><Cards items={mensHealth}/></>}
 {tab==="rights"&&<><div className="rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm"><strong>Know your rights.</strong> Being unmarried does not by itself disqualify an adult woman from reproductive healthcare. Abortion access is governed by specific legal and clinical conditions; do not interpret this guide as an automatic entitlement at every gestational stage.</div><Cards items={rights}/></>}
 {tab==="questions"&&<div className="space-y-3">{quickAnswers.map(item=><details key={item.q} className="rounded-2xl border border-violet-100 bg-white p-4"><summary className="cursor-pointer font-bold">{item.q}</summary><p className="mt-3 text-sm leading-6 text-slate-700">{item.a}</p></details>)}</div>}
 <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-900"><strong>When to seek urgent help:</strong> Severe pain, fainting, heavy bleeding, sexual violence, or possible HIV exposure require prompt professional attention. In immediate danger in India, call <a href="tel:112" className="font-bold underline">112</a>.</div>
 </section>
}
