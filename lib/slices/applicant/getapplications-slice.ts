import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { ApplicationResponse } from '@/interface/application';

interface ApplicationsState {
  data: ApplicationResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  data: [],
  loading: false,
  error: null,
};

// Create async thunk to fetch applications
export const fetchApplications = createAsyncThunk<
  ApplicationResponse[],
  { candidate_id: string; status?: string; skip?: number; limit?: number }
>(
  'applications/fetch',
  async ({ candidate_id, status, skip = 0, limit = 10 }, { rejectWithValue }) => {
    try {
      // Building query string directly
      const query = `?candidate_id=${candidate_id}&skip=${skip}&limit=${limit}${
        status ? `&status=${status}` : ''
      }`;

      const response = await axiosApi.get<ApplicationResponse[]>(
        `/api/candidates/applications/list${query}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const getApplicationsSlice = createSlice({
  name: 'getApplications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action: PayloadAction<ApplicationResponse[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default getApplicationsSlice.reducer;
