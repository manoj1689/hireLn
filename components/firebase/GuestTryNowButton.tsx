"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { guestLogin } from "@/lib/slices/login-slice";
import type { AppDispatch } from "@/lib/store";

export default function GuestLoginButton() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      // Dispatch guest login thunk (no email/name)
      await dispatch(
        guestLogin({
          accountType: "LIMITED_ACCESS",
          subscriptionActive: false,
          trialEndsAt: new Date().toISOString(),
        })
      ).unwrap();

      // ✅ Redirect after successful login
      router.push("/landing/try-now");
    } catch (err) {
      console.error("Guest login failed:", err);
      alert("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleGuestLogin}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-[#15B8A6] hover:text-[#129e8e] border-white border text-md md:text-lg  ${
          loading
            ? "bg-neutal-400 cursor-not-allowed"
            : "bg-gray-100 hover:bg-gray-200 "
        }`}
      >
        {loading ? "Authenticating..." : "Try Free AI Interview"}
      </button>
    </div>
  );
}
