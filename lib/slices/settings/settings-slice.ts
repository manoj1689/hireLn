import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "@/services/api";
import {
  UserSettings,
  GeneralSettingsUpdate,
  EmailSettingsUpdate,
  NotificationSettingsUpdate
} from "@/interface/setting";

// GET all user settings
export const fetchUserSettings = createAsyncThunk(
  "userSettings/fetch",
  async () => {
    const response = await axiosApi.get<UserSettings>("/api/settings/");
    return response.data;
  }
);

// PUT update full user settings
export const updateUserSettings = createAsyncThunk(
  "userSettings/update",
  async (payload: UserSettings) => {
    const response = await axiosApi.put<UserSettings>("/api/settings/", payload);
    return response.data;
  }
);

// PUT general
export const updateGeneralSettings = createAsyncThunk(
  "userSettings/updateGeneral",
  async (payload: GeneralSettingsUpdate) => {
    const response = await axiosApi.put<UserSettings>("/api/settings/general", payload);
    return response.data;
  }
);

// PUT email
export const updateEmailSettings = createAsyncThunk(
  "userSettings/updateEmail",
  async (payload: EmailSettingsUpdate) => {
    const response = await axiosApi.put<UserSettings>("/api/settings/email", payload);
    return response.data;
  }
);

// PUT notifications
export const updateNotificationSettings = createAsyncThunk(
  "userSettings/updateNotifications",
  async (payload: NotificationSettingsUpdate) => {
    const response = await axiosApi.put<UserSettings>("/api/settings/notifications", payload);
    return response.data;
  }
);

interface SettingsState {
  data: UserSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  data: null,
  loading: false,
  error: null,
};

const userSettingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch settings";
      })

      // PUT full update
      .addCase(updateUserSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.data = action.payload;
      })

      // PUT general
      .addCase(updateGeneralSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.data = action.payload;
      })

      // PUT email
      .addCase(updateEmailSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.data = action.payload;
      })

      // PUT notifications
      .addCase(updateNotificationSettings.fulfilled, (state, action: PayloadAction<UserSettings>) => {
        state.data = action.payload;
      });
  },
});

export default userSettingsSlice.reducer;
