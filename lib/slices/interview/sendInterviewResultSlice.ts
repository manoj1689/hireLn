import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosApi from "@/services/api" // axios instance with auth header
import { AxiosResponse } from "axios"

// ✅ Type for API response
interface SendResultResponse {
  message: string
}

// ✅ State shape for this slice
interface SendResultState {
  loading: boolean
  success: boolean
  error: string | null
}

// ✅ Initial state
const initialState: SendResultState = {
  loading: false,
  success: false,
  error: null,
}

// ✅ Async thunk to send interview result email
export const sendInterviewResultEmail = createAsyncThunk<
  SendResultResponse,
  string,
  { rejectValue: string }
>("interview/sendResultEmail", async (interviewId, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<SendResultResponse> = await axiosApi.post(
      `/api/interviews/interview/${interviewId}/send-result`
    )
    console.log("Result email sent:", response.data)
    return response.data
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to send result"
    )
  }
})

// ✅ Slice
const sendInterviewResultSlice = createSlice({
  name: "sendInterviewResult",
  initialState,
  reducers: {
    resetSendInterviewResult(state) {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInterviewResultEmail.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(sendInterviewResultEmail.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(sendInterviewResultEmail.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload || "Something went wrong"
      })
  },
})

// ✅ Exports
export const { resetSendInterviewResult } = sendInterviewResultSlice.actions
export default sendInterviewResultSlice.reducer
