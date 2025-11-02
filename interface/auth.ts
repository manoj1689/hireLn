export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string; // "RECRUITER" | "USER" etc.
  registered: boolean;
  fcm_token?: string;
  accountType: string; // "FREE_TRIAL" | "MONTHLY" | "YEARLY"
  subscriptionActive: boolean;
  trialEndsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  access_token: string;
  token_type: string;
  user: User | null;
  isAuthenticated: boolean;
}
