import {useEffect,useState} from "react";
import {Pressable,StyleSheet,Text,TextInput,View,Alert} from "react-native";
import {Card} from "./Screen";
import {theme as c} from "../lib/theme";
import {shareEncryptedBackup,restoreEncryptedBackup} from "../lib/cycleBackup";
import {syncLocalCycles,importCloudCycles} from "../lib/cycleSync";
import {getReminderEnabled,enableDailyReminder,disableDailyReminder} from "../lib/reminders";
import {migrateSecureStoreDiary,clearLocalDiary} from "../lib/localDatabase";
export default function DiaryControls(){
 const [passphrase,setPassphrase]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const [remind,setRemind]=useState(false),[hour,setHour]=useState("20"),[minute,setMinute]=useState("00");
 useEffect(()=>{void getReminderEnabled().then(setRemind).catch(()=>{});},[]);
 async function run(task:()=>Promise<string>){
  if(busy)return;setBusy(true);setMessage("");
  try{setMessage(await task())}catch(e){setMessage(e instanceof Error?e.message:"Action failed")}finally{setBusy(false)}
 }
 async function restore(){
  if(passphrase.length<12){setMessage("Use your 12+ character backup passphrase.");return}
  Alert.alert("Restore diary backup?","Existing dates will not be overwritten. New records will stay on this device until you explicitly sync.",[
   {text:"Cancel",style:"cancel"},
   {text:"Choose encrypted file",onPress:()=>void run(async()=>{const r=await restoreEncryptedBackup(passphrase);setPassphrase("");return `Imported ${r.added} entries; skipped ${r.skipped} existing dates.`})}
  ]);
 }
 return <View style={s.stack}>
  <Card title="🔒 Encrypted backup" body="Export a password-protected diary file. Keep the password safe: we cannot recover it. Share only to storage you trust.">
   <TextInput accessibilityLabel="Backup passphrase" placeholder="Backup passphrase (12+ characters)" secureTextEntry autoCapitalize="none" value={passphrase} onChangeText={setPassphrase} style={s.input}/>
   <View style={s.row}>
    <Pressable disabled={busy} onPress={()=>void run(async()=>{const bytes=await shareEncryptedBackup(passphrase);setPassphrase("");return `Encrypted backup shared (${bytes} bytes).`})} style={s.button}><Text style={s.buttonText}>Export backup</Text></Pressable>
    <Pressable disabled={busy} onPress={()=>void restore()} style={s.button}><Text style={s.buttonText}>Restore backup</Text></Pressable>
   </View>
  </Card>
  <Card tone="mint" title="☁️ Manual cloud sync" body="Nothing uploads automatically. Sign in before syncing. If a date exists in both places, your local record stays pending and the cloud record is never overwritten.">
   <View style={s.row}>
    <Pressable disabled={busy} onPress={()=>void run(async()=>{const r=await syncLocalCycles();return `Uploaded ${r.uploaded}. Conflicts ${r.alreadyOnServer}. Other-account entries ${r.skippedOtherAccount}.`})} style={s.button}><Text style={s.buttonText}>Upload pending</Text></Pressable>
    <Pressable disabled={busy} onPress={()=>void run(async()=>{const r=await importCloudCycles();return `Imported ${r.added}, skipped ${r.skipped} existing dates.`})} style={s.button}><Text style={s.buttonText}>Import cloud</Text></Pressable>
   </View>
  </Card>
  <Card tone="lavender" title="🔔 Gentle daily reminder" body="Optional device-only notification, with neutral lock-screen wording. No server or push-token registration.">
   <View style={s.row}><TextInput accessibilityLabel="Reminder hour" keyboardType="number-pad" maxLength={2} value={hour} onChangeText={setHour} style={s.time}/><Text>:</Text><TextInput accessibilityLabel="Reminder minute" keyboardType="number-pad" maxLength={2} value={minute} onChangeText={setMinute} style={s.time}/></View>
   <Pressable disabled={busy} onPress={()=>void run(async()=>{if(remind){await disableDailyReminder();setRemind(false);return "Daily reminder disabled."}await enableDailyReminder(Number(hour),Number(minute));setRemind(true);return "Daily reminder enabled."})} style={s.button}><Text style={s.buttonText}>{remind?"Disable reminder":"Enable daily reminder"}</Text></Pressable>
  </Card>
  <Card title="Upgrade previous diary" body="If you used an earlier Android preview, copy its protected local entries into the encrypted database without deleting originals.">
   <Pressable disabled={busy} onPress={()=>void run(async()=>`Migrated ${await migrateSecureStoreDiary()} entries. Existing records were preserved.`)} style={s.button}><Text style={s.buttonText}>Import old local entries</Text></Pressable>
  </Card>
  <Card title="Delete device diary" body="Permanently delete entries saved in the encrypted local database. This does not delete your cloud account records or legacy SecureStore entries.">
   <Pressable disabled={busy} style={[s.button,{backgroundColor:"#7c2849"}]} onPress={()=>Alert.alert("Delete device diary?","This permanently deletes all local database entries. Export a backup first. Cloud records and legacy entries will remain.",[
    {text:"Cancel",style:"cancel"},
    {text:"Delete local entries",style:"destructive",onPress:()=>void run(async()=>{await clearLocalDiary();return "Local database diary deleted."})}
   ])}><Text style={s.buttonText}>Delete local diary</Text></Pressable>
  </Card>
  {message?<Text accessibilityRole="alert" style={s.message}>{message}</Text>:null}
 </View>
}
const s=StyleSheet.create({stack:{gap:14},row:{flexDirection:"row",alignItems:"center",gap:8,flexWrap:"wrap"},input:{backgroundColor:"white",borderRadius:12,padding:12,fontSize:15},time:{width:64,backgroundColor:"white",textAlign:"center",padding:12,borderRadius:12},button:{backgroundColor:c.rose,padding:12,borderRadius:14},buttonText:{fontWeight:"800",color:"white"},message:{color:c.ink,fontSize:14,lineHeight:22}});
