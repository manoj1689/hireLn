"use client";

import React, { useState, useEffect, useRef } from "react";
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
// Removed react-speech-recognition - using Google STT API instead
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { RiRobot3Fill } from "react-icons/ri";

// Guard to prevent duplicate start calls (React Strict Mode double-invoke)
const startedInterviewIds = new Set<string>();

interface InterviewChatPageProps {
  interviewId: string;
  candidate: { id: string; name?: string };
  candidateId: string;
  applicationId: string;
  token: string;
  job: any; // or define a proper Job type if you have one
  interviewDuration?: number;
}

const InterviewChatPage: React.FC<InterviewChatPageProps> = ({
  interviewId,
  candidate,
  candidateId,
  applicationId,
  token,
  job,
  interviewDuration
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
  const autoStartRef = useRef(false);
  const examTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Google STT implementation
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Debug: Log transcript changes
  useEffect(() => {
    console.log("🔄 Transcript state changed to:", transcript);
  }, [transcript]);

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Try to use the best supported audio format
      let mimeType = "audio/webm;codecs=opus";
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      }

      console.log("🎙️ Using MIME type:", mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("📦 Audio chunk received:", event.data.size, "bytes");
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("🛑 Recording stopped. Total chunks:", audioChunksRef.current.length);

        if (audioChunksRef.current.length === 0) {
          console.error("❌ No audio data recorded");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        console.log("🎵 Audio blob size:", audioBlob.size, "bytes");
        console.log("🎵 Audio MIME type:", mediaRecorder.mimeType);

        if (audioBlob.size === 0) {
          console.error("❌ Audio blob is empty");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const base64Audio = await blobToBase64(audioBlob);
        console.log("📝 Base64 audio length:", base64Audio.length);

        // Send to Google STT API
        try {
          const res = await fetch("/api/stt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audio: base64Audio,
              mimeType: mediaRecorder.mimeType
            }),
          });

          const data = await res.json();
          console.log("🎤 STT Response:", data);

          if (data.text) {
            console.log("✅ Setting transcript to:", data.text);
            setTranscript(data.text);
            console.log("📤 Calling handleSendAnswer with:", data.text);
            handleSendAnswer(data.text);
          } else if (data.error) {
            console.error("STT error:", data.error);
          } else {
            console.warn("⚠️ No text in STT response");
          }
        } catch (error) {
          console.error("Error calling STT API:", error);
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording with timeslice to ensure data is collected
      mediaRecorder.start(1000); // Collect data every 1 second
      mediaRecorderRef.current = mediaRecorder;
      setListening(true);
      console.log("🎙️ Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please grant permission.");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setListening(false);
    }
  };

  // Reset transcript
  const resetTranscript = () => {
    setTranscript("");
  };

  // 🟢 Step 1: Start interview
  const handleStartInterview = async () => {
    if (started || startedInterviewIds.has(interviewId)) {
      setStarted(true);
      // Restore the current text if we already have it from store
      if (!currentText && greeting) setCurrentText(greeting);
      return;
    }
    try {
      startedInterviewIds.add(interviewId);
      setStarted(true);
      const res = await dispatch(startInterviewChat({ interviewId, candidate, token })).unwrap();
      setCurrentText(res?.greeting ?? greeting);
    } catch (err) {
      console.error("Fail to start interview:", err);
      setStarted(false);
      startedInterviewIds.delete(interviewId);
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
    startRecording();
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
      if (Date.now() - lastTranscriptTime > 8000 && listening) {
        console.log("🛑 Detected silence, stopping mic...");
        stopRecording();
        clearInterval(silenceTimer);
      }
    }, 1000);

    return () => clearInterval(silenceTimer);
  }, [listening, lastTranscriptTime, greetingDone, examEnded]);

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

    console.log("🎯 Sending payload:", payload);

    try {
      const res = await dispatch(sendChatResponse(payload)).unwrap();
      setConversationLoading(false);

      // 🟢 Proper condition fix
      if (res.intent === "exit" || res.intent === "leave") {
        resetTranscript(); // Clear transcript before showing exit message
        setCurrentText(res.response);
        await handleAutoExamEnd();
      } else if (res?.next_question) {
        resetTranscript(); // Clear transcript before showing next question
        setCurrentText(res.next_question);
      }
    } catch (err) {
      console.error("Error sending answer:", err);
      setConversationLoading(false);
    }
  };

  // 🟢 Step 7: Save and redirect automatically
  const handleAutoExamEnd = async (endMessage?: string) => {
    if (examEnded) return;
    if (examTimerRef.current) {
      clearTimeout(examTimerRef.current);
      examTimerRef.current = null;
    }
    if (endMessage) setCurrentText(endMessage);
    setExamEnded(true);
    stopRecording();
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

  // Auto-start the interview once the page is ready
  useEffect(() => {
    if (autoStartRef.current) return;
    if (!interviewId || !candidate || !token) return;

    autoStartRef.current = true;
    handleStartInterview();
  }, [interviewId, candidate, token]);

  // End the exam when the allotted duration expires
  useEffect(() => {
    if (examEnded) return;
    const durationMinutes = Number(interviewDuration);
    if (!durationMinutes || Number.isNaN(durationMinutes) || durationMinutes <= 0) return;

    if (examTimerRef.current) clearTimeout(examTimerRef.current);

    const durationMs = durationMinutes * 60 * 1000;
    examTimerRef.current = setTimeout(() => {
      handleAutoExamEnd("Time is up. Ending the interview now.");
    }, durationMs);

    return () => {
      if (examTimerRef.current) {
        clearTimeout(examTimerRef.current);
        examTimerRef.current = null;
      }
    };
  }, [interviewDuration, examEnded]);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="flex text-2xl font-bold gap-4 justify-center mb-6"><span><RiRobot3Fill size={28} color="orange" /></span> AI Voice Interview</h1>

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
              className={`flex flex-col w-full px-4 py-4 transition-all duration-300 ${showTranscript ? "opacity-100" : "opacity-0"
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
                className={`flex gap-4 text-sm font-medium ${listening ? "text-green-600" : "text-gray-500"
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
            onComplete={() => { }}
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
