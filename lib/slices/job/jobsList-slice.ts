import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api'; // Import your axios instance
import { JobsState, JobListData, JobData } from '@/interface/jobsteps'; // Update your interfaces accordingly
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Initial state for jobs
const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  job: null,  // Add a field to store a single job's data for editing
};

// Async thunk for fetching jobs using axios
export const fetchJobs = createAsyncThunk<JobListData[], { skip: number; limit: number; status?: string; department?: string; search?: string }>(
  'jobs/fetchJobs',
  async (params, thunkAPI) => {
    try {
      const { skip, limit, status, department, search } = params;

      // Build the params object dynamically, including only the values that are not empty
      const queryParams: any = {
        skip,
        limit,
      };

      if (status) queryParams.status = status;  // Include 'status' only if it's not empty
      if (department) queryParams.department = department;  // Include 'department' only if it's not empty
      if (search) queryParams.search = search;  // Include 'search' only if it's not empty

      // Make GET request using axiosApi
      const response = await axiosApi.get('/api/jobs/', { params: queryParams });

      // Return data from the response
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a specific job using its job_id
// ✅ Fetch Job with optional interview token
export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (
    { jobId, token }: { jobId: string; token?: string },
    thunkAPI
  ) => {
    try {
      const response = await axiosApi.get(`/api/jobs/${jobId}`, {
        headers: {
          "X-Interview-Token": token || "",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const fetchJobById = createAsyncThunk<JobData, string>(
//   'jobs/fetchJobById',
//   async (jobId, thunkAPI) => {
//     try {
//       const response = await axiosApi.get(`/api/jobs/${jobId}`);
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// Async thunk for updating a job using its job_id
export const updateJob = createAsyncThunk<JobData, { jobId: string; updatedJob: JobData }>(
  'jobs/updateJob',
  async ({ jobId, updatedJob }, thunkAPI) => {
    try {
      const response = await axiosApi.put(`/api/jobs/${jobId}`, updatedJob);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteJob = createAsyncThunk<any, string>(
  'jobs/deleteJob',
  async (jobId, thunkAPI) => {
    try {
      const response = await axiosApi.delete(`/api/jobs/${jobId}`);
      if (response.status === 200) {
        console.log("Job deleted successfully:", response.data);
        return response.data; // Return the data (message and jobId)
      }
      // If status is not 200, throw an error
      throw new Error("Failed to delete job");
    } catch (error: any) {
      // Improved error logging to handle different types of errors
      if (error.response) {
        console.error("Error response:", error.response);
      } else if (error.request) {
        console.error("Request made but no response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      return thunkAPI.rejectWithValue(error.message || 'Failed to delete job');
    }
  }
);


// Job slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload; // Store the fetched job
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload;
        // Update the job in the state
        state.jobs = state.jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job));
        state.job = updatedJob; // Store the updated job
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        const deletedJobId = action.payload.jobId;
        state.jobs = state.jobs.filter(job => job.id !== deletedJobId);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
