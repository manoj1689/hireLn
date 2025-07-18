import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import {
  CompanyLocationRequest,
  CompanyLocationResponse
} from '@/interface/company';

interface CompanyLocationState {
  locations: CompanyLocationResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyLocationState = {
  locations: [],
  loading: false,
  error: null
};

// ✅ CREATE
export const createCompanyLocation = createAsyncThunk(
  'companyLocation/create',
  async (data: CompanyLocationRequest, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post('/api/company/locations', data);
      return response.data as CompanyLocationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create location');
    }
  }
);

// ✅ GET ALL
export const getCompanyLocations = createAsyncThunk(
  'companyLocation/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/api/company/locations');
      return response.data as CompanyLocationResponse[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch locations');
    }
  }
);

// ✅ UPDATE
export const updateCompanyLocation = createAsyncThunk(
  'companyLocation/update',
  async (
    { id, data }: { id: string; data: CompanyLocationRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosApi.put(`/api/company/locations/${id}`, data);
      return response.data as CompanyLocationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update location');
    }
  }
);

// ✅ DELETE
export const deleteCompanyLocation = createAsyncThunk(
  'companyLocation/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`/api/company/locations/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete location');
    }
  }
);

// ✅ SLICE
const companyLocationSlice = createSlice({
  name: 'companyLocation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCompanyLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
        state.loading = false;
      })
      .addCase(getCompanyLocations.fulfilled, (state, action) => {
        state.locations = action.payload;
        state.loading = false;
      })
      .addCase(updateCompanyLocation.fulfilled, (state, action) => {
        state.locations = state.locations.map((loc) =>
          loc.id === action.payload.id ? action.payload : loc
        );
        state.loading = false;
      })
      .addCase(deleteCompanyLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter((loc) => loc.id !== action.payload);
        state.loading = false;
      })

      // pending & error handling
      .addMatcher((action) => action.type.startsWith('companyLocation/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        })
      .addMatcher((action) => action.type.startsWith('companyLocation/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        });
  }
});

export default companyLocationSlice.reducer;
