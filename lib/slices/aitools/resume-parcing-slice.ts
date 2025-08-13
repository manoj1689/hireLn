import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "@/services/api";
import { ResumeUploadResponseItem, ResumeUploadState } from "@/interface/ai-tools";

// ---------------------- Initial State ----------------------
const initialState: ResumeUploadState & {
  driveParsed: ResumeUploadResponseItem[];
  driveLoading: boolean;
  driveError: string | null;
} = {
  uploaded: [],
  loading: false,
  error: null,
  driveParsed: [],
  driveLoading: false,
  driveError: null,
};

// ---------------------- Thunk: Upload Resumes ----------------------
export const uploadResumes = createAsyncThunk<
  ResumeUploadResponseItem[],  // Return type
  File[],                      // Argument type
  { rejectValue: string }      // Error type
>(
  "resumes/uploadResumes",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosApi.post(
        "/api/ai-tools/parse-resumes-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response Data of candidate upload", response.data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || err.message || "Upload failed"
      );
    }
  }
);

// ---------------------- Thunk: Parse Resumes from Drive ----------------------
export const fetchResumesFromDrive = createAsyncThunk<
  ResumeUploadResponseItem[],
  { folder_id: string; limit?: number },
  { rejectValue: string }
>(
  "resumes/fetchResumesFromDrive",
  async ({ folder_id, limit = 4 }, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post( `/api/ai-tools/parse_resumes_from_drive?folder_id=${folder_id}&limit=${limit}`);

      console.log("Response Data from Drive", response.data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || err.message || "Fetching from Drive failed"
      );
    }
  }
);

// ---------------------- Slice ----------------------
const resumeSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    clearUploads(state) {
      state.uploaded = [];
      state.error = null;
      state.loading = false;
    },
    clearDriveData(state) {
      state.driveParsed = [];
      state.driveError = null;
      state.driveLoading = false;
    },
  },
  extraReducers: (builder) => {
    // ---- Upload cases ----
    builder
      .addCase(uploadResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadResumes.fulfilled,
        (state, action: PayloadAction<ResumeUploadResponseItem[]>) => {
          state.loading = false;
          state.uploaded = action.payload;
        }
      )
      .addCase(uploadResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error occurred";
      });

    // ---- Drive parse cases ----
    builder
      .addCase(fetchResumesFromDrive.pending, (state) => {
        state.driveLoading = true;
        state.driveError = null;
      })
      .addCase(
        fetchResumesFromDrive.fulfilled,
        (state, action: PayloadAction<ResumeUploadResponseItem[]>) => {
          state.driveLoading = false;
          state.driveParsed = action.payload;
        }
      )
      .addCase(fetchResumesFromDrive.rejected, (state, action) => {
        state.driveLoading = false;
        state.driveError = action.payload ?? "Unknown error occurred";
      });
  },
});

export const { clearUploads, clearDriveData } = resumeSlice.actions;
export default resumeSlice.reducer;