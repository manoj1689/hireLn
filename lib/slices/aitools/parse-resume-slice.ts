import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "@/services/api";
import { CandidateResponse } from "../../../interface/candidate"; // adjust path if needed

// --- Interfaces ---
interface CandidateInfo {
  user_id: string;
  candidate_id: string;
  candidate_name: string;
  email: string;
  resume_id: string;
  resume_name: string;
}

interface CreateCandidateResponse {
  status: boolean;
  message: string;
  candidate: CandidateInfo;
}

interface CandidateState {
  previewCandidate: CandidateResponse | null;
  createdCandidate: CandidateInfo | null;
  message: string | null;
  status: boolean | null; // ✅ add this
  loading: boolean;
  error: string | null;
}

// --- Initial State ---
const initialState: CandidateState = {
  previewCandidate: null,
  createdCandidate: null,
  message: null,
  status: null, // ✅ add this
  loading: false,
  error: null,
};

// --- Async Thunks ---
// Upload & create candidate with PDF file
export const uploadAndCreateCandidate = createAsyncThunk<
  CreateCandidateResponse,
  FormData,
  { rejectValue: string }
>(
  "resumeParser/uploadAndCreateCandidate",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosApi.post(
        `/api/ai-tools/create-candidate`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("respnse cand job", res.data);
      return res.data as CreateCandidateResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || err.message);
    }
  }
);

// Preview candidate
export const previewCandidate = createAsyncThunk<
  CandidateResponse,
  string,
  { rejectValue: string }
>("resumeParser/previewCandidate", async (resumeId, { rejectWithValue }) => {
  try {
    const res = await axiosApi.post(
      `/api/ai-tools/process-resume/preview-candidate/${resumeId}`
    );
    console.log("Preview Candidate Response:", res.data);
    return res.data.candidate_data as CandidateResponse;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Create candidate by resume ID (URL-based)
export const createCandidate = createAsyncThunk<
  CreateCandidateResponse,
  string,
  { rejectValue: string }
>("resumeParser/createCandidate", async (resumeId, { rejectWithValue }) => {
  try {
    const res = await axiosApi.post(`/api/ai-tools/process-resume/${resumeId}`);
    console.log("Create Candidate Response:", res.data);
    return res.data as CreateCandidateResponse;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// --- Slice ---
const resumeParserSlice = createSlice({
  name: "resumeParser",
  initialState,
  reducers: {
    clearCandidateState(state) {
      state.previewCandidate = null;
      state.createdCandidate = null;
      state.message = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadAndCreateCandidate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      uploadAndCreateCandidate.fulfilled,
      (state, action: PayloadAction<CreateCandidateResponse>) => {
        const { candidate, message, status } = action.payload;
        state.createdCandidate = candidate;
        state.message = message;
        state.status = status; // ✅ capture API status
        state.loading = false;
      }
    );

    builder.addCase(uploadAndCreateCandidate.rejected, (state, action) => {
      state.loading = false;
      state.status = false;
      state.error = action.payload || "Failed to create candidate";
    });

    // --- Preview Candidate ---
    builder.addCase(previewCandidate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      previewCandidate.fulfilled,
      (state, action: PayloadAction<CandidateResponse>) => {
        state.previewCandidate = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(previewCandidate.rejected, (state, action) => {
      state.loading = false;
      
      state.error = action.payload || "Failed to preview candidate";
    });

    // --- Create Candidate ---
    builder.addCase(createCandidate.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createCandidate.fulfilled,
      (state, action: PayloadAction<CreateCandidateResponse>) => {
        const { candidate, message } = action.payload;
        state.createdCandidate = candidate;
        state.message = message;
        state.loading = false;
      }
    );
    builder.addCase(createCandidate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to create candidate";
    });
  },
});

export const { clearCandidateState } = resumeParserSlice.actions;
export default resumeParserSlice.reducer;
