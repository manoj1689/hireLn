
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDi4LlTmYwpkQce06laAPo6R0x8iUO8yjg",
    authDomain: "hireln-66019.firebaseapp.com",
    projectId: "hireln-66019",
    storageBucket: "hireln-66019.firebasestorage.app",
    messagingSenderId: "488644722",
    appId: "1:488644722:web:bfb220905a3540702922eb",
    measurementId: "G-VSCT49CGCV"
});

const messaging = firebase.messaging();

// Background Notification Handling
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});


