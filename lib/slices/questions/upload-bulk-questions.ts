// features/bulkUploadQuestionsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Question {
  question_text: string;
  expected_answer_format: string;
}

interface UploadPayload {
  interview_id: string;
  token: string;
  questions: Question[];
}

export const bulkUploadQuestions = createAsyncThunk(
  'questions/bulkUpload',
  async ({ interview_id, token, questions }: UploadPayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/questions/interview/${interview_id}/bulk-upload`,
        { questions },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Interview-Token': token,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bulkUploadQuestionsSlice = createSlice({
  name: 'bulkUploadQuestions',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bulkUploadQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUploadQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(bulkUploadQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bulkUploadQuestionsSlice.reducer;
