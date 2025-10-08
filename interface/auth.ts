
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
