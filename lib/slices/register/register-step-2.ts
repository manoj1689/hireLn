import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { RegisterStep2Payload } from '../../../interface/registersteps';

interface Step2Response {
  message: string;
  step: number;
  sessionId: string;
}

interface Step2State {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  sessionId: string | null;
  formValues: Omit<RegisterStep2Payload, 'sessionId'>;
}

const initialState: Step2State = {
  loading: false,
  error: null,
  successMessage: null,
  sessionId: null,
  formValues: {
    companyName: '',
    companySize: '',
    industry: '',
    hiringVolume: '',
    primaryHiringNeeds: [],
  },
};

// Thunk takes full payload with sessionId
export const registerStep2 = createAsyncThunk<
  Step2Response,
  RegisterStep2Payload,
  { rejectValue: string }
>(
  'register/step2',
  async ({ sessionId, ...formValues }, { rejectWithValue }) => {
    console.log("form value step-2",formValues)
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/register/step2?session_id=${sessionId}`,
        formValues
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Something went wrong during step 2 submission.'
      );
    }
  }
);

const registerStep2Slice = createSlice({
  name: 'registerStep2',
  initialState,
  reducers: {
    updateStep2Form: (state, action: PayloadAction<Partial<Omit<RegisterStep2Payload, 'sessionId'>>>) => {
      state.formValues = { ...state.formValues, ...action.payload };
    },
    setStep2SessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    resetStep2: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.sessionId = null;
      state.formValues = {
        companyName: '',
        companySize: '',
        industry: '',
        hiringVolume: '',
        primaryHiringNeeds: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStep2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStep2.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.sessionId = action.payload.sessionId;
      })
      .addCase(registerStep2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit step 2 data';
      });
  },
});

export const { updateStep2Form, setStep2SessionId, resetStep2 } = registerStep2Slice.actions;
export default registerStep2Slice.reducer;
