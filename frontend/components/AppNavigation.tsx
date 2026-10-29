"use client";
import {useState} from "react";
const primary=[
{href:"/",label:"Today",icon:"⌂",sub:[["Overview","/"],["Science guides","/#learning"],["Play arcade","/#lab"]]},
{href:"/periods/diary/",label:"Cycle",icon:"◷",sub:[["Calendar","/periods/diary/#calendar"],["Symptoms","/periods/diary/#record"],["Patterns","/periods/diary/#insights"]]},
{href:"/pregnancy/",label:"Pregnancy",icon:"♡",sub:[["Timeline","/pregnancy/#timeline"],["Check-ins","/pregnancy/#checkins"],["Appointments","/pregnancy/#appointments"]]},
{href:"/safe-sex/",label:"Learn",icon:"✿",sub:[["Sex ed","/safe-sex/"],["Protection","/safe-sex/#contraception"],["Fun labs","/#lab"]]},
{href:"/health-library/",label:"Health",icon:"✚",sub:[["Conditions","/health-library/"],["Cancer awareness","/health-library/"],["Pelvic health","/health-library/"]]},
{href:"/companion/",label:"Companion",icon:"✧",sub:[["Ask","/companion/#ask"],["Prepare","/companion/#prepare"],["Privacy","/companion/#privacy"]]}
];
export default function AppNavigation(){
 const [open,setOpen]=useState(false);
 const path=typeof window!=="undefined"?window.location.pathname:"/";
 const active=primary.find(x=>x.href==="/"?path==="/":path.startsWith(x.href))||primary[0];
 return <>
 <header className="app-topbar"><a href="/" className="brand-mark" aria-label="MiniMe Lab home"><span aria-hidden="true">✿</span><span>MiniMe <b>Lab</b></span></a><span className="brand-caption">Your body. Your rhythm. Your choice.</span><button className="app-menu-button" aria-expanded={open} aria-controls="app-menu" onClick={()=>setOpen(!open)} type="button">{open?"Close":"Menu"} ☰</button><nav id="app-menu" aria-label="Primary navigation" className={"app-desktop-nav "+(open?"is-open":"")}>{primary.map(x=><a href={x.href} key={x.label} aria-current={active.label===x.label?"page":undefined} onClick={()=>setOpen(false)}>{x.label}</a>)}</nav></header>
 <nav aria-label={active.label+" sections"} className="mb-5 flex flex-wrap gap-2">{active.sub.map(([label,href])=><a key={label} href={href} className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700">{label}</a>)}</nav>
 <nav className="app-bottom-nav" aria-label="Mobile navigation">{primary.map(x=><a key={x.label} href={x.href} aria-current={active.label===x.label?"page":undefined}><span aria-hidden="true">{x.icon}</span><small>{x.label}</small></a>)}</nav>
 </>;
}
