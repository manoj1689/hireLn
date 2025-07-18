// features/basicInfoSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { JobStep1Request, JobStep1Response } from '../../../interface/jobsteps';

interface BasicInfoState {
  loading: boolean;
  error: string | null;
  data: JobStep1Response | null;
}

const initialState: BasicInfoState = {
  loading: false,
  error: null,
  data: null,
};

export const submitBasicInfo = createAsyncThunk<JobStep1Response, JobStep1Request>(
  'basicInfo/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<JobStep1Response>(
        '/api/jobs/create/step1',
        formData
      );
      console.log("response of Basic Info",response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const basicInfoSlice = createSlice({
  name: 'basicInfo',
  initialState,
  reducers: {
    resetBasicInfo: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBasicInfo.fulfilled, (state, action: PayloadAction<JobStep1Response>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(submitBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetBasicInfo } = basicInfoSlice.actions;
export default basicInfoSlice.reducer;
