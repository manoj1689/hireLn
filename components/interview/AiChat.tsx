"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startInterviewChat,
  sendChatResponse,
  saveChatHistory,
} from "@/lib/slices/interview_chat/interview-chat-slice";
import TextSpeaker from "./TextSpeaker";
import SpeakingAvatar from "@/components/interview/SpeakingAvatar";
import { Button } from "../ui/button";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { RiRobot3Fill } from "react-icons/ri";
interface InterviewChatPageProps {
  interviewId: string;
  candidate: { id: string; name?: string };
  candidateId: string;
  applicationId: string;
  token: string;
  job: any; // or define a proper Job type if you have one
}

const InterviewChatPage: React.FC<InterviewChatPageProps> = ({
  interviewId,
  candidate,
  candidateId,
  applicationId,
  token,
  job,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    greeting,
    currentQuestion,
    chatHistory,
    level,
    lastScore,
    loading,
    error,
  } = useSelector((state: RootState) => state.interviewChat);

  const [started, setStarted] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [greetingDone, setGreetingDone] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [lastTranscriptTime, setLastTranscriptTime] = useState<number>(0);
  const [examEnded, setExamEnded] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  // 🟢 Step 1: Start interview
  const handleStartInterview = async () => {
    try {
      await dispatch(startInterviewChat({ interviewId, candidate, token }));
      setStarted(true);
      setCurrentText(greeting);
    } catch (err) {
      console.error("Failed to start interview:", err);
    }
  };

  // 🟢 Step 2: Greeting complete → first question
  const handleGreetingComplete = () => {
    setGreetingDone(true);
    setCurrentText(currentQuestion);
  };

  // 🟢 Step 3: After AI question → start mic
  const handleQuestionSpoken = () => {
    console.log("🎤 Starting mic...");
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setLastTranscriptTime(Date.now());
  };

  // 🟢 Step 4: Track speech activity
  useEffect(() => {
    if (transcript.trim()) setLastTranscriptTime(Date.now());
  }, [transcript]);

  // 🟢 Step 5: Detect silence → auto-stop mic
  useEffect(() => {
    if (!listening || !greetingDone || examEnded) return;

    const silenceTimer = setInterval(() => {
      if (Date.now() - lastTranscriptTime > 3000 && transcript.trim()) {
        console.log("🛑 Detected silence, stopping mic...");
        SpeechRecognition.stopListening();
        clearInterval(silenceTimer);
        handleSendAnswer(transcript);
      }
    }, 1000);

    return () => clearInterval(silenceTimer);
  }, [listening, lastTranscriptTime, transcript, greetingDone, examEnded]);

  // 🟢 Step 6: Send answer to backend
  const handleSendAnswer = async (userSpeech: string) => {
    if (!userSpeech.trim() || examEnded) return;
    setConversationLoading(true);

    const payload = {
      interviewId,
      user_input: userSpeech,
      question: currentQuestion ?? "Unknown question",
      last_score: lastScore ?? undefined,
      last_level: level ?? 1,
      jd_text: job,
      history: chatHistory,
      token,
    };

    // console.log("🎯 Sending payload:", payload);

    try {
      const res = await dispatch(sendChatResponse(payload)).unwrap();
      setConversationLoading(false);
      resetTranscript();

      // 🟢 Proper condition fix
      if (res.intent === "exit" || res.intent === "leave") {
        setCurrentText(res.response);
        await handleAutoExamEnd();
      } else if (res?.next_question) {
        setCurrentText(res.next_question);
      }
    } catch (err) {
      console.error("Error sending answer:", err);
      setConversationLoading(false);
    }
  };

  // 🟢 Step 7: Save and redirect automatically
  const handleAutoExamEnd = async () => {
    if (examEnded) return;
    setExamEnded(true);
    SpeechRecognition.stopListening();
    try {
      await dispatch(
        saveChatHistory({
          interviewId,
          candidateId,
          applicationId, // ✅ now properly passed
          history: chatHistory,
          token,
        })
      );
      console.log("✅ Chat saved successfully");
    } catch (err) {
      console.error("Error saving chat:", err);
    }

    setTimeout(() => {
      router.push(
        `/ai-interview-result?interview_id=${interviewId}&token=${token}`
      );
    }, 7500);
  };
 console.log(candidate.name)
  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="flex text-2xl font-bold gap-4 justify-center mb-6"><span><RiRobot3Fill size={28} color="orange"/></span> AI Voice Interview</h1>

      {!started && (
        <>
          <div className="text-3xl text-stone-700">
            Are you ready for this interview? Click to start.
          </div>
          <Button
            onClick={handleStartInterview}
            disabled={loading}
            className="px-12 text-lg py-4 mt-12 transition-all"
          >
            {loading ? "Starting..." : "Start Interview"}
          </Button>
        </>
      )}

      {/* Greeting */}
      {started && !examEnded && !greetingDone && (
        <div className="flex flex-col items-center gap-4">
          <TextSpeaker
            text={greeting ?? ""}
            trigger={!!greeting}
            onComplete={handleGreetingComplete}
          />
        </div>
      )}

      {/* Main Interview */}
      {started && !examEnded && greetingDone && (
        <div className="mt-6 space-y-6">
          <TextSpeaker
            text={currentText ?? ""}
            trigger={!!currentText}
            onComplete={handleQuestionSpoken}
          />

          <SpeakingAvatar
            text={transcript}
            imgSrc="/images/Avatar/femaleUsAi.jpeg"
            candidateName={candidate.name || ""}
          />

          {/* Transcript */}
          <div className="flex flex-col w-full bg-gray-200 rounded-lg shadow-lg mx-auto relative p-2">
            <button
              className="absolute top-0 right-2 p-2 md:p-3 z-10"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {!showTranscript ? (
                <IoMdEye className="text-gray-600" size={24} />
              ) : (
                <IoMdEyeOff className="text-gray-600" size={24} />
              )}
            </button>

            <div
              className={`flex flex-col w-full px-4 py-4 transition-all duration-300 ${
                showTranscript ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-full max-h-64 overflow-y-auto pr-2">
                <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">
                  {transcript || "Speak when AI stops talking..."}
                </p>
              </div>
            </div>

            {/* Listening Indicator */}
            <div className="flex justify-center items-center mt-2">
              <span
                className={`flex gap-4 text-sm font-medium ${
                  listening ? "text-green-600" : "text-gray-500"
                }`}
              >
                {listening ? (
                  <>
                  <div></div>
                    <IoMdMic size={20} className="text-sky-500" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <IoMdMicOff size={20} className="text-gray-500" />
                    <span>Mic inactive</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      {examEnded && (
        <div className="mt-10">
          <TextSpeaker
            text={currentText ?? ""}
            trigger={!!currentText}
            onComplete={() => {}}
          />
        </div>
      )}
      {/* Error */}
      {error && (
        <pre className="text-red-500 mt-4 whitespace-pre-wrap text-sm">
          {typeof error === "string" ? error : JSON.stringify(error, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default InterviewChatPage;
