// src/lib/slices/job/jobDetailsStep-slice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { JobDetailsStepRequest } from "@/interface/jobsteps"
import { JobDetailsStepResponse } from "@/interface/jobsteps"
import axiosApi from "@/services/api"

interface JobDetailsState {
  data: JobDetailsStepRequest | null
  response: JobDetailsStepResponse | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: JobDetailsState = {
  data: null,
  response: null,
  status: "idle",
  error: null,
}

export const submitJobDetailsStep = createAsyncThunk<
  JobDetailsStepResponse, // Return type
  { sessionId: string; details: JobDetailsStepRequest } // Argument type
>("jobDetails/submit", async ({ sessionId, details }) => {
  const response = await axiosApi.post<JobDetailsStepResponse>(
    `/api/jobs/create/step2?session_id=${sessionId}`,
    details
  )
  return response.data
})

const jobDetailsStepSlice = createSlice({
  name: "jobDetails",
  initialState,
  reducers: {
    setJobDetailsLocally(state, action: PayloadAction<JobDetailsStepRequest>) {
      state.data = action.payload
    },
    resetJobDetails(state) {
      state.data = null
      state.response = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJobDetailsStep.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(submitJobDetailsStep.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.meta.arg.details
        state.response = action.payload
      })
      .addCase(submitJobDetailsStep.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Something went wrong"
      })
  },
})

export const { setJobDetailsLocally, resetJobDetails } = jobDetailsStepSlice.actions
export default jobDetailsStepSlice.reducer
