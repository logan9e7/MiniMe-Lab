import {supabase} from "./supabase";
export type CycleEntry={id?:string;entry_date:string;flow:"none"|"spotting"|"light"|"medium"|"heavy";pain:number;notes:string;period_start:boolean};
export type PregnancyEntry={id?:string;entry_date:string;symptoms:string;notes:string};
function client(){if(!supabase)throw Error("Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");return supabase}
async function userId(){const {data,error}=await client().auth.getUser();if(error||!data.user)throw Error("Sign in to sync your private records.");return data.user.id}
export async function listCycles():Promise<CycleEntry[]>{await userId();const {data,error}=await client().from("cycle_entries").select("id,entry_date,flow,pain,notes,period_start").order("entry_date",{ascending:false}).limit(90);if(error)throw error;return data??[]}
export async function addCycle(entry:CycleEntry){const user_id=await userId();const {error}=await client().from("cycle_entries").upsert({...entry,user_id},{onConflict:"user_id,entry_date"});if(error)throw error}
export async function listPregnancy():Promise<PregnancyEntry[]>{await userId();const {data,error}=await client().from("pregnancy_checkins").select("id,entry_date,symptoms,notes").order("entry_date",{ascending:false}).limit(90);if(error)throw error;return data??[]}
export async function addPregnancy(entry:PregnancyEntry){const user_id=await userId();const {error}=await client().from("pregnancy_checkins").insert({...entry,user_id});if(error)throw error}
