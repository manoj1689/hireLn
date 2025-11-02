"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { auth, provider, signInWithPopup, messaging, getToken } from "@/lib/firebase/firebaseConfig";
import { login } from "@/lib/slices/login-slice";
import type { AppDispatch } from "@/lib/store";

export default function FirebaseTryNowButton() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Function to get FCM token
  const requestFcmToken = async (): Promise<string | null> => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        return currentToken || null;
      } else {
        console.warn("Notification permission denied.");
        return null;
      }
    } catch (err) {
      console.error("Error getting FCM token:", err);
      return null;
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Firebase login
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();
      console.log("firebase token",firebaseToken)
      // Get FCM token
      const fcmToken = await requestFcmToken();
      console.log("fcm token",fcmToken)
      // Dispatch Redux login thunk and unwrap result
      await dispatch(
        login({
          token: firebaseToken,
          fcm_token: fcmToken,
          role: "GUEST",
          accountType: "LIMITED_ACCESS",
          subscriptionActive: false,
          trialEndsAt: new Date().toISOString(),
        })
      ).unwrap();

      // ✅ Navigate after successful login
      router.push("/landing/try-now");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-4 py-2 bg-white rounded-md text-md md:text-lg text-[#15B8A6] hover:shadow-lg transition-all"
      >
        <span>{loading ? "Authenticating..." : "Try Free AI Interview"}</span>
        
      </button>
    </div>
  );
}
