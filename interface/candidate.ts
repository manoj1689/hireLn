export interface CandidateRequest {
  email: string;
  name: string;
  phone: string;
  resume: string;
  portfolio: string;
  linkedin: string;
  github: string;
  skills: string[];
  experience: string;
  education: string;
  location: string;
  salaryExpectation: number;
}

export interface CandidateResponse {
  avatarUrl: string;
  id: string;
  email: string;
  name: string;
  phone: string;
  resume: string | null; // Assuming resume could be null or undefined
  portfolio: string | null; // Same for portfolio
  linkedin: string | null; // Same for linkedin
  github: string | null; // Same for github
  skills: string[];
  experience: string;
  education: string;
  location: string;
  salaryExpectation: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  applicationStatus: string; // Added this field based on your example
  interviewStatus: string; // Added this field based on your example
}

