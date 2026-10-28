import type {PeriodEntry} from "./types";
const day=(s:string)=>Date.parse(s+"T12:00:00Z")/86400000;
export type CycleMetrics={intervals:number[];starts:string[];mean:number|null;median:number|null;sd:number|null;min:number|null;max:number|null;cv:number|null;sampleSize:number;excluded:number};
export function cycleMetrics(entries:PeriodEntry[]):CycleMetrics{
 const starts=[...new Set(entries.filter(e=>e.periodStart===true&&["light","medium","heavy"].includes(e.flow)).map(e=>e.date))].sort();
 const intervals:number[]=[];let excluded=0;
 for(let i=1;i<starts.length;i++){const gap=day(starts[i])-day(starts[i-1]);if(gap>=15&&gap<=90)intervals.push(gap);else excluded++}
 const n=intervals.length,mean=n?intervals.reduce((a,b)=>a+b,0)/n:null;
 const sorted=[...intervals].sort((a,b)=>a-b);
 const median=n?(sorted[Math.floor((n-1)/2)]+sorted[Math.floor(n/2)])/2:null;
 const sd=n>=2&&mean!==null?Math.sqrt(intervals.reduce((s,x)=>s+(x-mean)**2,0)/(n-1)):null;
 return {starts,intervals,mean,median,sd,min:n?sorted[0]:null,max:n?sorted[n-1]:null,cv:sd!==null&&mean!==null?sd/mean:null,sampleSize:n,excluded};
}
export function symptomMetrics(entries:PeriodEntry[]){
 const counts=new Map<string,number>();const logged=entries.length;
 for(const e of entries)for(const s of new Set(e.symptoms))counts.set(s,(counts.get(s)||0)+1);
 return [...counts].map(([symptom,count])=>({symptom,count,percent:logged?100*count/logged:0,denominator:logged})).sort((a,b)=>b.count-a.count);
}
export function painSeries(entries:PeriodEntry[]){return [...entries].sort((a,b)=>a.date.localeCompare(b.date)).slice(-30).map(e=>({date:e.date,pain:e.pain}))}
