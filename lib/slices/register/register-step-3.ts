import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { RegisterStep3Payload } from '../../../interface/registersteps';
import { setAuthToken } from '@/services/api';
import { setAuthData } from '../auth-slice';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Correct Step3Response interface
interface Step3Response {
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatar: string;
      role: 'RECRUITER' | string;
      companyName: string;
      companySize: string;
      industry: string;
      hiringVolume: string;
      primaryHiringNeeds: string[];
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  trialEndsAt: string;
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

// ✅ Thunk to submit Step 3 and store token/auth data
export const registerStep3 = createAsyncThunk<
  Step3Response,
  RegisterStep3Payload,
  { rejectValue: string }
>('register/step3', async ({ sessionId, ...formValues }, thunkAPI) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/auth/register/step3?session_id=${sessionId}`,
      formValues
    );

    console.log("response of step-3", response.data);

    const { access_token, token_type, user } = response.data.data;

    // Save auth data to Redux
    thunkAPI.dispatch(
      setAuthData({
        access_token: access_token,
        token_type: token_type,
        user,
      })
    );

    // Set token for global axios usage
    setAuthToken(access_token);

    return response.data;
  } catch (error: any) {
    console.error("Step 3 API error:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.detail || 'Something went wrong during step 3.'
    );
  }
});

// ✅ Slice to handle form state and submission
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
      Object.assign(state, initialState);
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
      })
      .addCase(registerStep3.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Step 3 submission failed.';
      });
  },
});

// ✅ Export actions and reducer
export const { updateStep3Form, setStep3SessionId, resetStep3 } = registerStep3Slice.actions;
export default registerStep3Slice.reducer;
