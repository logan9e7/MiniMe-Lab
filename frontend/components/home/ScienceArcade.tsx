"use client";
import {useState} from "react";
import FertilityLab from "../../features/fertility/FertilityLab";
import TwinsLab from "../../features/genetics/TwinsLab";
import PeriodPlayground from "../../features/periods/PeriodPlayground";
import BirthdayLab from "../../features/pregnancy/BirthdayLab";
import SafeSexLab from "../../features/safe-sex/SafeSexLab";
import PregnancyJourney from "../../features/pregnancy/PregnancyJourney";
import DiscoveryCards from "../../features/education/DiscoveryCards";
const modules=[["🥚","Fertility Lab","Explore estimated ovulation and timing"],["🎂","Birthday Time Machine","Explore illustrative conception dates"],["👯","Twin Universe","Learn why twins happen"],["🌸","Period Explorer","Understand the menstrual cycle"],["🤰","Pregnancy Journey","Explore pregnancy stages"],["💬","No-Awkward-Questions","Reproductive health without stigma"],["💜","Safe Sex & Rights","Contraception, consent and women’s rights"]];

export default function ScienceArcade(){const [active,setActive]=useState(0);return (<>{/* Interactive lab selection */}<section className="mt-14" aria-labelledby="explore-labs-title"><p className="section-kicker">Keep exploring</p><h2 id="explore-labs-title" className="mt-2 text-3xl font-black">The science arcade is still here 🎉</h2><p className="mt-2 max-w-xl text-slate-600">All the original fun stays: twin mysteries, chromosome games, birthday time machine, genetics playground and interactive biology labs.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map(([icon,title,desc],i)=><button key={title} onClick={()=>{setActive(i);document.getElementById("lab")?.scrollIntoView({behavior:"smooth"})}} type="button" aria-pressed={active===i} className="panel module-card p-6 text-left"><div className="text-5xl">{icon}</div><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 text-sm text-slate-600">{desc}</p><span className="mt-5 inline-block text-sm font-bold text-violet-700">Open lab →</span></button>)}</div></section>
<section id="lab" className="panel mt-6 p-6 md:p-10" aria-live="polite"><h2 className="text-3xl font-black">{modules[active][0]} {modules[active][1]}</h2>
{active===0&&<FertilityLab/>}
{active===1&&<BirthdayLab/>}
{active===2&&<TwinsLab/>}
{active===3&&<PeriodPlayground/>}
{active===4&&<PregnancyJourney/>}
{active===5&&<DiscoveryCards/>}
{active===6&&<SafeSexLab/>}
</section></>);}
