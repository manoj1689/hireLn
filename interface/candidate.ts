export interface CandidateRequest {
  name: string;
  email: string;
  phone?: string;
  address: string[];
  location?: string;

  personalInfo?: PersonalInfo;
  summary?: string;

  education?: Education[];
  experience?: Experience[];
  previousJobs: PreviousJob[];

  internships: string[];
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  certifications?: Certification[];
  projects?: Project[];
  hobbies: string[];

  salaryExpectation?: number;
  department?: string;
}

export interface PersonalInfo {
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
}

export interface Certification {
  title: string;
  issuer?: string;
  date?: string;
}

export interface Project {
  title: string;
  description?: string;
  url?: string;
}

export interface Education {
  degree?: string;
  institution?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
}

export interface Experience {
  title?: string;
  company?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface PreviousJob {
  title: string;
  company: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  description: string[];
}

export type ApplicationStatus =
  | "NEW"
  | "INVITED"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

export type InterviewStatus =
  | "NOT SCHEDULED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";


export interface CandidateResponse {
  id: string;
  avatarUrl?: string;
  email: string;
  name: string;
  phone: string;
  resume: string | null;
  portfolio: string | null;
  linkedin: string | null;
  github: string | null;

  skills: string[];
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  hobbies: string[];
  address: string[];
  links: string[];
  internships: string[];

  certifications: Certification[];
  projects: Project[];
  previousJobs: PreviousJob[]; // detailed experience

  education: Education[]; // detailed education list
  personalInfo: PersonalInfo;

  summary: string;
  experience: Experience[];

  educationField: string;
  location: string;
  salaryExpectation: number;
  department: string;

  applicationStatus: ApplicationStatus | null;
  interviewStatus: InterviewStatus | null;

  createdAt: string;
  updatedAt: string;
}


