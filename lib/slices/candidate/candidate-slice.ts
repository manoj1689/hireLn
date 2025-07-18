import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { CandidateRequest, CandidateResponse } from '../../../interface/candidate';
import { JSX } from 'react';

interface CandidateState {
  map(arg0: (c: any) => JSX.Element): import("react").ReactNode;
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

// Async action to submit candidate data
export const addCandidate = createAsyncThunk<CandidateResponse, CandidateRequest>(
  'candidate/add',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<CandidateResponse>('/api/candidates/add', formData);
      console.log('Candidate response:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async action to fetch a list of candidates
export const fetchCandidates = createAsyncThunk<
  CandidateResponse[], 
  { skip: number; limit: number; search: string }
>(
  'candidate/fetch',
  async ({ skip, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get<CandidateResponse[]>(
        `/api/candidates/?skip=${skip}&limit=${limit}&search=${search}`
      );
      console.log('Candidates response:', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Async action to fetch a single candidate by ID
export const fetchCandidateById = createAsyncThunk<
  CandidateResponse, 
  string  // candidate_id
>(
  'candidate/fetchById',
  async (candidateId, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get<CandidateResponse>(
        `/api/candidates/${candidateId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
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
      // Add Candidate
      .addCase(addCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCandidate.fulfilled,
        (state, action: PayloadAction<CandidateResponse>) => {
          state.loading = false;
          // If the data array already exists, append the new candidate to it
          if (state.data) {
            state.data.push(action.payload); // Append the new candidate
          } else {
            state.data = [action.payload]; // If no candidates, set the data with the new candidate
          }
        }
      )
      .addCase(addCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      // Fetch Single Candidate by ID
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
      });
  },
});

export const { resetCandidateState } = candidateSlice.actions;
export default candidateSlice.reducer;
