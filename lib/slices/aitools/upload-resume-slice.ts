import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResumeUploadState, ResumeUploadResponseItem, ResumeUploadApiResponse } from "@/interface/ai-tools";
import axiosApi from "@/services/api";

// Initial state typed using ResumeUploadState
const initialState: ResumeUploadState = {
  uploaded: [],
  loading: false,
  error: null,
};

// Async thunk for uploading resumes
export const uploadResumes = createAsyncThunk<
  ResumeUploadApiResponse, // return type
  File[],                     // argument type
  { rejectValue: string }
>(
  "uploadResumes/upload",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await axiosApi.post("/api/ai-tools/parse-resumes-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message || "Upload failed");
    }
  }
);

// Slice using ResumeUploadState
const uploadResumeSlice = createSlice({
  name: "uploadResumes",
  initialState,
  reducers: {
    clearUploads(state) {
      state.uploaded = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResumes.fulfilled, (state, action: PayloadAction<ResumeUploadApiResponse>) => {
        state.loading = false;
        state.uploaded = action.payload.summary; 
      })
      .addCase(uploadResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error occurred";
      });
  },
});

export const { clearUploads } = uploadResumeSlice.actions;
export default uploadResumeSlice.reducer;
