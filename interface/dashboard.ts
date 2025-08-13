// @/interface/dashboard.ts

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
}

export interface PipelineStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface RecruitmentTrend {
  month: string;
  applications: number;
}

export interface MetricWithChange {
  value: number;
  change: number; // percentage change compared to last month
}

export interface DashboardMetrics {
  totalJobs: MetricWithChange;
  activeCandidates: MetricWithChange;
  hiringSuccessRate: MetricWithChange;
  avgTimeToHire: MetricWithChange;
  aiInterviewsCompleted: MetricWithChange;
}


export interface DepartmentStat {
  department: string
  jobCount: number
}


