import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosApi from "@/services/api"
import { InterviewResultResponse } from "@/interface/interview-result"

// ✅ AsyncThunk to fetch interview result by interviewId
export const fetchResultByInterviewId = createAsyncThunk<
  InterviewResultResponse,
  string,
  { rejectValue: string }
>(
  "interviewResult/fetchByInterviewId",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<InterviewResultResponse>(
        `/api/interviews/interview/${interviewId}/auto-evaluate`
      )
      console.log("auto evaluate data",response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to fetch interview result"
      )
    }
  }
)

// ✅ Slice state interface
interface InterviewResultState {
  result: InterviewResultResponse | null
  loading: boolean
  error: string | null
}

// ✅ Initial state
const initialState: InterviewResultState = {
  result: null,
  loading: false,
  error: null,
}

// ✅ Slice definition
const interviewResultSlice = createSlice({
  name: "interviewResult",
  initialState,
  reducers: {
    clearInterviewResult: (state) => {
      state.result = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResultByInterviewId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResultByInterviewId.fulfilled, (state, action) => {
        state.loading = false
        state.result = action.payload
      })
      .addCase(fetchResultByInterviewId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "An unexpected error occurred"
      })
  },
})

// ✅ Export actions and reducer
export const { clearInterviewResult } = interviewResultSlice.actions
export default interviewResultSlice.reducer
