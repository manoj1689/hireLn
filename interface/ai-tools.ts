// Upload resume data in mongo_db
export interface ResumeUploadResponseItem {
  resume_name: string;
  resume_id: string;
}

export interface ResumeUploadApiResponse {
  summary: ResumeUploadResponseItem[];
}

export interface ResumeUploadState {
  uploaded: ResumeUploadResponseItem[];
  loading: boolean;
  error: string | null;
}