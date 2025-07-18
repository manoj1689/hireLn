import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosApi from "@/services/api"
import { InterviewResultResponse } from "@/interface/interview-result"

// AsyncThunk to fetch interview result by interviewId
export const fetchResultByInterviewId = createAsyncThunk<
  InterviewResultResponse,
  string
>(
  "interviewResult/fetchByInterviewId",
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get<InterviewResultResponse>(
        `/api/interviews/interview/${interviewId}/result`
       
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch interview result")
    }
  }
)

// Slice
interface InterviewResultState {
  result: InterviewResultResponse | null
  loading: boolean
  error: string | null
}

const initialState: InterviewResultState = {
  result: null,
  loading: false,
  error: null,
}

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
        state.error = action.payload as string
      })
  },
})

export const { clearInterviewResult } = interviewResultSlice.actions
export default interviewResultSlice.reducer
