// src/lib/slices/job/jobPublishStep-slice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axiosApi from "@/services/api"
import { JobPublishRequest } from "@/interface/jobsteps"
import { JobPublishResponse } from "@/interface/jobsteps"

interface JobPublishState {
  data: JobPublishRequest | null
  response: JobPublishResponse | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: JobPublishState = {
  data: null,
  response: null,
  status: "idle",
  error: null,
}

export const submitJobPublishStep = createAsyncThunk<
  JobPublishResponse,
  { sessionId: string; details: JobPublishRequest }
>("jobPublish/submit", async ({ sessionId, details }) => {
  const response = await axiosApi.post<JobPublishResponse>(
    `/api/jobs/create/step4?session_id=${sessionId}`,
    details
  )
  return response.data
})

const jobPublishStepSlice = createSlice({
  name: "jobPublish",
  initialState,
  reducers: {
    setJobPublishLocally(state, action: PayloadAction<JobPublishRequest>) {
      state.data = action.payload
    },
    resetJobPublish(state) {
      state.data = null
      state.response = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitJobPublishStep.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(submitJobPublishStep.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.meta.arg.details
        state.response = action.payload
      })
      .addCase(submitJobPublishStep.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Something went wrong"

            // Log the error to the console for debugging
        console.error("Error while publishing job:", action.error.message)
      })

      
  },
})

export const { setJobPublishLocally, resetJobPublish } = jobPublishStepSlice.actions
export default jobPublishStepSlice.reducer
