export type SalaryPeriod = "yearly" | "monthly" | "weekly" | "hourly";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY"
  | "INTERNSHIP";

export interface LanguageItem {
  language: string;
  level: string;
}

export interface JobCreatePayload {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: SalaryPeriod;
  description: string;
  skills: string[];
  education?: string;
  languages: LanguageItem[];
}


export interface LanguageItem {
  language: string;
  level: string;
}

export interface JobCreatePayload {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: SalaryPeriod;
  description: string;
  skills: string[];
  education?: string;
  languages: LanguageItem[];
}

export interface JobResponse {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: SalaryPeriod;
  description: string;
  skills: string[];
  education?: string;
  createdAt: string;
}
