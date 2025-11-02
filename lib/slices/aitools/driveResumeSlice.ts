import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "@/services/api";
import { ResumeUploadResponseItem } from "@/interface/ai-tools";

interface DriveResumeState {
  driveParsed: ResumeUploadResponseItem[];
  driveLoading: boolean;
  driveError: string | null;
}

const initialState: DriveResumeState = {
  driveParsed: [],
  driveLoading: false,
  driveError: null,
};

// ---------------------- Thunk: Fetch Resumes from Drive ----------------------
export const fetchResumesFromDrive = createAsyncThunk<
  ResumeUploadResponseItem[],
  { folder_id: string; limit?: number },
  { rejectValue: string }
>(
  "driveResumes/fetch",
  async ({ folder_id, limit = 4 }, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post(
        `/api/ai-tools/parse_resumes_from_drive?folder_id=${folder_id}&limit=${limit}`
      );

      console.log("Response Data from Drive", response.data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message || "Fetching from Drive failed");
    }
  }
);

const driveResumeSlice = createSlice({
  name: "driveResumes",
  initialState,
  reducers: {
    clearDriveData(state) {
      state.driveParsed = [];
      state.driveError = null;
      state.driveLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumesFromDrive.pending, (state) => {
        state.driveLoading = true;
        state.driveError = null;
      })
      .addCase(fetchResumesFromDrive.fulfilled, (state, action: PayloadAction<ResumeUploadResponseItem[]>) => {
        state.driveLoading = false;
        state.driveParsed = action.payload;
      })
      .addCase(fetchResumesFromDrive.rejected, (state, action) => {
        state.driveLoading = false;
        state.driveError = action.payload ?? "Unknown error occurred";
      });
  },
});

export const { clearDriveData } = driveResumeSlice.actions;
export default driveResumeSlice.reducer;
