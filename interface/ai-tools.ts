// Represents a single uploaded resume
export interface ResumeUploadApiResponse {
  success: boolean;
  resume_name: string;
  candidate_id: string;
  resume_id: string;
  candidate_name: string;
}

// Redux state for single upload
export interface ResumeUploadState {
  uploaded: ResumeUploadApiResponse | null;
  loading: boolean;
  error: string | null;
}
