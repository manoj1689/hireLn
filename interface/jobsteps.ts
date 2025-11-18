// types/jobStep1.ts

export interface JobStep1Request {
  jobTitle: string;
  department: string;
  location: string;
  requiredSkills: string[]
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN';
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: 'yearly' | 'monthly' | 'weekly' | 'hourly';
}

export interface JobStep1Response {
  message: string;
  step: number;
  sessionId: string;
  aiSuggestions: {
    titleSuggestion: string;
    salaryRange: {
      min: number;
      max: number;
      note: string;
    };
  };
}


// src/interface/jobsteps/JobDetailsStepRequest.ts
export interface JobDetailsStepRequest {
  jobDescription: string;
  keyResponsibilities: string[];
  workMode: string;
  requiredExperience: string;
  teamSize: string;
  reportingStructure: string;
}

// src/interface/jobsteps/JobDetailsStepResponse.ts

export interface SimilarJob {
  title: string;
  company: string;
  location: string;
  salary: string;
}

export interface JobDetailsStepResponse {
  message: string;
  step: number;
  sessionId: string;
  similarJobs: SimilarJob[];
}


// src/interface/jobsteps/JobRequirementsRequest.ts

export interface LanguageRequirement {
  name: string
  proficiency: string
}

export interface JobRequirementsRequest {
  educationLevel: string
  certifications: string[]
  requirements:string[]
  languages: LanguageRequirement[]
  softSkills: string[]
}


// src/interface/jobsteps/JobRequirementsResponse.ts

// Define interface for the `basic_info` section
export interface BasicInfo {
  jobTitle: string
  department: string
  location: string
  employmentType: string
  salaryMin: number
  salaryMax: number
  salaryPeriod: string
}

// Define interface for the `job_details` section
export interface JobDetails {
  jobDescription: string
  keyResponsibilities: string[]
  workMode: string
  requiredExperience: string
  teamSize: string
  reportingStructure: string
}

// Define interface for the `requirements` section
export interface Requirements {
  requiredSkills: string[]
  educationLevel: string
  certifications: string[]
  languages: LanguageRequirement[]
  softSkills: string[]
}

// Define the main interface for the response
export interface JobRequirementsResponse {
  message: string
  step: number
  sessionId: string
  jobData: {         // Include all data entered up to step 3
    basic_info: BasicInfo
    job_details: JobDetails
    requirements: Requirements
  }
}


// Define the initial state of publishing options
export interface PublishingOptionsState {
  internalJobBoard: boolean
  externalJobBoards: boolean
  socialMedia: boolean
  applicationFormFields: Record<string, boolean> // Store form fields as key-value pairs (field: required/optional)
}

// Interface for AdditionalQuestion
export interface AdditionalQuestion {
  question: string;
  type: "boolean" | "text";  // Enforcing a restricted set of string values
}

interface ApplicationFormFields {
  resume: boolean;
  coverLetter: boolean;
  linkedinProfile: boolean;
  portfolioLink: boolean;
  additionalQuestions: AdditionalQuestion[];
}


// Interface for JobPublishRequest
export interface JobPublishRequest {
  internalJobBoard: boolean;
  externalJobBoards: boolean;
  socialMedia: boolean;
  applicationFormFields: ApplicationFormFields
}

interface Job {
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  salaryMin: number;
  salaryMax: number;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  education: string;
  isRemote: boolean;
  isHybrid: boolean;
  id: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string; // ISO 8601 format string
  updatedAt: string; // ISO 8601 format string
  publishedAt: string; // ISO 8601 format string
  closedAt: string | null; // ISO 8601 format string or null
}

export interface JobPublishResponse {
  message: string;
  job: Job;
  publishedTo: string[]; // List of job boards or platforms the job was published to
}


// Define the interfaces based on the API response
export interface JobListData {
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: string;
  salaryMax: number;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  education: string;
  isRemote: boolean;
  isHybrid: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  closedAt: string;
  id: string;
}



export interface JobData {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE'; // Assuming other types might be available
  salaryMin: number;
  salaryMax: number;
  requirements: string[]; // Array of strings for requirements
  responsibilities: string[]; // Array of strings for responsibilities
  skills: string[]; // Array of strings for skills
  experience: string; // Experience as a string (can be years or description)
  education: string; // Education as a string (e.g., degree or requirement)
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED'; // Enum of possible status
  isRemote: boolean; // Boolean indicating whether the job is remote
  isHybrid: boolean; // Boolean indicating whether the job is hybrid
}


// Interface for JobsState
export interface JobsState {
  jobs: JobListData[];    // List of all jobs
  loading: boolean;       // Loading state for jobs
  error: string | null;   // Error message
  job: JobData | null;    // A single job for editing or viewing
}