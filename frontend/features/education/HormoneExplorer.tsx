"use client";
import {useState} from "react";
/** Illustrative curves, NOT measured concentrations or a personal prediction. */
const gaussian=(x:number,mu:number,sigma:number)=>Math.exp(-0.5*((x-mu)/sigma)**2);
const clamp=(x:number)=>Math.max(0,Math.min(100,x));
export function illustrativeHormones(day:number,length:number){
 const phase=day/length,ov=0.50;
 return {estrogen:clamp(16+58*gaussian(phase,ov-0.055,0.115)+21*gaussian(phase,0.74,0.12)),progesterone:clamp(8+74*gaussian(phase,0.75,0.14)),lh:clamp(5+90*gaussian(phase,ov,0.032)),fsh:clamp(12+36*gaussian(phase,ov,0.055)+16*gaussian(phase,0.04,0.08))};
}
const series=[["estrogen","Estrogen","#b56d91"],["progesterone","Progesterone","#5b8c79"],["lh","LH","#8058ad"],["fsh","FSH","#a97936"]] as const;
export default function HormoneExplorer(){
 const [day,setDay]=useState(12),[length,setLength]=useState(28);
 const points=Array.from({length:101},(_,i)=>({x:i/100*length,...illustrativeHormones(i/100*length,length)}));
 const current=illustrativeHormones(day,length);
 return <section className="space-y-4 rounded-3xl border border-violet-100 bg-white p-5" aria-labelledby="hormone-title">
 <h3 id="hormone-title" className="text-2xl font-black">🧪 Hormone cycle explorer</h3>
 <p className="text-sm text-slate-700">A mathematical illustration of how four hormones may change across a teaching example. Curves are normalized to 0–100 for comparison: these are <strong>not actual hormone concentrations</strong>, diagnostic thresholds, ovulation estimates or personalized fertility predictions.</p>
 <label className="block text-sm font-semibold">Illustrative cycle length: {length} days<input type="range" min="21" max="35" value={length} onChange={e=>{const n=+e.target.value;setLength(n);setDay(d=>Math.min(d,n))}} className="mt-2 w-full"/></label>
 <label className="block text-sm font-semibold">Explore day {day}<input type="range" min="1" max={length} value={day} onChange={e=>setDay(+e.target.value)} className="mt-2 w-full"/></label>
 <svg viewBox="0 0 360 210" className="w-full rounded-2xl bg-violet-50" role="img" aria-label={"Illustrative normalized hormone curves for "+length+" days; selected day "+day}>
 <line x1="34" y1="175" x2="340" y2="175" stroke="#786b83"/><line x1="34" y1="16" x2="34" y2="175" stroke="#786b83"/>
 {[0,50,100].map(v=><g key={v}><text x="7" y={179-v*1.5} fontSize="10" fill="#555">{v}</text><line x1="34" x2="340" y1={175-v*1.5} y2={175-v*1.5} stroke="#ded5e6"/></g>)}
 {series.map(([key,,color])=><polyline key={key} points={points.map(p=>[34+p.x/length*306,175-p[key]*1.5].join(",")).join(" ")} stroke={color} strokeWidth="2.5" fill="none"/>)}
 <line x1={34+day/length*306} x2={34+day/length*306} y1="16" y2="175" stroke="#333" strokeDasharray="4 4"/><text x="155" y="202" fontSize="11">Illustrative cycle day</text>
 </svg>
 <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{series.map(([key,label,color])=><div key={key} className="rounded-xl bg-violet-50 p-3"><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{backgroundColor:color}}/><span className="text-sm font-bold">{label}</span></div><p className="mt-1 text-xl font-black">{Math.round(current[key])}<span className="text-xs font-normal"> / 100</span></p></div>)}</div>
 <p className="text-xs text-slate-600">Model: sums of Gaussian curves f(x)=A·exp(−½((x−μ)/σ)²), with illustrative peak positions and widths. Actual hormone timing varies widely, especially with irregular cycles, pregnancy, medication and health conditions. Never use this chart for contraception.</p>
 <a href="https://www.nichd.nih.gov/health/topics/menstruation/conditioninfo" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-violet-700 underline">Read menstrual cycle science (NIH)</a>
 </section>
}
