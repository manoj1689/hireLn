import {
  ChatRequestPayload,
  EvaluatePayload,
  InterviewChatState,
  SaveChatPayload,
  StartInterviewPayload,
} from "@/interface/interview-chat";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("baseurl", baseURL);

// -------------------------------
// Thunks
// -------------------------------

// 1️⃣ Start Interview Chat
export const startInterviewChat = createAsyncThunk(
  "interviewChat/start",
  async (payload: StartInterviewPayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/ai-interview/interview/start_chat`,
        { interview_id: payload.interviewId, candidate: payload.candidate },
        {
          headers: {
            "X-Interview-Token": payload.token || "",
          },
        }
      );
      console.log("response of start chat", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to start interview"
      );
    }
  }
);

// 2️⃣ Send Chat Response
export const sendChatResponse = createAsyncThunk(
  "interviewChat/sendResponse",
  async (payload: ChatRequestPayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/ai-interview/interview/chat_response`,
        payload,
        {
          headers: {
            "X-Interview-Token": payload.token || "",
          },
        }
      );
      console.log("send chat response", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to send chat response"
      );
    }
  }
);

// 3️⃣ Save Chat History
export const saveChatHistory = createAsyncThunk(
  "interviewChat/saveHistory",
  async (payload: SaveChatPayload, thunkAPI) => {
    try {
      console.log("payload to save chat",payload)
      const response = await axios.post(
        `${baseURL}/api/ai-interview/interview/save-chat`,
        payload,
        {
          headers: {
            "X-Interview-Token": payload.token || "",
          },
        }
      );
      console.log("save chat history", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to save chat history"
      );
    }
  }
);

// 4️⃣ Evaluate Interview
export const evaluateInterview = createAsyncThunk(
  "interviewChat/evaluate",
  async (payload: EvaluatePayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/ai-interview/interview/evaluate/${payload.interviewId}`,
        {},
        {
          headers: {
            "X-Interview-Token": payload.token || "",
          },
        }
      );
    
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail || "Failed to evaluate interview"
      );
    }
  }
);

// -------------------------------
// Initial State
// -------------------------------
const initialState: InterviewChatState = {
  loading: false,
  error: null,
  chatHistory: [],
  greeting:null,
  currentQuestion: null,
  lastScore: 0,
  level: 1,
  intent: null,
  evaluation: null,
};

// -------------------------------
// Slice
// -------------------------------
const interviewChatSlice = createSlice({
  name: "interviewChat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.chatHistory = [];
      state.currentQuestion = null;
      state.lastScore = null;
      state.level = 1;
      state.intent = null;
      state.evaluation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Start Interview
    builder.addCase(startInterviewChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(startInterviewChat.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.greeting=action.payload.greeting;
      state.currentQuestion = action.payload.first_question;
      state.level = action.payload.level ?? 1;
    });
    builder.addCase(startInterviewChat.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Send Chat Response
    builder.addCase(sendChatResponse.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendChatResponse.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;

      if (action.payload.history) state.chatHistory = action.payload.history;
      state.level = action.payload.level ?? state.level;
      state.currentQuestion = action.payload.next_question ?? state.currentQuestion;
      state.lastScore = action.payload.score ?? state.lastScore;
      state.intent = action.payload.intent ?? state.intent;
    });
    builder.addCase(sendChatResponse.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Save Chat History
    builder.addCase(saveChatHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveChatHistory.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(saveChatHistory.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Evaluate Interview
    builder.addCase(evaluateInterview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(evaluateInterview.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.evaluation = action.payload;
    });
    builder.addCase(evaluateInterview.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetChat } = interviewChatSlice.actions;
export default interviewChatSlice.reducer;
