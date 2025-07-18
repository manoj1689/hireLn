import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { CandidateResponse } from '../../../interface/candidate';

// Define the initial state for the matched candidates slice
interface MatchedCandidateState {
  loading: boolean;
  error: string | null;
  matchedCandidates: CandidateResponse[] | null;
}

const initialState: MatchedCandidateState = {
  loading: false,
  error: null,
  matchedCandidates: null,
};

// Async action to fetch matched candidates based on a job_id
export const fetchMatchedCandidatesByJobId = createAsyncThunk<
  CandidateResponse[], 
  string  // job_id
>(
  'matchedCandidate/fetchMatchedCandidatesByJobId',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get<CandidateResponse[]>(
        `/api/ai-tools/match/${jobId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const matchedCandidateSlice = createSlice({
  name: 'matchedCandidate',
  initialState,
  reducers: {
    resetMatchedCandidateState: (state) => {
      state.loading = false;
      state.error = null;
      state.matchedCandidates = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Matched Candidates by Job ID
      .addCase(fetchMatchedCandidatesByJobId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMatchedCandidatesByJobId.fulfilled,
        (state, action: PayloadAction<CandidateResponse[]>) => {
          state.loading = false;
          state.matchedCandidates = action.payload;
        }
      )
      .addCase(fetchMatchedCandidatesByJobId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetMatchedCandidateState } = matchedCandidateSlice.actions;
export default matchedCandidateSlice.reducer;
