import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosApi from "@/services/api"; // ✅ Your pre-configured axios instance

// ----------------------------------
// ✅ Interfaces
// ----------------------------------
export interface SkillSuggestion {
  id?: string;
  department: string;
  suggestions: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SkillSuggestionState {
  departments: { id: string; name: string }[]; // ✅ Department list
  suggestions: string[]; // ✅ Skills for selected department
  loading: boolean;
  error: string | null;
}

// ----------------------------------
// ✅ Initial State
// ----------------------------------
const initialState: SkillSuggestionState = {
  departments: [],
  suggestions: [],
  loading: false,
  error: null,
};

// ----------------------------------
// ✅ Thunks
// ----------------------------------

// ✅ Fetch all departments
export const fetchSkillSuggestions = createAsyncThunk(
  "skillsuggestions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosApi.get("/api/skillsuggestions");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch skill suggestions"
      );
    }
  }
);

// ✅ Fetch skill suggestions by department
export const fetchSkillSuggestionsByDept = createAsyncThunk(
  "skillsuggestions/fetchByDept",
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const res = await axiosApi.get(`/api/skillsuggestions/${departmentId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch department suggestions"
      );
    }
  }
);

// ✅ Add new department skill suggestion
export const addSkillSuggestion = createAsyncThunk(
  "skillsuggestions/add",
  async (data: SkillSuggestion, { rejectWithValue }) => {
    try {
      const res = await axiosApi.post("/api/skillsuggestions", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to add skill suggestion"
      );
    }
  }
);

// ✅ Update department skill suggestion (e.g. add new skill)
export const updateSkillSuggestion = createAsyncThunk(
  "skillsuggestions/update",
  async (
    { id, data }: { id: string; data: Partial<SkillSuggestion> },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosApi.put(`/api/skillsuggestions/${id}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to update skill suggestion"
      );
    }
  }
);

// ✅ Delete entire department suggestion
export const deleteSuggestion = createAsyncThunk(
  "skillsuggestions/deleteSuggestion",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`/api/skillsuggestions/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to delete skill suggestion"
      );
    }
  }
);

// ✅ Delete a single skill from department suggestions
export const deleteSkillSuggestion = createAsyncThunk(
  "skillsuggestions/deleteSkill",
  async (
    { id, skill }: { id: string; skill: string },
    { rejectWithValue }
  ) => {
    try {
      // ✅ Match your FastAPI route structure
      const res = await axiosApi.delete(
        `/api/skillsuggestions/${id}/skill/${encodeURIComponent(skill)}`
      );
      console.log("Deleted skill:", res.data);
      return { id, skill, updated: res.data.updated_suggestions };
    } catch (err: any) {
      console.error("Delete skill error:", err.response?.data);
      return rejectWithValue(err.response?.data || "Failed to delete skill suggestion");
    }
  }
);

// ----------------------------------
// ✅ Slice
// ----------------------------------
const skillSuggestionSlice = createSlice({
  name: "skillsuggestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ----------------------------------
      // ✅ Fetch All Departments
      // ----------------------------------
      .addCase(fetchSkillSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSkillSuggestions.fulfilled,
        (state, action: PayloadAction<SkillSuggestion[]>) => {
          state.loading = false;
          state.departments = action.payload.map((item) => ({
            id: item.id || item.department,
            name: item.department,
          }));

          // Optionally, collect all unique skills
          const allSkills = action.payload.flatMap(
            (item) => item.suggestions || []
          );
          state.suggestions = Array.from(new Set(allSkills));
        }
      )
      .addCase(fetchSkillSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ----------------------------------
      // ✅ Fetch Suggestions by Department
      // ----------------------------------
      .addCase(fetchSkillSuggestionsByDept.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchSkillSuggestionsByDept.fulfilled,
        (state, action: PayloadAction<SkillSuggestion>) => {
          state.loading = false;
          state.suggestions = action.payload?.suggestions || [];
        }
      )
      .addCase(fetchSkillSuggestionsByDept.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.suggestions = [];
      })

      // ----------------------------------
      // ✅ Add Department
      // ----------------------------------
      .addCase(
        addSkillSuggestion.fulfilled,
        (state, action: PayloadAction<SkillSuggestion>) => {
          state.departments.push({
            id: action.payload.id!,
            name: action.payload.department,
          });
        }
      )

      // ----------------------------------
      // ✅ Update Department Skills
      // ----------------------------------
      .addCase(
        updateSkillSuggestion.fulfilled,
        (state, action: PayloadAction<SkillSuggestion>) => {
          const idx = state.departments.findIndex(
            (d) => d.id === action.payload.id
          );
          if (idx !== -1) {
            state.departments[idx].name = action.payload.department;
          }
          state.suggestions = action.payload.suggestions || [];
        }
      )

      // ----------------------------------
      // ✅ Delete Entire Department
      // ----------------------------------
      .addCase(deleteSuggestion.fulfilled, (state, action) => {
        state.departments = state.departments.filter(
          (d) => d.id !== action.payload
        );
        state.suggestions = [];
      })

      // ----------------------------------
      // ✅ Delete Single Skill
      // ----------------------------------
      .addCase(deleteSkillSuggestion.fulfilled, (state, action) => {
        state.suggestions = action.payload || [];
      });
  },
});

export default skillSuggestionSlice.reducer;
