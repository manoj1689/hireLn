import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { CompanyRequest, CompanyResponse } from '@/interface/company';

// State interface
interface CompanyState {
  company: CompanyResponse | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CompanyState = {
  company: null,
  loading: false,
  error: null,
};

// Thunk to get company profile
export const getCompanyProfile = createAsyncThunk(
  'company/getCompanyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/api/company/profile');
      console.log("response of company data",response)
      return response.data as CompanyResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching company profile');
    }
  }
);

// Thunk to update company profile
export const updateCompanyProfile = createAsyncThunk(
  'company/updateCompanyProfile',
  async (companyData: CompanyRequest, { rejectWithValue }) => {
    try {
      const response = await axiosApi.put('/api/company/profile', companyData);
      return response.data as CompanyResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error updating company profile');
    }
  }
);

// Slice
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GET
    builder.addCase(getCompanyProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCompanyProfile.fulfilled, (state, action: PayloadAction<CompanyResponse>) => {
      state.loading = false;
      state.company = action.payload;
    });
    builder.addCase(getCompanyProfile.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // UPDATE
    builder.addCase(updateCompanyProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCompanyProfile.fulfilled, (state, action: PayloadAction<CompanyResponse>) => {
      state.loading = false;
      state.company = action.payload;
    });
    builder.addCase(updateCompanyProfile.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default companySlice.reducer;
