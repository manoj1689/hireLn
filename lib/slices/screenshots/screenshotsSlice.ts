// src/lib/features/screenshot/screenshotSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  Screenshot,
  ScreenshotResponse,
  ScreenshotListResponse,
  ScreenshotDeleteResponse,
} from '@/interface/screenshots';
import axiosApi from '@/services/api';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ScreenshotState {
  loading: boolean;
  error: string | null;
  screenshots: Screenshot[];
  currentScreenshot: ScreenshotResponse | null;
  success: boolean;
}

const initialState: ScreenshotState = {
  loading: false,
  error: null,
  screenshots: [],
  currentScreenshot: null,
  success: false,
};

// ========================
// 1️⃣ UPLOAD SINGLE SCREENSHOT
// ========================
export const uploadScreenshot = createAsyncThunk<
  {
    success: boolean;
    screenshot: ScreenshotResponse;
  },
  {
    interview_id: string;
    file: File;
    faceVerified?: boolean;
    multiFace?: boolean;
    note?: string;
    token?: string;
  }
>(
  "screenshot/upload",
  async ({ interview_id, file, faceVerified, multiFace, note, token }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // ⛔ Only send the file in form data

      // ✅ Build query string EXACTLY like your curl request
      const params = new URLSearchParams();
      params.append("interview_id", interview_id);
      if (faceVerified !== undefined) params.append("faceVerified", String(faceVerified));
      if (multiFace !== undefined) params.append("multiFace", String(multiFace));
      if (note) params.append("note", note);

      const url = `${baseURL}/api/screenshots/upload?${params.toString()}`;

      const response = await axios.post(url, formData, {
        headers: {
          "X-Interview-Token": token || "",
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.detail || "Failed to upload screenshot");
    }
  }
);


export const listScreenshots = createAsyncThunk<
  ScreenshotListResponse,
  { interviewId: string }
>("screenshot/list", async ({ interviewId }, thunkAPI) => {
  try {
    const response = await axiosApi.get(
      `/api/screenshots/${interviewId}/list`
    );

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.detail || "Failed to fetch screenshots"
    );
  }
});


export const getScreenshot = createAsyncThunk<
  ScreenshotResponse,
  { id: string }
>("screenshot/get", async ({ id }, thunkAPI) => {
  try {
    const response = await axiosApi.get(`/api/screenshots/view/${id}`);

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.detail || "Failed to fetch screenshot"
    );
  }
});


export const deleteScreenshot = createAsyncThunk<
  ScreenshotDeleteResponse,
  { id: string }
>("screenshot/delete", async ({ id }, thunkAPI) => {
  try {
    const response = await axiosApi.delete(
      `/api/screenshots/delete/${id}`
    );

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.detail || "Failed to delete screenshot"
    );
  }
});


const screenshotSlice = createSlice({
  name: 'screenshot',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 🔹 uploadScreenshot
    builder
      .addCase(uploadScreenshot.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadScreenshot.fulfilled, (state, action) => {
        state.loading = false;
        state.currentScreenshot = action.payload.screenshot; // CORRECT
        state.success = true;
      })
      .addCase(uploadScreenshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // 🔹 listScreenshots
    builder
      .addCase(listScreenshots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listScreenshots.fulfilled, (state, action) => {
        state.loading = false;
        state.screenshots = action.payload.screenshots;
      })
      .addCase(listScreenshots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 getScreenshot
    builder
      .addCase(getScreenshot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScreenshot.fulfilled, (state, action) => {
        state.loading = false;
        state.currentScreenshot = action.payload; // FIXED
      })
      .addCase(getScreenshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 deleteScreenshot
    builder
      .addCase(deleteScreenshot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteScreenshot.fulfilled, (state, action) => {
        state.loading = false;

        // remove from current if matches
        if (state.currentScreenshot?.id === action.payload.deletedId) {
          state.currentScreenshot = null;
        }

        // remove from screenshots list
        state.screenshots = state.screenshots.filter(
          (s) => s.id !== action.payload.deletedId
        );
      })
      .addCase(deleteScreenshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default screenshotSlice.reducer;
