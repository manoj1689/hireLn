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
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { IoMdEye, IoMdEyeOff, IoMdMic, IoMdMicOff } from "react-icons/io";
import { RiRobot3Fill } from "react-icons/ri";

interface InterviewChatPageProps {
  interviewId: string;
  candidate: { id: string; name?: string };
  candidateId: string;
  applicationId: string;
  token: string;
  job: any;
}

const InterviewChatPage: React.FC<InterviewChatPageProps> = ({
  interviewId, candidate, candidateId, applicationId, token, job,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { greeting, currentQuestion, chatHistory, level, lastScore, loading, error } =
    useSelector((state: RootState) => state.interviewChat);

  const [started, setStarted] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [greetingDone, setGreetingDone] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [examEnded, setExamEnded] = useState(false);

  // Silence tracking
  const [warningGiven, setWarningGiven] = useState(false);
  const [silenceStartTime, setSilenceStartTime] = useState<number | null>(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const handleStartInterview = async () => {
    await dispatch(startInterviewChat({ interviewId, candidate, token }));
    setStarted(true);
    setCurrentText(greeting);
  };

  const handleGreetingComplete = () => {
    setGreetingDone(true);
    setCurrentText(currentQuestion);
  };

  const handleQuestionSpoken = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

    // reset silence logic
    setWarningGiven(false);
    setSilenceStartTime(Date.now());
  };

  // Silence detector (5s warning, 10s auto-exit)
  useEffect(() => {
    if (!listening || !greetingDone || examEnded) return;

    const interval = setInterval(() => {
      if (!silenceStartTime) return;

      const elapsed = Date.now() - silenceStartTime;

      // User spoke → reset timer
      if (transcript.trim()) {
        setSilenceStartTime(Date.now());
        return;
      }

      // 5 sec → warn once
      if (elapsed > 5000 && !warningGiven) {
        setWarningGiven(true);
        setCurrentText("Please respond or I will end the interview.");
      }

      // 10 sec → auto-exit
      if (elapsed > 10000) {
        SpeechRecognition.stopListening();
        clearInterval(interval);
        handleSendAnswer("I did not respond. Please exit the interview.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [listening, silenceStartTime, transcript, warningGiven, greetingDone, examEnded]);

  const handleSendAnswer = async (userSpeech: string) => {
    if (!userSpeech.trim() || examEnded) return;

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

    try {
      const res = await dispatch(sendChatResponse(payload)).unwrap();
      resetTranscript();

      if (res.intent === "exit" || res.intent === "leave") {
        setCurrentText(res.response);
        await handleAutoExamEnd();
      } else if (res?.next_question) {
        setCurrentText(res.next_question);
      }
    } catch (err) {
      console.error("Error sending answer:", err);
    }
  };

  const handleAutoExamEnd = async () => {
    if (examEnded) return;
    setExamEnded(true);

    SpeechRecognition.stopListening();

    try {
      await dispatch(
        saveChatHistory({ interviewId, candidateId, applicationId, history: chatHistory, token })
      );
    } catch (err) {
      console.error("Error saving chat:", err);
    }

    setTimeout(() => {
      router.push(`/ai-interview-result?interview_id=${interviewId}&token=${token}`);
    }, 7500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="flex text-2xl font-bold gap-4 justify-center mb-6">
        <RiRobot3Fill size={28} color="orange" /> AI Voice Interview
      </h1>

      {!started && (
        <>
          <div className="text-3xl text-stone-700">Are you ready? Click to start.</div>
          <Button onClick={handleStartInterview} disabled={loading} className="px-12 text-lg py-4 mt-12">
            {loading ? "Starting..." : "Start Interview"}
          </Button>
        </>
      )}

      {started && !examEnded && !greetingDone && (
        <TextSpeaker text={greeting ?? ""} trigger={!!greeting} onComplete={handleGreetingComplete} />
      )}

      {started && !examEnded && greetingDone && (
        <div className="mt-6 space-y-6">
          <TextSpeaker text={currentText ?? ""} trigger={!!currentText} onComplete={handleQuestionSpoken} />

          <SpeakingAvatar text={transcript} imgSrc="/images/Avatar/femaleUsAi.jpeg" candidateName={candidate.name || ""} />

          <div className="flex flex-col w-full bg-gray-200 rounded-lg shadow-lg mx-auto relative p-2">
            <button className="absolute top-0 right-2 p-2" onClick={() => setShowTranscript(!showTranscript)}>
              {showTranscript ? <IoMdEyeOff /> : <IoMdEye />}
            </button>

            {showTranscript && (
              <div className="px-4 py-4">
                <div className="max-h-64 overflow-y-auto pr-2">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {transcript || "Speak after AI finishes..."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center items-center mt-2">
              {listening ? (
                <>
                  <IoMdMic size={20} className="text-sky-500" />
                  <span className="text-green-600 ml-2">Listening...</span>
                </>
              ) : (
                <>
                  <IoMdMicOff size={20} className="text-gray-500" />
                  <span className="text-gray-500 ml-2">Mic inactive</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {examEnded && (
        <TextSpeaker text={currentText ?? ""} trigger={!!currentText} onComplete={() => {}} />
      )}

      {error && <pre className="text-red-500 mt-4 text-sm whitespace-pre-wrap">{JSON.stringify(error)}</pre>}
    </div>
  );
};

export default InterviewChatPage;
