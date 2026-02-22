importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAyKy4ZOekiggLoo0ABjTLKSgZkfaOaY8s",
  authDomain: "home-workout-planner-8c674.firebaseapp.com",
  projectId: "home-workout-planner-8c674",
  messagingSenderId: "274782623703",
  appId: "1:274782623703:web:0a0317bbecdde79c1d1d92"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png"
  });
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();       // app already open — focus it
      }
      return clients.openWindow("/");       // app closed — open it
    })
  );
})