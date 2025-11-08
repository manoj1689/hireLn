import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthData } from "./auth-slice";
import { setAuthToken } from "@/services/api";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = createAsyncThunk<
  void,
  {
    token: string;
    fcm_token?: string;
    role: string;
    accountType: string;
    subscriptionActive: boolean;
    trialEndsAt: string;
  },
  { rejectValue: string }
>(
  "auth/login",
  async (
    { token, fcm_token, role, accountType, subscriptionActive, trialEndsAt },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fcm_token,
          role,
          accountType,
          subscriptionActive,
          trialEndsAt,
        }),
      });

      // ✅ Try to parse JSON safely
      let errorData: any = {};
      try {
        errorData = await res.clone().json();
      } catch {
        errorData = {};
      }

      if (!res.ok) {
        const msg =
          errorData?.detail || errorData?.message || "Login failed. Please try again.";
        return thunkAPI.rejectWithValue(msg);
      }

      const data = await res.json();
      console.log("✅ Login successful:", data);

      // Save token and user info in Redux
      thunkAPI.dispatch(setAuthData(data));

      // Set auth token globally
      setAuthToken(data.access_token);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Network error. Please try again.";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

/* -------------------------------------------
   🔹 2. Guest Login (Without Firebase)
-------------------------------------------- */
export const guestLogin = createAsyncThunk<
  void,
  {
   
    accountType: string;
    subscriptionActive: boolean;
    trialEndsAt: string;
  },
  { rejectValue: string }
>(
  "auth/guestLogin",
  async (
    { accountType, subscriptionActive, trialEndsAt },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${baseURL}/api/auth/guest-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
         
          accountType,
          subscriptionActive,
          trialEndsAt,
        }),
      });

      let errorData: any = {};
      try {
        errorData = await res.clone().json();
      } catch {
        errorData = {};
      }

      if (!res.ok) {
        const msg =
          errorData?.detail ||
          errorData?.message ||
          "Guest login failed. Please try again.";
        return thunkAPI.rejectWithValue(msg);
      }

      const data = await res.json();
      console.log("✅ Guest login successful:", data);

      thunkAPI.dispatch(setAuthData(data));
      setAuthToken(data.access_token);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Network error. Please try again.";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);