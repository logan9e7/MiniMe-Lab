import {cycleMetrics} from "./analytics";\nimport type {PeriodEntry,Flow,Mood} from "./types";

const KEY="minime.period-diary.v1";
const FLOWS:Flow[]=["none","spotting","light","medium","heavy"];
const MOODS:Mood[]=["not_recorded","good","neutral","low","anxious"];
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const SYMPTOMS=["Cramps","Headache","Fatigue","Bloating","Nausea","Backache","Breast tenderness"];

function validDate(value:unknown):value is string {
  if(typeof value!=="string"||!DATE.test(value))return false;
  const d=new Date(value+"T12:00:00Z");
  return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value;
}
export function validateEntry(v:unknown):v is PeriodEntry{
  if(!v||typeof v!=="object")return false;
  const e=v as Partial<PeriodEntry>;
  return validDate(e.date)&&FLOWS.includes(e.flow as Flow)&&
    typeof e.pain==="number"&&Number.isInteger(e.pain)&&e.pain>=0&&e.pain<=10&&
    MOODS.includes(e.mood as Mood)&&Array.isArray(e.symptoms)&&e.symptoms.length<=SYMPTOMS.length&&
    e.symptoms.every(s=>typeof s==="string"&&SYMPTOMS.includes(s))&&
    (e.periodStart===undefined||typeof e.periodStart==="boolean")&&
    (e.periodStart!==true||["light","medium","heavy"].includes(e.flow as Flow))&&
    typeof e.notes==="string"&&e.notes.length<=500&&typeof e.updatedAt==="string";
}
export function readEntries():PeriodEntry[]{
  try{
    const raw=window.localStorage.getItem(KEY);
    if(!raw)return [];
    const parsed:unknown=JSON.parse(raw);
    return Array.isArray(parsed)?parsed.filter(validateEntry).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,1000):[];
  }catch{return []}
}
export function saveEntries(entries:PeriodEntry[]):void{
  if(entries.length>1000||!entries.every(validateEntry))throw Error("Invalid diary records");
  window.localStorage.setItem(KEY,JSON.stringify(entries));
}
export function clearEntries():void{window.localStorage.removeItem(KEY)}
export function downloadEntries(entries:PeriodEntry[]):void{
  const blob=new Blob([JSON.stringify({format:"minime-period-diary",version:2,exportedAt:new Date().toISOString(),entries},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="minime-period-diary.json";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function cycleIntervals(entries:PeriodEntry[]):number[]{
  return cycleMetrics(entries).intervals;
}
