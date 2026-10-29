"use client";
import {useEffect,useState} from "react";
import PregnancyJourney from "./PregnancyJourney";
import {KEY,parseRecords,validDate as valid,localDate as today,type RecordData} from "./storage";
export default function PregnancyTracker(){
 const [data,setData]=useState<RecordData>({dueDate:"",checkins:[]}),[ready,setReady]=useState(false),[symptoms,setSymptoms]=useState(""),[notes,setNotes]=useState(""),[message,setMessage]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){setData(parseRecords(raw))}}catch{}setReady(true)},[]);
 function save(next:RecordData){try{localStorage.setItem(KEY,JSON.stringify(next));setData(next);setMessage("Saved on this browser.")}catch{setMessage("Unable to save. Check browser storage settings.")}}
 const days=data.dueDate&&valid(data.dueDate)?Math.round((Date.parse(data.dueDate+"T12:00:00Z")-Date.parse(today()+"T12:00:00Z"))/86400000):null;
 const week=days===null?null:Math.max(1,Math.min(42,Math.floor((280-days)/7)));
 if(!ready)return <p>Opening pregnancy tracker…</p>;
 return <div className="space-y-7">
 <section id="timeline" className="rounded-3xl bg-rose-50 p-5"><h2 className="text-2xl font-black">Pregnancy timeline</h2><p className="mt-2 text-sm text-slate-700">A personal place to record dates and questions. Your estimated due date may change after a clinical assessment.</p>
 <label className="mt-4 block text-sm font-bold">Estimated due date (optional)<input className="mt-2 block w-full max-w-sm rounded-xl border border-rose-200 bg-white p-3" type="date" value={data.dueDate} onChange={e=>save({...data,dueDate:e.target.value})}/></label>
 {week!==null&&<p className="mt-3 font-semibold">Approximately week {week} by the date entered. This is not medical dating.</p>}
 <PregnancyJourney/></section>
 <section id="checkins" className="rounded-3xl border border-rose-100 bg-white p-5"><h2 className="text-xl font-black">Private check-ins</h2><p className="mt-2 text-sm text-slate-600">Write what you want to discuss with a clinician. Entries remain in this browser and are not encrypted.</p>
 <label className="mt-4 block text-sm font-semibold">How are you feeling?<input maxLength={120} value={symptoms} onChange={e=>setSymptoms(e.target.value)} className="mt-2 w-full rounded-xl border p-3" placeholder="Fatigue, nausea, energy, or other observations"/></label>
 <label className="mt-4 block text-sm font-semibold">Notes<textarea maxLength={500} value={notes} onChange={e=>setNotes(e.target.value)} className="mt-2 w-full rounded-xl border p-3" rows={3}/></label>
 <button type="button" className="mt-3 rounded-xl bg-rose-700 px-5 py-3 font-bold text-white" onClick={()=>{if(!symptoms.trim()&&!notes.trim())return;save({...data,checkins:[{date:today(),symptoms,notes},...data.checkins].slice(0,300)});setSymptoms("");setNotes("")}}>Save check-in</button>
 <div className="mt-4 space-y-2">{data.checkins.slice(0,10).map((x,i)=><div key={i} className="rounded-xl bg-rose-50 p-3 text-sm"><strong>{x.date}</strong><p>{x.symptoms}</p><p>{x.notes}</p></div>)}</div></section>
 <section id="appointments" className="rounded-3xl bg-violet-50 p-5"><h2 className="text-xl font-black">Prepare for an appointment</h2><p className="mt-2 text-sm">Review your check-ins, note questions, and ask your healthcare professional about any worrying symptoms. Severe pain, heavy bleeding, fainting or other urgent symptoms require immediate medical assessment.</p></section>
 <section className="rounded-2xl border p-4"><h3 className="font-bold">Your data controls</h3><p className="mt-1 text-sm">This pregnancy log is stored only in unencrypted browser storage, not synced to the diary or server. Other users of this browser profile may see it.</p><button className="mt-3 rounded-lg border border-rose-300 px-4 py-2 font-semibold" type="button" onClick={()=>{if(confirm("Delete all pregnancy check-ins and due date from this browser?")){try{localStorage.removeItem(KEY);setData({dueDate:"",checkins:[]});setMessage("Pregnancy tracking data deleted.")}catch{setMessage("Deletion failed.")}}}}>Delete pregnancy tracking data</button></section>
 {message&&<p role="status" className="text-sm">{message}</p>}
 </div>;
}
