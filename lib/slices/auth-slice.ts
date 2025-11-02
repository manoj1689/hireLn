import { AuthState, User } from "@/interface/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: AuthState = {
  access_token: "",
  token_type: "",
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(
      state,
      action: PayloadAction<{
        access_token: string;
        token_type: string;
        user: User;
      }>
    ) {
      state.access_token = action.payload.access_token;
      state.token_type = action.payload.token_type;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.access_token = "";
      state.token_type = "";
      state.user = null;
      state.isAuthenticated = false;
    },
     // ✅ new reducer to only update `registered`
    setUserRegistered(state, action: PayloadAction<boolean>) {
      if (state.user) {
        state.user.registered = action.payload;
      }
    },
  },
});

export const { setAuthData, logout,setUserRegistered  } = authSlice.actions;
export default authSlice.reducer;
