import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { RegisterStep1Payload } from '../../../interface/registersteps';

interface Step1Response {
  message: string;
  step: number;
  sessionId: string;
}

interface Step1State {
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  step: number;
  successMessage: string | null;
  formValues: RegisterStep1Payload; // Holds form data
}

const initialState: Step1State = {
  loading: false,
  error: null,
  sessionId: null,
  step: 0,
  successMessage: null,
  formValues: {
    firstName: '',
    lastName: '',
    workEmail: '',
    password: '',
    confirmPassword: '',
  },
};

export const registerStep1 = createAsyncThunk<
  Step1Response, // Return type of payload creator
  RegisterStep1Payload, // Argument to payload creator
  { rejectValue: string }
>(
  'register/step1',
  async (payload, { rejectWithValue }) => {
    //console.log("step-1",payload)
    try {
      const response = await axios.post<Step1Response>(
        `${baseURL}/api/auth/register/step1`,
        payload
      );
      console.log(response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Something went wrong');
    }
  }
);

const registerStep1Slice = createSlice({
  name: 'registerStep1',
  initialState,
  reducers: {
    updateStep1Form: (
      state,
      action: PayloadAction<Partial<RegisterStep1Payload>>
    ) => {
      state.formValues = { ...state.formValues, ...action.payload };
    },
    resetStep1: (state) => {
      state.loading = false;
      state.error = null;
      state.sessionId = null;
      state.step = 0;
      state.successMessage = null;
      state.formValues = {
        firstName: '',
        lastName: '',
        workEmail: '',
        password: '',
        confirmPassword: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStep1.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStep1.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.step = action.payload.step;
        state.successMessage = action.payload.message;
      })
      .addCase(registerStep1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { updateStep1Form, resetStep1 } = registerStep1Slice.actions;
export default registerStep1Slice.reducer;
