import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { ApplicationRequest, ApplicationResponse, UpdateApplicationRequest } from '@/interface/application';



// Initial state interface
interface ApplicationState {
  application: ApplicationResponse | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ApplicationState = {
  application: null,
  loading: false,
  error: null,
};

// Create async thunk to post application
export const postApplication = createAsyncThunk(
  'applications/postApplication',
  async (applicationData: ApplicationRequest, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post('/api/candidates/applications', applicationData);
      console.log("response of application",applicationData)
      return response.data as ApplicationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error posting application');
    }
  }
);

// Add async thunk
export const updateApplication = createAsyncThunk(
  'applications/updateApplication',
  async ({ applicationId, updateData }: { applicationId: string; updateData: UpdateApplicationRequest }, { rejectWithValue }) => {
    try {
      const response = await axiosApi.put(`/api/candidates/applications/${applicationId}`, updateData);
      return response.data as ApplicationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error updating application');
    }
  }
)

// Slice
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        state.application = action.payload;
      })
      .addCase(postApplication.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add updateApplication cases
    .addCase(updateApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
      state.loading = false;
      state.application = action.payload;
    })
    .addCase(updateApplication.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Exporting selectors and reducer
export default applicationSlice.reducer;
