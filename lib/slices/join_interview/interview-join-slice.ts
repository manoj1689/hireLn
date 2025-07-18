import { InterviewJoinState } from '@/interface/join-interview'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

import axios from 'axios'


const initialState: InterviewJoinState = {
  loading: false,
  error: null,
  interview: null,
  confirmationMessage: null,
  redirectUrl: null,
  status: null,
}

// ✅ Fetch interview data
export const fetchInterviewJoin = createAsyncThunk(
  'interviewJoin/fetch',
  async (
    { interviewId, token }: { interviewId: string; token?: string },
    thunkAPI
  ) => {
    try {
      const url = `${baseURL}/api/interview-join/join?interview_id=${interviewId}${token ? `&token=${token}` : ''}`
      const response = await axios.get(url)
      return {
        interview: response.data.interview,
        message: response.data.message,
        redirectUrl: response.data.redirectUrl,
        status: response.data.interview?.status ?? null,
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch interview'
      )
    }
  }
)

// ✅ Confirm interview attendance
export const confirmInterview = createAsyncThunk(
  'interviewJoin/confirm',
  async (
    {
      interviewId,
      responseMessage,
    }: { interviewId: string; responseMessage?: string },
    thunkAPI
  ) => {
    try {
      const url = `${baseURL}/api/interview-join/confirm/${interviewId}?confirmed=true${
        responseMessage ? `&response_message=${encodeURIComponent(responseMessage)}` : ''
      }`

      const response = await axios.post(url)
      return {
        message: response.data.message,
        status: response.data.status,
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Failed to confirm interview'
      )
    }
  }
)

// ✅ Start Interview
export const startInterview = createAsyncThunk(
  'interviewJoin/start',
  async (interviewId: string, thunkAPI) => {
    try {
      const url = `${baseURL}/api/interview-join/${interviewId}/start`
      const response = await axios.put(url)
      return {
        message: response.data.message,
        status: response.data.status,
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Failed to start interview'
      )
    }
  }
)

// ✅ Complete Interview
export const completeInterview = createAsyncThunk(
  'interviewJoin/complete',
  async (interviewId: string, thunkAPI) => {
    try {
      const url = `${baseURL}/api/interview-join/${interviewId}/complete`
      const response = await axios.put(url)
      return {
        message: response.data.message,
        status: response.data.status,
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || 'Failed to complete interview'
      )
    }
  }
)

const interviewJoinSlice = createSlice({
  name: 'interviewJoin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 fetchInterviewJoin
      .addCase(fetchInterviewJoin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInterviewJoin.fulfilled, (state, action) => {
        state.loading = false
        state.interview = action.payload.interview
        state.confirmationMessage = action.payload.message
        state.redirectUrl = action.payload.redirectUrl
        state.status = action.payload.status
      })
      .addCase(fetchInterviewJoin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // 🔹 confirmInterview
      .addCase(confirmInterview.pending, (state) => {
        state.loading = true
        state.error = null
        state.confirmationMessage = null
      })
      .addCase(confirmInterview.fulfilled, (state, action) => {
        state.loading = false
        state.confirmationMessage = action.payload.message
        state.status = action.payload.status
        if (state.interview) {
          state.interview.status = action.payload.status
        }
      })
      .addCase(confirmInterview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // 🔹 startInterview
      .addCase(startInterview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.loading = false
        state.confirmationMessage = action.payload.message
        state.status = action.payload.status
        if (state.interview) {
          state.interview.status = action.payload.status
        }
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // 🔹 completeInterview
      .addCase(completeInterview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(completeInterview.fulfilled, (state, action) => {
        state.loading = false
        state.confirmationMessage = action.payload.message
        state.status = action.payload.status
        if (state.interview) {
          state.interview.status = action.payload.status
        }
      })
      .addCase(completeInterview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default interviewJoinSlice.reducer
