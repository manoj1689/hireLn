// @/features/dashboard/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import {
  ActivityItem,
  PipelineStage,
  RecruitmentTrend,
  DashboardMetrics,
} from '@/interface/dashboard';

interface DashboardState {
  loading: boolean;
  error: string | null;
  activities: ActivityItem[];
  pipelineStages: PipelineStage[];
  recruitmentTrends: RecruitmentTrend[];
  metrics: DashboardMetrics | null;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  activities: [],
  pipelineStages: [],
  recruitmentTrends: [],
  metrics: null,
};

// Async Thunks
export const fetchActivities = createAsyncThunk<ActivityItem[]>(
  'dashboard/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/api/dashboard/activities');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to load activities');
    }
  }
);

export const fetchPipelineStages = createAsyncThunk<PipelineStage[]>(
  'dashboard/fetchPipelineStages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/api/dashboard/pipeline');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to load pipeline');
    }
  }
);

export const fetchRecruitmentTrends = createAsyncThunk<RecruitmentTrend[]>(
  'dashboard/fetchRecruitmentTrends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/api/dashboard/recruitment-trends');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to load trends');
    }
  }
);

export const fetchDashboardMetrics = createAsyncThunk<DashboardMetrics>(
  'dashboard/fetchDashboardMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/api/dashboard/metrics');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to load metrics');
    }
  }
);

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.loading = false;
      state.error = null;
      state.activities = [];
      state.pipelineStages = [];
      state.recruitmentTrends = [];
      state.metrics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<ActivityItem[]>) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Pipeline
      .addCase(fetchPipelineStages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPipelineStages.fulfilled, (state, action: PayloadAction<PipelineStage[]>) => {
        state.loading = false;
        state.pipelineStages = action.payload;
      })
      .addCase(fetchPipelineStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Trends
      .addCase(fetchRecruitmentTrends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecruitmentTrends.fulfilled, (state, action: PayloadAction<RecruitmentTrend[]>) => {
        state.loading = false;
        state.recruitmentTrends = action.payload;
      })
      .addCase(fetchRecruitmentTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action: PayloadAction<DashboardMetrics>) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
