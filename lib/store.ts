import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from 'redux-persist/lib/storage'
// All your reducers...
import registerStep1Reducer from "@/lib/slices/register/register-step-1";
import registerStep2Reducer from "@/lib/slices/register/register-step-2";
import registerStep3Reducer from "@/lib/slices/register/register-step-3";
import authReducer from "./slices/auth-slice";
import dashboardReducer from '@/lib/slices/dashboard/dashboard-slice';
import jobBasicInfoReducer from "@/lib/slices/job/jobBasicInfo-slice";
import jobDetailsReducer from "@/lib/slices/job/jobDetails-slice";
import jobRequirementReducer from "@/lib/slices/job/jobRequirements-slice";
import jobPublishReducer from "@/lib/slices/job/jobPublish-slice";
import jobsListReducer from "@/lib/slices/job/jobsList-slice";
import matchedCandidateReducer from "@/lib/slices/aitools/matched-candidate-Slice";
import candidateReducer from "@/lib/slices/candidate/candidate-slice";
import applicationReducer from "@/lib/slices/applicant/application-slice";
import getApplicationReducer from "@/lib/slices/applicant/getapplications-slice";
import joinInterviewReducer from "@/lib/slices/join_interview/interview-join-slice";
import generateInterviewQuestionsReducer from "@/lib/slices/aitools/generate-interview-questions";
import bulkUploadQuestionsReducer from "@/lib/slices/questions/upload-bulk-questions";
import interviewQuestionsReducer from '@/lib/slices/questions/interview-question-Slice';
import resumeParcingReducer from "@/lib/slices/aitools/resume-parcing-slice"
import submitAnswerReducer from "@/lib/slices/questions/submit-answer-slice";
import autoEvaluateAnswerReducer from "@/lib/slices/questions/auto-evaluate-answer-slice";
import fetchInterviewReducer from "@/lib/slices/interviews/fetch-interview-slice";
import finalInterviewEvaluationReducer from "@/lib/slices/final_evaluation/final-evaluate-interview-slice";
import interviewResultReducer from "@/lib/slices/interview_result/interview-result-slice";
import finalMailReducer from "@/lib/slices/interview/sendInterviewResultSlice"
import companyProfileReducer from "@/lib/slices/company/company-profile";
import companyLocationReducer from "@/lib/slices/company/company-location";
import settingReducer from "@/lib/slices/settings/settings-slice";

const rootReducer = combineReducers({
  registerStep1: registerStep1Reducer,
  registerStep2: registerStep2Reducer,
  registerStep3: registerStep3Reducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  jobBasicInfo: jobBasicInfoReducer,
  jobDetails: jobDetailsReducer,
  jobRequirement: jobRequirementReducer,
  jobPublish: jobPublishReducer,
  jobsList: jobsListReducer,
  matchedCandidate: matchedCandidateReducer,
  candidate: candidateReducer,
  application: applicationReducer,
  getApplication: getApplicationReducer,
  joinInterview: joinInterviewReducer,
  generateInterviewQuestions: generateInterviewQuestionsReducer,
  bulkUploadQuestions: bulkUploadQuestionsReducer,
  interviewQuestions: interviewQuestionsReducer,
  submitAnswer: submitAnswerReducer,
  autoEvaluateAnswer: autoEvaluateAnswerReducer,
  fetchInterview: fetchInterviewReducer,
  finalInterviewEvaluation: finalInterviewEvaluationReducer,
  resumeParcing:resumeParcingReducer,
  interviewResult: interviewResultReducer,
  finalMail:finalMailReducer,
  companyProfile: companyProfileReducer,
  companyLocation: companyLocationReducer,
  setting: settingReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ✅ Only persist `auth`, you can add more
};


const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
       serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
