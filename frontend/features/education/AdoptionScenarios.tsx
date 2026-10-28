"use client";
import {useState} from "react";
type Choice={label:string;feedback:string;supportive:boolean};
type Scenario={title:string;context:string;choices:Choice[];source:string};
const scenarios:Scenario[]=[
 {title:"A question about belonging",context:"Your fictional child asks: 'Why don't I look like everyone else in our family?' What would you say?",choices:[
  {label:"Invite questions and share an age-appropriate, honest story",feedback:"A thoughtful approach. Children benefit from truthful, age-appropriate conversations and room to ask questions.",supportive:true},
  {label:"Tell them never to ask again",feedback:"Silencing questions can undermine trust. Try listening and reassuring the child that questions are welcome.",supportive:false},
  {label:"Invent a story to avoid the topic",feedback:"Made-up origin stories can damage trust. Honest, age-appropriate explanations are preferable.",supportive:false}],source:"https://www.childwelfare.gov/topics/adoption/adopt-parenting/"},
 {title:"Respecting privacy",context:"A relative asks you to share your fictional child's background and personal history at a family gathering.",choices:[
  {label:"Let the child guide what is shared, considering their age and safety",feedback:"Good instinct. A child's history is personal; respect their privacy and growing autonomy.",supportive:true},
  {label:"Share every detail to satisfy curiosity",feedback:"The child is entitled to privacy. Curiosity from others does not create a right to personal information.",supportive:false},
  {label:"Pretend the child has no past",feedback:"Children have histories and identities worth respecting. Privacy is different from erasing their story.",supportive:false}],source:"https://www.unicef.org/child-rights-convention"},
 {title:"Supporting big feelings",context:"Your fictional child feels sad or confused about their early life. How do you respond?",choices:[
  {label:"Listen, validate their feelings and seek qualified support if needed",feedback:"Supportive parenting allows mixed emotions. Adoption can include joy, grief, curiosity and complex feelings.",supportive:true},
  {label:"Insist they should only feel grateful",feedback:"Children do not owe gratitude for care. Allowing complex feelings builds emotional safety.",supportive:false},
  {label:"Dismiss it as a passing phase",feedback:"Even when feelings change, listening now matters. Offer space to talk without judgment.",supportive:false}],source:"https://www.childwelfare.gov/topics/adoption/adopt-parenting/"}
];
export default function AdoptionScenarios(){const [index,setIndex]=useState(0),[selected,setSelected]=useState<number|null>(null),[complete,setComplete]=useState(false);const current=scenarios[index];
return <section className="mt-5 rounded-2xl border border-amber-200 bg-white p-5" aria-labelledby="parenting-title">
 <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Interactive parenting stories · {index+1}/{scenarios.length}</p>
 <h4 id="parenting-title" className="mt-2 text-xl font-black">{current.title}</h4><p className="mt-2">{current.context}</p>
 <div className="mt-4 space-y-2" role="group" aria-label="Choose how you would respond">{current.choices.map((choice,i)=><button key={choice.label} type="button" disabled={selected!==null} onClick={()=>setSelected(i)} className={"block w-full rounded-xl border-2 p-3 text-left text-sm font-semibold disabled:cursor-default "+(selected===i?"border-violet-700 bg-violet-100":"border-slate-200 bg-slate-50")}>{choice.label}</button>)}</div>
 {selected!==null&&<div role="status" className="mt-4 rounded-xl bg-amber-50 p-4"><p className="font-bold">{current.choices[selected].supportive?"A supportive response 💛":"Let's explore a more supportive response 💛"}</p><p className="mt-1 text-sm">{current.choices[selected].feedback}</p><a className="mt-2 inline-block text-sm font-semibold text-violet-700 underline" href={current.source} target="_blank" rel="noopener noreferrer">Explore child welfare guidance ↗</a></div>}
 <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" disabled={selected===null} onClick={()=>{if(index===scenarios.length-1){setComplete(true);setIndex(0)}else setIndex(n=>n+1);setSelected(null)}} className="rounded-xl bg-amber-700 px-5 py-3 font-bold text-white disabled:opacity-40">{index===scenarios.length-1?"Finish parenting stories":"Next story →"}</button><button type="button" onClick={()=>{setIndex(0);setSelected(null);setComplete(false)}} className="rounded-xl border px-4 py-3 font-semibold">Restart</button></div>
 {complete&&<p role="status" className="mt-3 font-bold text-emerald-700">You completed the parenting stories! Caring for children is about trust, safety and lifelong learning.</p>}
 <p className="mt-3 text-xs text-slate-600">Fictional educational scenarios, not legal advice, a suitability assessment or an adoption application. Responses are not saved.</p>
 </section>}
