import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";
const reminderKey="minime.reminder.daily.notification.id.v1";
const channel="minime-gentle-reminders";
export async function getReminderEnabled():Promise<boolean>{
 const id=await SecureStore.getItemAsync(reminderKey);
 if(!id)return false;
 const all=await Notifications.getAllScheduledNotificationsAsync();
 return all.some(x=>x.identifier===id);
}
export async function enableDailyReminder(hour:number,minute:number):Promise<void>{
 if(!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59)throw Error("Invalid reminder time");
 if(Platform.OS==="android")await Notifications.setNotificationChannelAsync(channel,{
  name:"Gentle daily reminders",importance:Notifications.AndroidImportance.DEFAULT,
  description:"Optional private check-in reminders without health details"
 });
 const current=await Notifications.getPermissionsAsync();
 const permission=current.granted?current:await Notifications.requestPermissionsAsync();
 if(!permission.granted)throw Error("Notifications are disabled. Enable permission in Android settings.");
 await disableDailyReminder();
 const identifier=await Notifications.scheduleNotificationAsync({
  content:{title:"A moment for yourself",body:"Your daily check-in is here whenever you want it.",sound:false},
  trigger:{type:Notifications.SchedulableTriggerInputTypes.DAILY,hour,minute,channelId:Platform.OS==="android"?channel:undefined}
 });
 await SecureStore.setItemAsync(reminderKey,identifier);
}
export async function disableDailyReminder():Promise<void>{
 const id=await SecureStore.getItemAsync(reminderKey);
 if(id){await Notifications.cancelScheduledNotificationAsync(id);await SecureStore.deleteItemAsync(reminderKey)}
}
