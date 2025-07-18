// src/lib/slices/job/jobRequirementsStep-slice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axiosApi from "@/services/api"
import { JobRequirementsRequest } from "@/interface/jobsteps"
import { JobRequirementsResponse } from "@/interface/jobsteps"

interface JobRequirementsState {
  data: JobRequirementsRequest | null
  response: JobRequirementsResponse | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: JobRequirementsState = {
  data: null,
  response: null,
  status: "idle",
  error: null,
}

export const submitJobRequirementsStep = createAsyncThunk<
  JobRequirementsResponse,
  { sessionId: string; details: JobRequirementsRequest }
>("jobRequirements/submit", async ({ sessionId, details }) => {
  const response = await axiosApi.post<JobRequirementsResponse>(
    `/api/jobs/create/step3?session_id=${sessionId}`,
    details
  )
  return response.data
})

const jobRequirementsStepSlice = createSlice({
  name: "jobRequirements",
  initialState,
  reducers: {
    setJobRequirementsLocally(state, action: PayloadAction<JobRequirementsRequest>) {
      state.data = action.payload
    },
    resetJobRequirements(state) {
      state.data = null
      state.response = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJobRequirementsStep.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(submitJobRequirementsStep.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.meta.arg.details
        state.response = action.payload
      })
      .addCase(submitJobRequirementsStep.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Something went wrong"
      })
  },
})

export const { setJobRequirementsLocally, resetJobRequirements } = jobRequirementsStepSlice.actions
export default jobRequirementsStepSlice.reducer
