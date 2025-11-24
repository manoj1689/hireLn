// src/lib/features/screenshot/screenshotTypes.ts

export interface Screenshot {
  id: string;
  interviewId: string;
  imageUrl: string;
  faceVerified?: boolean | null;
  multiFace?: boolean | null;
  note?: string | null;
  capturedAt: string;
}

export interface ScreenshotResponse {
  success: boolean;
  screenshot: Screenshot;
}

export interface ScreenshotSaveResponse {
  success: boolean;
  screenshot: ScreenshotResponse;
}

export interface ScreenshotListResponse {
  success: boolean;
  count: number;
  screenshots: Screenshot[];
}

export interface ScreenshotDeleteResponse {
  success: boolean;
  deletedId: string;
}

export interface ScreenshotUploadPayload {
  interview_id: string;
  faceVerified?: boolean | null;
  multiFace?: boolean | null;
  note?: string | null;
  file: File;
}
