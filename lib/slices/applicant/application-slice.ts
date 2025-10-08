import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { ApplicationRequest, ApplicationResponse, UpdateApplicationRequest } from '@/interface/application';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
// Post application
export const postApplication = createAsyncThunk<
  ApplicationResponse, // return type
  ApplicationRequest,  // argument type
  { rejectValue: string } // reject type
>(
  'applications/postApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post('/api/candidates/applications', applicationData);
      console.log("response of application:", response.data);
      return response.data; // make sure this matches ApplicationResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error posting application');
    }
  }
);

// Async thunk to accept/invite application
export const acceptApplication = createAsyncThunk(
  'applications/acceptApplication',
  async ({ applicationId, token }: { applicationId: string; token: string }, { rejectWithValue }) => {
    try {
      console.log("token", token)
      const response = await axios.post(
        `${baseURL}/api/candidates/applications/${applicationId}/accept`,
        null, // no body
        {
          headers: {
            'X-Interview-Token': token,
            Accept: 'application/json',
          },
        }
      );

      console.log("Response", response)
      return response.data as ApplicationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error accepting application');
    }
  }
);

// Async thunk to get application data by ID
export const getApplication = createAsyncThunk<
  ApplicationResponse, 
  { applicationId: string; token?: string }, // optional token if needed
  { rejectValue: string }
>(
  'applications/getApplication',
  async ({ applicationId, token }, { rejectWithValue }) => {
    try {
      const headers = token
        ? { 'X-Interview-Token': token, Accept: 'application/json' }
        : { Accept: 'application/json' };

      const response = await axios.get(
        `${baseURL}/api/candidates/applications/${applicationId}`,
        { headers }
      );

      return response.data as ApplicationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching application');
    }
  }
);

// Async thunk to update application (if still needed)
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
);

// Slice
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Post application
      .addCase(postApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        // ✅ update application state
        state.application = action.payload;
      })
      .addCase(postApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // cast correctly
      })

      // Accept application
      .addCase(acceptApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        state.application = action.payload;
      })
      .addCase(acceptApplication.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get application
      .addCase(getApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        state.application = action.payload;
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })


      // Update application
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
