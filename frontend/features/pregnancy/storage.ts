/** Browser-local pregnancy records. No cloud sync or implicit migration. */
export type CheckIn = {date:string;symptoms:string;notes:string};
export type RecordData = {dueDate:string;checkins:CheckIn[]};
export const KEY = "minime.pregnancy.v1";
export function validDate(value:unknown):value is string {
 if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const d=new Date(value+"T12:00:00Z");
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;
}
function validCheckIn(value:unknown):value is CheckIn {
 if(!value||typeof value!=="object")return false;
 const x=value as Partial<CheckIn>;
 return validDate(x.date)&&typeof x.notes==="string"&&x.notes.length<=500&&typeof x.symptoms==="string"&&x.symptoms.length<=120;
}
export function parseRecords(raw:string):RecordData {
 const d:unknown=JSON.parse(raw);
 if(!d||typeof d!=="object")throw Error("Invalid pregnancy record");
 const value=d as Partial<RecordData>;
 if(!Array.isArray(value.checkins))throw Error("Invalid pregnancy check-ins");
 return {dueDate:validDate(value.dueDate)?value.dueDate:"",checkins:value.checkins.filter(validCheckIn).slice(0,300)};
}
export function localDate(now:Date=new Date()):string {
 return `${now.getFullYear().toString().padStart(4,"0")}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
}
