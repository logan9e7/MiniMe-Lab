import "react-native-url-polyfill/auto";
import {AppState} from "react-native";
import * as SecureStore from "expo-secure-store";
import {createClient} from "@supabase/supabase-js";

const url=process.env.EXPO_PUBLIC_SUPABASE_URL;
const key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Session tokens are credentials. Keep them in OS-backed encrypted storage,
// never in plaintext AsyncStorage. Expo SecureStore can reject oversized values;
// surface that error rather than silently downgrading to insecure storage.
const secureStorage={
  getItem:(k:string)=>SecureStore.getItemAsync(k),
  setItem:async(k:string,v:string)=>{await SecureStore.setItemAsync(k,v,{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});},
  removeItem:(k:string)=>SecureStore.deleteItemAsync(k),
};
export const supabase=url&&key?createClient(url,key,{
 auth:{storage:secureStorage,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false},
}):null;
if(supabase){
 AppState.addEventListener("change",state=>{
  if(state==="active")supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
 });
}
