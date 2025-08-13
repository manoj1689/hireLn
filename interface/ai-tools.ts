// Define the structure of personal info and resume data
interface PersonalInfo {
  dob: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
}

export interface ParsedResumeData {
  email: string;
  name: string;
  phone: string;
  resume: string;
  portfolio: string;
  linkedin: string;
  github: string;
  skills: string[];
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  hobbies: string[];
  certifications: string[];
  projects: string[];
  summary: string;
  experience: string;
  education: string;
  educationField: string;
  internships: any[];
  location: string;
  salaryExpectation: number;
  department: string;
  experienceSummary: string;
  previousJobs: any[];
  address: string[];
  links: string[];
  personalInfo: PersonalInfo;
}

export interface ResumeUploadResponseItem {
  file_name: string;
  data: ParsedResumeData;
  error: string;
}

export interface ResumeUploadState {
  uploaded: ResumeUploadResponseItem[];
  loading: boolean;
  error: string | null;
}