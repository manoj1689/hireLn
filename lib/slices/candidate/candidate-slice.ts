import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { CandidateResponse } from '../../../interface/candidate';

interface CandidateState {
  loading: boolean;
  error: string | null;
  data: CandidateResponse[] | null; // List of candidates
  singleCandidate: CandidateResponse | null; // Single candidate data
}

const initialState: CandidateState = {
  loading: false,
  error: null,
  data: null,
  singleCandidate: null,
};

// Fetch Candidates List
export const fetchCandidates = createAsyncThunk<
  CandidateResponse[],
  {
    skip: number;
    limit: number;
    search?: string;
    technicalSkills?: string[];
  }
>(
  'candidate/fetch',
  async ({ skip, limit, search, technicalSkills }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (technicalSkills && technicalSkills.length > 0) {
        technicalSkills.forEach(skill => params.append('technicalSkills', skill));
      }
      const response = await axiosApi.get<CandidateResponse[]>(`/api/candidates/?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Fetch Single Candidate by ID
export const fetchCandidateById = createAsyncThunk<
  CandidateResponse,
  string
>(
  'candidate/fetchById',
  async (candidateId, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get<CandidateResponse>(`/api/candidates/${candidateId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Delete Candidate
export const deleteCandidate = createAsyncThunk<
  string, // Return deleted candidate ID
  string  // Candidate ID
>(
  'candidate/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`/api/candidates/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete candidate');
    }
  }
);

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    resetCandidateState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.singleCandidate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Candidates List
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action: PayloadAction<CandidateResponse[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Candidate
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action: PayloadAction<CandidateResponse>) => {
        state.loading = false;
        state.singleCandidate = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Candidate
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCandidate.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (state.data) {
          state.data = state.data.filter(c => c.id !== action.payload);
        }
        if (state.singleCandidate?.id === action.payload) {
          state.singleCandidate = null;
        }
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCandidateState } = candidateSlice.actions;
export default candidateSlice.reducer;
