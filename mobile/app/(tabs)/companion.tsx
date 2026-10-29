import {useEffect,useState} from "react";
import {Alert,Text,TextInput,Pressable,View,StyleSheet,ActivityIndicator} from "react-native";
import {Screen,Card} from "../../components/Screen";
import {supabase} from "../../lib/supabase";
import {theme as c} from "../../lib/theme";
export default function Companion(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[message,setMessage]=useState(""),[signed,setSigned]=useState(false),[busy,setBusy]=useState(false);
 useEffect(()=>{
  if(!supabase)return;
  let active=true;
  void supabase.auth.getSession().then(({data})=>{if(active){setSigned(Boolean(data.session));setEmail(data.session?.user.email||"")}});
  const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{if(active){setSigned(Boolean(session));if(session?.user.email)setEmail(session.user.email)}});
  return ()=>{active=false;listener.subscription.unsubscribe()};
 },[]);
 async function auth(signUp:boolean){
  if(!supabase){setMessage("Supabase configuration is missing.");return}
  if(!/^\S+@\S+\.\S+$/.test(email)){setMessage("Enter a valid email address.");return}
  if(password.length<12){setMessage("Use a password of at least 12 characters.");return}
  setBusy(true);setMessage("");
  try{
   const result=signUp?await supabase.auth.signUp({email:email.trim(),password}):await supabase.auth.signInWithPassword({email:email.trim(),password});
   if(result.error)throw result.error;
   setPassword("");
   setMessage(signUp?"Check your email for a verification link. Sign in after confirming.":"Signed in securely.");
  }catch(e){setMessage(e instanceof Error?e.message:"Authentication failed")}
  finally{setBusy(false)}
 }
 async function signOut(){
  if(!supabase)return;
  setBusy(true);
  const {error}=await supabase.auth.signOut();
  setBusy(false);
  setMessage(error?error.message:"Signed out.");
 }
 function confirmClear(){
  if(!supabase)return;
  Alert.alert("Delete your tracking records?","This permanently deletes all synced period and pregnancy check-ins. This cannot be undone.",[
   {text:"Cancel",style:"cancel"},
   {text:"Delete records",style:"destructive",onPress:()=>void clearRecords()}
  ]);
 }
 async function clearRecords(){
  if(!supabase)return;
  setBusy(true);
  try{
   const {data:{user},error}=await supabase.auth.getUser();
   if(error||!user)throw Error("Sign in again.");
   for(const table of ["cycle_entries","pregnancy_checkins"]){
    const {error:deleteError}=await supabase.from(table).delete().eq("user_id",user.id);
    if(deleteError)throw deleteError;
   }
   setMessage("Your synced tracking records were deleted.");
  }catch(e){setMessage(e instanceof Error?e.message:"Deletion failed.")}
  finally{setBusy(false)}
 }
 return <Screen title="Your companion ♡" subtitle="A gentle space for questions, tracking and privacy.">
 <Card title="🔐 Your account">
 {signed?<><Text style={{fontWeight:"700"}}>Signed in as {email}</Text><Pressable disabled={busy} onPress={()=>void signOut()} style={s.button}><Text style={s.label}>Sign out</Text></Pressable></>:<>
 <Text>Email</Text><TextInput accessibilityLabel="Email address" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={email} onChangeText={setEmail} style={s.input}/>
 <Text>Password (12+ characters)</Text><TextInput accessibilityLabel="Password" secureTextEntry autoComplete="password" value={password} onChangeText={setPassword} style={s.input}/>
 <View style={s.row}><Pressable disabled={busy} onPress={()=>void auth(false)} style={s.button}><Text style={s.label}>Sign in</Text></Pressable><Pressable disabled={busy} onPress={()=>void auth(true)} style={s.button}><Text style={s.label}>Create account</Text></Pressable></View>
 </>}
 {busy?<ActivityIndicator accessibilityLabel="Working" color={c.rose}/>:null}
 {message?<Text accessibilityRole="alert">{message}</Text>:null}
 </Card>
 <Card tone="mint" title="🗨️ Questions welcome" body="Sexual-health questions deserve evidence-based answers. Explore the original science companion and playful labs from Learn."/>
 <Card tone="lavender" title="Privacy first" body="Your records are account-scoped in Supabase. They are not shared with the AI companion. Cloud records are not end-to-end encrypted.">
 {signed?<Pressable onPress={confirmClear} disabled={busy} style={[s.button,{backgroundColor:"#7c2849"}]}><Text style={s.label}>Delete my tracking records</Text></Pressable>:null}
 </Card>
 </Screen>
}
const s=StyleSheet.create({input:{backgroundColor:"#fff",borderRadius:12,padding:12,minHeight:48},row:{flexDirection:"row",gap:10,flexWrap:"wrap"},button:{backgroundColor:c.rose,padding:13,borderRadius:14},label:{color:"#fff",fontWeight:"800"}});
