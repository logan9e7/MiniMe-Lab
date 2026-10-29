"use client";
import {useState} from "react";
const primary=[
{href:"/",label:"Home",icon:"⌂",sub:[]},
{href:"/labs/",label:"Explore games",icon:"✦",sub:[["Science arcade","/labs/#lab"],["Genetics playground","/labs/"]]},
{href:"/science/",label:"Science labs",icon:"🧬",sub:[["Biology","/science/"],["Hormones","/science/"]]},
{href:"/safe-sex/",label:"Safe sex & rights",icon:"♡",sub:[["Sex education","/safe-sex/"],["Protection","/safe-sex/#contraception"]]},
{href:"/periods/diary/",label:"My diary",icon:"◷",sub:[["Cycle calendar","/periods/diary/#calendar"],["Symptoms","/periods/diary/#record"]]},
{href:"/pregnancy/",label:"Pregnancy",icon:"✿",sub:[["Timeline","/pregnancy/#timeline"],["Check-ins","/pregnancy/#checkins"]]},
{href:"/health-library/",label:"Health library",icon:"✚",sub:[["Conditions","/health-library/"]]},
{href:"/companion/",label:"Companion",icon:"✧",sub:[["Ask","/companion/#ask"]]}
];
export default function AppNavigation(){const [open,setOpen]=useState(false);const path=typeof window!=="undefined"?window.location.pathname:"/";const active=primary.find(x=>x.href==="/"?path==="/":path.startsWith(x.href))||primary[0];return <><header className="app-topbar"><a href="/" className="brand-mark" aria-label="MiniMe Lab home"><span aria-hidden="true">🥚</span><span>MiniMe <b>Lab</b></span></a><span className="brand-caption">Learn · Play · Discover ✨</span><button className="app-menu-button" aria-expanded={open} aria-controls="app-menu" onClick={()=>setOpen(!open)} type="button">{open?"Close":"Menu"} ☰</button><nav id="app-menu" aria-label="Primary navigation" className={"app-desktop-nav "+(open?"is-open":"")}>{primary.map(x=><a href={x.href} key={x.label} aria-current={active.label===x.label?"page":undefined} onClick={()=>setOpen(false)}>{x.label}</a>)}</nav></header>{active.sub.length>0&&<nav aria-label={active.label+" sections"} className="mb-5 flex flex-wrap gap-2">{active.sub.map(([label,href])=><a key={label} href={href} className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-900 hover:bg-violet-50">{label}</a>)}</nav>}<nav className="app-bottom-nav" aria-label="Mobile navigation">{primary.map(x=><a key={x.label} href={x.href} aria-current={active.label===x.label?"page":undefined}><span aria-hidden="true">{x.icon}</span><small>{x.label}</small></a>)}</nav></>}
