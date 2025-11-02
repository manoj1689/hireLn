import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { CompanyRequest, CompanyResponse } from '@/interface/company';
import { setUserRegistered } from '@/lib/slices/auth-slice'; // ✅ Import correct action
import type { AppDispatch } from '@/lib/store';

// ------------------ State Interface ------------------
interface CompanyState {
  company: CompanyResponse | null;
  loading: boolean;
  error: string | null;
}

// ------------------ Initial State ------------------
const initialState: CompanyState = {
  company: null,
  loading: false,
  error: null,
};

// ------------------ Thunks ------------------

// ✅ GET Company Profile
export const getCompanyProfile = createAsyncThunk(
  'company/getCompanyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/api/company/profile');
      return response.data as CompanyResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching company profile');
    }
  }
);

// ✅ CREATE Company Profile
export const createCompanyProfile = createAsyncThunk<
  CompanyResponse,
  Partial<CompanyRequest>,
  { rejectValue: string; dispatch: AppDispatch }
>(
  'company/createCompanyProfile',
  async (companyData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosApi.post('/api/company/profile', companyData);
      const company = response.data as CompanyResponse;

      // ✅ Mark user as registered in auth slice
      dispatch(setUserRegistered(true));

      return company;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error creating company profile');
    }
  }
);

// ✅ UPDATE Company Profile
export const updateCompanyProfile = createAsyncThunk<
  CompanyResponse,
  Partial<CompanyRequest>,
  { rejectValue: string }
>(
  'company/updateCompanyProfile',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axiosApi.put('/api/company/profile', companyData);
      return response.data as CompanyResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error updating company profile');
    }
  }
);

// ------------------ Slice ------------------
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ----- GET -----
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

    // ----- CREATE -----
    builder.addCase(createCompanyProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCompanyProfile.fulfilled, (state, action: PayloadAction<CompanyResponse>) => {
      state.loading = false;
      state.company = action.payload;
    });
    builder.addCase(createCompanyProfile.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ----- UPDATE -----
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
