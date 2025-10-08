import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from '@/services/api';
import { ProfileData } from "@/interface/profile";


// --- State Interface ---
interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
}

// --- Initial State ---
const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// --- Async Thunk to Fetch Profile ---
export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get("/api/auth/me");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

// --- Slice ---
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// --- Exports ---
export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
