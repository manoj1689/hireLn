// --- Interface for Profile Data ---
export interface ProfileData {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  companyName: string;
  companySize: string;
  industry: string;
  hiringVolume: string;
  primaryHiringNeeds: string[];
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
