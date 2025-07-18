import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthData } from "./auth-slice";
import { setAuthToken } from "@/services/api"; // 👈 import it here
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        return thunkAPI.rejectWithValue(error.message || "Login failed");
      }

      const data = await res.json();
      console.log(data);

      // Save token in Redux
      thunkAPI.dispatch(setAuthData(data));

      // Set token globally for axios
      setAuthToken(data.access_token); // 👈 this is key

    } catch (err: unknown) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }
      return thunkAPI.rejectWithValue("Network error");
    }
  }
);

