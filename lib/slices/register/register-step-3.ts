import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setAuthData } from "../auth-slice";
import { setAuthToken } from "@/services/api";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
import axios from 'axios';
import { RegisterStep3Payload } from '../../../interface/registersteps';

interface Step3Response {
  message: string;
  step: number;
  sessionId: string;
}

interface Step3State {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  sessionId: string | null;
  formValues: Omit<RegisterStep3Payload, 'sessionId'>;
}

const initialState: Step3State = {
  loading: false,
  error: null,
  successMessage: null,
  sessionId: null,
  formValues: {
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    termsAgreement: false,
  },
};

export const registerStep3 = createAsyncThunk<
  Step3Response,
  RegisterStep3Payload,
  { rejectValue: string }
>(
  'register/step3',
  async ({ sessionId, ...formValues }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/register/step3?session_id=${sessionId}`,
        formValues
      );

      if (response.data.token) {
        dispatch(setAuthData(response.data.token)); // ✅ Redux
        setAuthToken(response.data.token);          // ✅ axios default
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Something went wrong during step 3 submission.'
      );
    }
  }
);


const registerStep3Slice = createSlice({
  name: 'registerStep3',
  initialState,
  reducers: {
    updateStep3Form: (
      state,
      action: PayloadAction<Partial<Omit<RegisterStep3Payload, 'sessionId'>>>
    ) => {
      state.formValues = { ...state.formValues, ...action.payload };
    },
    setStep3SessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    resetStep3: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.sessionId = null;
      state.formValues = {
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        billingAddress: '',
        city: '',
        zipCode: '',
        termsAgreement: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStep3.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStep3.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.sessionId = action.payload.sessionId;
      })
      .addCase(registerStep3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit step 3 data';
      });
  },
});

export const {
  updateStep3Form,
  setStep3SessionId,
  resetStep3,
} = registerStep3Slice.actions;

export default registerStep3Slice.reducer;
