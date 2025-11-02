import { ApplicationStatus } from "./types/applicationTypes";

// Interfaces for request and response
export interface ApplicationRequest {
  jobId: string;
  candidateId: string;
  coverLetter?: string;
  userId?: string;
  appliedAt?: string;
  matchScore?: number;   // ✅ make optional
  isGuest?: boolean;     // ✅ add this
}




export interface ApplicationResponse {
  jobId: string;
  candidateId: string;
  coverLetter: string;
  id: string;
  status: ApplicationStatus;
  matchScore: number;
  notes: string;
  appliedAt: string;
  updatedAt: string;
}

export interface UpdateApplicationRequest {
  status: ApplicationStatus
  notes: string
  matchScore: number
}

