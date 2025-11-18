import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "@/services/api";

export interface UploadMeta {
  id: string;
  name: string;
  status: "pending" | "uploading" | "success" | "error";
  response?: any;
  error?: string;
}

export interface ResumeUploadState {
  items: UploadMeta[];
  loading: boolean;
}

const initialState: ResumeUploadState = {
  items: [],
  loading: false,
};

export const uploadResume = createAsyncThunk<
  { filename: string; data: any },
  File,
  { rejectValue: string }
>("uploadResume/upload", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosApi.post(
      "/api/ai-tools/parse-resume-upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log(response);
    return {
      filename: file.name,
      data: response.data,
    };
  } catch (err: any) {
    console.log(err);
    // ✅ UPDATED AS PER YOUR REQUEST
    return rejectWithValue(err.response?.data?.message || err.message || "Upload failed");
  }
});

const uploadResumeSlice = createSlice({
  name: "uploadResume",
  initialState,
  reducers: {
    clearUpload(state) {
      state.items = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state, action) => {
        const file = action.meta.arg;

        state.items.push({
          id: crypto.randomUUID(),
          name: file.name,
          status: "uploading",
        });

        state.loading = true;
      })

      .addCase(
        uploadResume.fulfilled,
        (state, action: PayloadAction<{ filename: string; data: any }>) => {
          state.loading = false;

          const uploaded = state.items.find(
            (i) => i.name === action.payload.filename
          );

          if (uploaded) {
            uploaded.status = "success";
            uploaded.response = action.payload.data;
          }
        }
      )

      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;

        const file = action.meta.arg;

        const failed = state.items.find((i) => i.name === file.name);
        if (failed) {
          failed.status = "error";
          failed.error = action.payload ?? "Upload failed";
        }
      });
  },
});

export const { clearUpload } = uploadResumeSlice.actions;
export default uploadResumeSlice.reducer;
