export interface UserSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  autoSave: boolean;

  emailDailyDigest: boolean;
  emailNewCandidateAlerts: boolean;
  emailMarketingEmails: boolean;
  emailNewApplications: boolean;
  emailInterviewReminders: boolean;
  emailTaskDeadlines: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;

  pushNewApplications: boolean;
  pushInterviewReminders: boolean;
  pushTaskDeadlines: boolean;
  pushProductUpdates: boolean;
  pushSecurityAlerts: boolean;

  id: string;
  userId: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}


export interface UpdateUserSettingsPayload {
  language: string;
  timezone: string;
  dateFormat: string;
  autoSave: boolean;

  emailDailyDigest: boolean;
  emailNewCandidateAlerts: boolean;
  emailMarketingEmails: boolean;
  emailNewApplications: boolean;
  emailInterviewReminders: boolean;
  emailTaskDeadlines: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;

  pushNewApplications: boolean;
  pushInterviewReminders: boolean;
  pushTaskDeadlines: boolean;
  pushProductUpdates: boolean;
  pushSecurityAlerts: boolean;
}


// Separate Update Request Interfaces
export interface GeneralSettingsUpdate {
  language: string;
  timezone: string;
  dateFormat: string;
  autoSave: boolean;
}

export interface EmailSettingsUpdate {
  emailDailyDigest: boolean;
  emailNewCandidateAlerts: boolean;
  emailMarketingEmails: boolean;
}

export interface NotificationSettingsUpdate {
  emailNewApplications: boolean;
  pushNewApplications: boolean;
  emailInterviewReminders: boolean;
  pushInterviewReminders: boolean;
  emailTaskDeadlines: boolean;
  pushTaskDeadlines: boolean;
  emailProductUpdates: boolean;
  pushProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  pushSecurityAlerts: boolean;
}
