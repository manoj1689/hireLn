import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { ApplicationRequest, ApplicationResponse, UpdateApplicationRequest } from '@/interface/application';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --------------------
// State Interface
// --------------------
interface ApplicationState {
  applications: ApplicationResponse[]; // all applications
  selectedApplication: ApplicationResponse | null; // currently viewed or accepted one
  loading: boolean;
  error: string | null;
}

// --------------------
// Initial State
// --------------------
const initialState: ApplicationState = {
  applications: [],
  selectedApplication: null,
  loading: false,
  error: null,
};

// --------------------
// Async Thunks
// --------------------

// 1️⃣ Post Application
export const postApplication = createAsyncThunk<
  ApplicationResponse,
  ApplicationRequest,
  { rejectValue: string }
>(
  'applications/postApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      console.log('application data', applicationData);

      // ✅ If guest user → hit guest auto-apply endpoint
      const url = applicationData.isGuest
        ? '/api/try-interview/applications'
        : '/api/application/applications';

      const response = await axiosApi.post(url, applicationData);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail|| 'Error posting application'
      );
    }
  }
);


// 2️⃣ Get Application
export const getApplication = createAsyncThunk<
  ApplicationResponse,
  { applicationId: string; token?: string },
  { rejectValue: string }
>(
  'applications/getApplication',
  async ({ applicationId, token }, { rejectWithValue }) => {
    try {
      const headers = token
        ? { 'X-Interview-Token': token, Accept: 'application/json' }
        : { Accept: 'application/json' };

      const response = await axios.get(`${baseURL}/api/application/applications/${applicationId}`, { headers });
      console.log('response of get application', response);
      return response.data;
    } catch (error: any) {
      console.log('response of get application error', error.response);
      return rejectWithValue(error.response?.data?.detail || 'Error fetching application');
    }
  }
);

// 3️⃣ Accept Application
export const acceptApplication = createAsyncThunk<
  ApplicationResponse,
  { applicationId: string; token: string },
  { rejectValue: string }
>(
  'applications/acceptApplication',
  async ({ applicationId, token }, { rejectWithValue }) => {
    try {
      console.log('token', token);
      const response = await axios.post(
        `${baseURL}/api/application/applications/${applicationId}/accept`,
        null,
        {
          headers: {
            'X-Interview-Token': token,
            Accept: 'application/json',
          },
        }
      );
      console.log('Response', response);
      return response.data as ApplicationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error accepting application');
    }
  }
);

// 4️⃣ Update Application
export const updateApplication = createAsyncThunk<
  ApplicationResponse,
  { applicationId: string; updateData: UpdateApplicationRequest },
  { rejectValue: string }
>(
  'applications/updateApplication',
  async ({ applicationId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosApi.put(`/api/application/applications/${applicationId}`, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error updating application');
    }
  }
);

// --------------------
// Slice
// --------------------
const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    resetApplications: (state) => {
      state.applications = [];
      state.selectedApplication = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟢 Post Application
      .addCase(postApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(postApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🟢 Accept Application
      .addCase(acceptApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        state.selectedApplication = action.payload; // ✅ fixed
      })
      .addCase(acceptApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🟢 Get Application
      .addCase(getApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        const index = state.applications.findIndex(a => a.id === action.payload.id);
        if (index >= 0) {
          state.applications[index] = action.payload;
        } else {
          state.applications.push(action.payload);
        }
        state.selectedApplication = action.payload; // ✅ store the current application too
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🟢 Update Application
      .addCase(updateApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplication.fulfilled, (state, action: PayloadAction<ApplicationResponse>) => {
        state.loading = false;
        const index = state.applications.findIndex(a => a.id === action.payload.id);
        if (index >= 0) {
          state.applications[index] = action.payload;
        }
        if (state.selectedApplication?.id === action.payload.id) {
          state.selectedApplication = action.payload; // ✅ keep selected updated
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetApplications } = applicationSlice.actions;
export default applicationSlice.reducer;
