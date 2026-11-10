import {useState} from "react";
import {Pressable,StyleSheet,Text,View} from "react-native";
import {Card} from "./Screen";
import {localDate} from "../lib/date";
import {listOfflineCycles,saveOfflineCycle} from "../lib/offlineCycle";
import {theme as c} from "../lib/theme";
import type {CycleEntry} from "../lib/tracking";

const options:{label:string;flow:CycleEntry["flow"];period_start:boolean}[]=[
 {label:"No bleeding",flow:"none",period_start:false},
 {label:"Spotting",flow:"spotting",period_start:false},
 {label:"Light",flow:"light",period_start:false},
 {label:"Medium",flow:"medium",period_start:false},
 {label:"Heavy",flow:"heavy",period_start:false},
];
/** Quick entries are explicit: tapping a choice only selects; Save commits it.
 * Existing daily records are never silently overwritten.
 */
export default function QuickCycleCheckin(){
 const [selection,setSelection]=useState<CycleEntry["flow"]|null>(null);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 async function save(){
  if(selection===null||busy)return;
  setBusy(true);setMessage("");
  try{
   const today=localDate();
   const existing=(await listOfflineCycles()).find(x=>x.entry_date===today);
   if(existing){setMessage("You already logged today. Open Cycle to review your diary; this shortcut will not overwrite it.");return}
   await saveOfflineCycle({entry_date:today,flow:selection,pain:0,notes:"",period_start:false});
   setSelection(null);
   setMessage("Saved privately on this device. You can add pain and notes in Cycle.");
  }catch(e){setMessage(e instanceof Error?e.message:"Unable to save check-in")}
  finally{setBusy(false)}
 }
 return <Card title="🌷 Quick daily check-in" body="How is your bleeding today? Choose one and save. No account or internet required.">
  <View style={s.choices}>{options.map(x=><Pressable key={x.flow} accessibilityRole="radio" accessibilityState={{checked:selection===x.flow}} onPress={()=>{setSelection(x.flow);setMessage("")}} style={[s.choice,selection===x.flow&&s.selected]}><Text style={[s.choiceText,selection===x.flow&&s.selectedText]}>{x.label}</Text></Pressable>)}</View>
  <Pressable accessibilityRole="button" accessibilityState={{disabled:selection===null||busy}} disabled={selection===null||busy} onPress={()=>void save()} style={[s.save,(selection===null||busy)&&s.disabled]}><Text style={s.saveText}>{busy?"Saving…":"Save today's check-in"}</Text></Pressable>
  {message?<Text accessibilityRole="alert" style={s.message}>{message}</Text>:null}
  <Text style={s.hint}>Quick logging records pain as 0 (not assessed) and never marks a new period start. For full details, use Cycle.</Text>
 </Card>;
}
const s=StyleSheet.create({choices:{flexDirection:"row",flexWrap:"wrap",gap:8},choice:{borderRadius:18,backgroundColor:"white",borderWidth:1,borderColor:"#e6dbe3",paddingHorizontal:12,paddingVertical:10},selected:{backgroundColor:c.rose,borderColor:c.rose},choiceText:{color:c.ink,fontWeight:"600"},selectedText:{color:"white"},save:{backgroundColor:c.rose,padding:14,borderRadius:14},disabled:{opacity:.45},saveText:{textAlign:"center",fontWeight:"800",color:"white"},message:{color:c.ink,lineHeight:20},hint:{fontSize:12,color:c.muted,lineHeight:18}});
