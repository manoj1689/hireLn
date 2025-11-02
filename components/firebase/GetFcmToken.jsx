"use client";

import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase/firebaseConfig";

export default function GetFcmToken() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);

  const requestPermissionAndGetToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          console.log("✅ FCM Token:", currentToken);
          setToken(currentToken);
        } else {
          console.warn("No registration token available.");
        }
      } else {
        console.warn("Notification permission denied.");
      }
    } catch (err) {
      console.error("Error getting FCM token:", err);
    }
  };

  useEffect(() => {
    requestPermissionAndGetToken();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Message received:", payload);
      setNotification(payload.notification);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-6">
      <button
        onClick={requestPermissionAndGetToken}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Get FCM Token
      </button>

      {token && (
        <div className="mt-3 text-sm text-gray-700 break-all">
          <strong>Token:</strong> {token}
        </div>
      )}

      {notification && (
        <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg">
          <h4 className="font-bold">New Notification:</h4>
          <p>{notification.title}</p>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
}
