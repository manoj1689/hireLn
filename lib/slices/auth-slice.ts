import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
  email: string
  firstName: string
  lastName: string
  avatar: string | null
  role: string
  companyName: string
  companySize: string
  industry: string
  hiringVolume: string
  primaryHiringNeeds: string[]
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface AuthState {
  access_token: string
  token_type: string
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  access_token: "",
  token_type: "",
  user: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(
      state,
      action: PayloadAction<{
        access_token: string
        token_type: string
        user: User
      }>
    ) {
      state.access_token = action.payload.access_token
      state.token_type = action.payload.token_type
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    logout(state) {
      state.access_token = ""
      state.token_type = ""
      state.user = null
      state.isAuthenticated = false
    }
  }
})

export const { setAuthData, logout } = authSlice.actions
export default authSlice.reducer
