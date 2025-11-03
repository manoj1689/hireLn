// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDi4LlTmYwpkQce06laAPo6R0x8iUO8yjg",
  authDomain: "hireln-66019.firebaseapp.com",
  projectId: "hireln-66019",
  storageBucket: "hireln-66019.firebasestorage.app",
  messagingSenderId: "488644722",
  appId: "1:488644722:web:bfb220905a3540702922eb",
  measurementId: "G-VSCT49CGCV"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received a background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
    

  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
