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

export interface DashboardMetrics {
  totalJobs: number;
  activeCandidates: number;
  hiringSuccessRate: number;
  avgTimeToHire: number;
  aiInterviewsCompleted: number;
}
