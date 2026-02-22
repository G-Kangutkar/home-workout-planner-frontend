import { getMessaging, getToken } from "firebase/messaging";
import { messaging } from "./firebase/firebase";
//  import {app} from './firebase/firebase';

// const messaging = getMessaging(app)

export const requestNotificationPermission = async () => {
    try {
         const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Permission denied");
    return null;
  }
  const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
     await navigator.serviceWorker.ready;
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
     serviceWorkerRegistration: registration,
  });

  if (token) {
    console.log("FCM Token:", token);
    return token;
  } else {
    console.log("No registration token available");
    return null;
  }
    } catch (error) {
        console.log(error)
    }
 
};