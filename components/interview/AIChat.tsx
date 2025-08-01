import React, { useState, useRef, useEffect, ReactNode } from "react";
import bowser from "bowser";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import {
  getChatbotResponse,
  explainChatbotResponse
} from "../../services/OpenaiService";


import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
//@ts-ignore
import WaveEffect from "./WaveEffect";
import Speech from "speak-tts";
import { IoMdMic } from "react-icons/io";
import { HiSpeakerWave } from "react-icons/hi2";
//Avatar images
import FemaleAvatar from "../../public/images/Avatar/femaleAi.jpeg";
import AiFemaleAssistant from "../../public/images/Avatar/AiFemaleAssistant.webp";
import FemaleUsAvatar from "../../public/images/Avatar/femaleUsAi.jpeg";
import MaleUsAvatar from "../../public/images/Avatar/MaleUsAi.jpeg";
import { InterviewQuestion } from "@/interface/questions";
import { submitInterviewAnswer } from "@/lib/slices/questions/submit-answer-slice";
import { autoEvaluateAnswer, reset } from "@/lib/slices/questions/auto-evaluate-answer-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { MdToken } from "react-icons/md";
import { DNA } from "react-loader-spinner";

interface AIChatProps {
  interviewId: string,
  questionList: InterviewQuestion[];
  token: string
  examID: string;
  handleExamEnd: () => void;

  onTranscriptChange: (transcript: string) => void;
  selectedAvatar: string;
}

type MessageRole = "system" | "user" | "assistant";

interface Message {
  time: ReactNode;
  role: MessageRole;
  content: string;
}
const avatars = [
  {
    name: "Ava",
    src: FemaleAvatar,
    voice: {
      chrome: "Google UK English Female",
      safari: "com.apple.speech.synthesis.voice.daniel", // English (UK)
      edge: "Microsoft Libby Online (Natural) - English (United Kingdom)", // Edge (US English Female)
    },
  },
  {
    name: "Jack",
    src: MaleUsAvatar,
    voice: {
      chrome: "Google UK English Male",
      safari: "com.apple.speech.synthesis.voice.daniel", // English (UK)
      edge: "Microsoft Ryan Online (Natural) - English (United Kingdom)", // Edge (US English Male)
    },
  },
  {
    name: "Luna",
    src: FemaleUsAvatar,
    voice: {
      chrome: "Google US English",
      safari: "com.apple.speech.synthesis.voice.siri", // English (US)
      edge: "Microsoft Sonia Online (Natural) - English (United Kingdom)", // Edge (US English Female)
    },
  },
  {
    name: "Zara",
    src: AiFemaleAssistant,
    voice: {
      chrome: "Google Deutsch",
      safari: "com.apple.speech.synthesis.voice.jorge", // Spanish (Spain)
      edge: "Microsoft Jenny Online (Natural) - English (United States)", //Microsoft Eric Online (Natural) - English (United States)
    },
  },
];


const AIChat: React.FC<AIChatProps> = ({
  interviewId,
  questionList,
  handleExamEnd,
  token,
  onTranscriptChange,

}) => {

  const dispatch = useDispatch<AppDispatch>()
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [audioTranscript, setAudioTranscript] = useState("");
  const [transcriptAi, setTranscriptAi] = useState("");
  const [loading, setLoading] = useState(false);
  const [intro, setIntro] = useState(false);
  const currentQuestionIndexRef = useRef(0);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [listeningEnabled, setListeningEnabled] = useState(true);

  const [selectedAvatarlogo, setSelectedAvatarlogo] = useState<any>(FemaleAvatar);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [noResponse, setNoResponse] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [speechData, setSpeechData] = useState<any>(null);

  const [whichBrowser, setWhichBrowser] = useState("");
  const [enableChrome, setEnableChrome] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex justify-center items-center ">
        <div className="text-lg">
          Browser doesn't support speech recognition.
        </div>{" "}
      </div>
    );
  }
  //  console.log("recorded blob direct",recordingBlob)
  const continueListening = () => {
    if (listeningEnabled) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
    }
  };

  const questionId = questionList[currentQuestionIndexRef.current]?.id;

  //console.log("question List",questionId)
  const browser = bowser.getParser(window.navigator.userAgent);
  const browserName = browser.getBrowserName();

  //  // Initialize Speech
  const speech = new Speech();

  //console.log("whichbrowser", whichBrowser);
  useEffect(() => {
    setWhichBrowser(browserName);
    // Initialize Speech with configuration
    const avatar = avatars.find((av) => av.name === "Ava"); // Find the selected avatar
    setSelectedAvatarlogo(avatar?.src);
    if (!avatar) {
      console.error("Selected avatar not found");
      return;
    }

    let selectedVoice = avatar.voice.chrome; // Default to Chrome voice

    if (browserName === "Safari") {
      selectedVoice = avatar.voice.safari;
    } else if (browserName === "Microsoft Edge") {
      selectedVoice = avatar.voice.edge;
    }

    speech
      .init({
        volume: 1,
        lang: "en-In",
        rate: 1,
        pitch: 1,
        voice: selectedVoice,
        splitSentences: true,
      })
      .then((data) => {
        console.log("Speech is ready, voices available:", data.voices);
        setSpeechData(speech);
      })
      .catch((e) => {
        console.error("An error occurred while initializing speech:", e || "Speech initialization failed")
        // Continue without speech functionality
        setSpeechData(null)
      })
  }, [browserName]); // Add selectedAvatar and browserName to the dependency array

  useEffect(() => {
    if (!speechData) return;

    const initialMessage: Message = {
      role: "assistant",
      content:
        "Welcome to HireLane. Introduce yourself, and then provide an overview of your professional journey and expertise.",
      time: getCurrentTime()
    };

    setChatHistory((prev) => [...prev, initialMessage]);
    speakText(initialMessage.content, continueListening);
  }, [speechData]);

  useEffect(() => {
    const transcriptData = transcript;
    onTranscriptChange(transcriptData);
  }, [transcript, onTranscriptChange]);



  useEffect(() => {
    if (listening) {
      // Clear any existing timeouts when starting listening
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (transcript.trim()) {
        console.log("Transcript detected. Starting 3-second timer.");
        setNoResponse(true);

        timeoutRef.current = setTimeout(() => {
          SpeechRecognition.stopListening();
          setAudioTranscript(transcript.trim()); // ✅ Trigger OpenAI intent handler

        }, 3000);
      } else {
        if (noResponse) {
          console.log("No transcript detected. Starting 20-second timer.");

          timeoutRef.current = setTimeout(() => {
            SpeechRecognition.stopListening();
            setAudioTranscript("This is an automated response, I'm not available to chat.");
            setNoResponse(false);
          }, 20000);
        } else {
          console.log("No transcript detected. Starting 10-second timer.");

          timeoutRef.current = setTimeout(() => {
            SpeechRecognition.stopListening();
            const userNotAvailableMessage: Message = {
              role: "assistant",
              content: "Thank you for participating. It appears you are not available during the exam. Your score will be updated shortly. For further assistance, please contact us.",
              time: getCurrentTime()
            };
            setChatHistory(prev => [...prev, userNotAvailableMessage]);
            ExamEndMessage(userNotAvailableMessage.content, continueListening);
            resetTranscript();
            setAudioTranscript("");
          }, 10000);
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [listening, transcript, noResponse]);

  const ExamEndMessage = (text: string, continueListening: () => void) => {
    console.log("exam end msg");

    speechData
      .speak({
        text: text,
        queue: false, // Ensures that previous speech is canceled before new text is spoken
        listeners: {
          onstart: () => {
            console.log("Speech started for ending exam");

          },
          onend: () => {
            console.log("Speech ended, now you can stop exam.");
          },
        },
      })
      .then(() => {
        console.log("Text spoken successfully for end Exam");

        handleExamEnd();


        resetTranscript();
        setTranscriptAi("");
        setAudioTranscript("");
      })
      .catch((e: any) => {
        console.error("An error occurred while speaking text:", e);
      });
  };
  const handleExamLeave = () => {
    // Stop all listening and recording processes
    SpeechRecognition.stopListening();

    // Reset transcript and audio data
    resetTranscript();
    setAudioTranscript("");
    const examCompleteMessage: Message = {
      role: "assistant",
      content: "Thank you for participating. We will connect you shortly.",
      time: getCurrentTime()
    };
    setChatHistory(prev => [...prev, examCompleteMessage]);
    ExamEndMessage(examCompleteMessage.content, continueListening);
    setTimeout(() => {

      handleExamEnd(); // Call the function to handle exam end
    }, 2000); // 5 seconds
  };


  const speakText = (text: string, continueListening: () => void) => {

    SpeechRecognition.stopListening();

    if (!speechData) {
      console.error("SpeechData is not initialized yet.");
      return;
    }
    speechData
      .speak({
        text: text,
        queue: false, // Ensures that previous speech is canceled before new text is spoken
        listeners: {
          onstart: () => {
            console.log("Speech started");
            setTranscriptAi(text);
          },
          onend: () => {
            console.log("Speech ended, now you can start listening again.");
          },
          onerror: (e: any) => {
            console.error("An error occurred during speech:", e);
          },
        },
      })
      .then(() => {
        console.log("Text spoken successfully");
        continueListening();
        setEnableChrome(true);


      })
      .catch((e: any) => {
        console.error("An error occurred while speaking text:", e);
      });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmitAnswer = async (
    interviewId: string,
    answerText: string,
    token: string,
    questionId: string
  ) => {
    setLoading(true);
    try {
      // First: submit answer
      const response = await dispatch(
        submitInterviewAnswer({ interviewId, questionId, token, answerText })
      ).unwrap();

      const submittedAnswerId = response.id; // Must be returned in the response

      console.log("Answer submitted:", submittedAnswerId);

      // Then: auto-evaluate the submitted answer
      await dispatch(autoEvaluateAnswer({ answerId: submittedAnswerId, token }));

    } catch (error) {
      console.error("Submit or Evaluation failed:", error);
    } finally {
      setLoading(false);
    }
  };


  console.log("audio transcript ", audioTranscript)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);


  useEffect(() => {
    const testIntentDetermination = async () => {
      if (!audioTranscript || audioTranscript.trim() === "") return;

      // Save user's message to chat history
      setChatHistory(prev => [...prev, { role: "user", content: audioTranscript, time: getCurrentTime(), }]);
      setLoading(true);

      try {
        const intent = await getChatbotResponse([{ role: "user", content: audioTranscript }]);
        console.log(`Intent for message "${audioTranscript}": ${intent}`);
        setLoading(false);

        let assistantMessage: Message | null = null;

        switch (intent) {
          case "Introduce":
            assistantMessage = {
              role: "assistant",
              content: "Hey, nice to meet you! We've assembled a set of questions to understand your strengths better. Would you like to continue or proceed?",
              time: getCurrentTime()

            };
            break;


          case "Repeat":
            if (
              currentQuestionIndexRef.current >= 0 &&
              currentQuestionIndexRef.current < questionList.length
            ) {
              assistantMessage = {
                role: "assistant",
                content: questionList[currentQuestionIndexRef.current].questionText,
                time: getCurrentTime(),
              };
            } else {
              assistantMessage = {
                role: "assistant",
                content: "No previous message to repeat.",
                time: getCurrentTime(),
              };
            }
            break;

          case "Continue":
            if (!intro) {
              setIntro(true);
              currentQuestionIndexRef.current = 0;
              setQuestionNumber(1);

              assistantMessage = {
                role: "assistant",
                content: questionList[0].questionText,
                time: getCurrentTime(),
              };
            } else {
              await handleSubmitAnswer(interviewId, audioTranscript, token, questionId);

              const nextIndex = currentQuestionIndexRef.current + 1;
              if (nextIndex < questionList.length) {
                currentQuestionIndexRef.current = nextIndex;
                setQuestionNumber(nextIndex + 1);

                assistantMessage = {
                  role: "assistant",
                  content: questionList[nextIndex].questionText,
                  time: getCurrentTime(),
                };
              } else {
                handleExamLeave();
                return;
              }
            }
            break;

          case "Move to a new question":
            await handleSubmitAnswer(interviewId, "NOT ANSWERED", token, questionId);
            const moveNextIndex = currentQuestionIndexRef.current + 1;

            if (moveNextIndex < questionList.length) {
              currentQuestionIndexRef.current = moveNextIndex;
              setQuestionNumber(moveNextIndex + 1);

              assistantMessage = {
                role: "assistant",
                content: questionList[moveNextIndex].questionText,
                time: getCurrentTime(),
              };
            } else {
              handleExamLeave();
              return;
            }
            break;

          case "Unclear":
            assistantMessage = {
              role: "assistant",
              content:
                "It seems I didn't quite catch that. Would you like to ask a different question or would you prefer to end the exam?",
              time: getCurrentTime(),
            };
            break;

          case "User Not Available":
            assistantMessage = {
              role: "assistant",
              content:
                "It looks like you're not available at the moment. Please tell me whether you’d like to repeat the current question, move on to the next one, or leave the exam.",
              time: getCurrentTime(),
            };
            break;

          case "Explain":
          case "Clarify Question":
            if (chatHistory.length > 0) {
              const lastAssistant = [...chatHistory]
                .reverse()
                .find((m) => m.role === "assistant");
              if (lastAssistant) {
                const explanation = await explainChatbotResponse([
                  {
                    role: "system",
                    content: `Could you rephrase this in a simpler way to make it easier to understand: "${lastAssistant.content}"?`,
                  },
                ]);
                assistantMessage = { role: "assistant", content: explanation ?? "Sorry, I couldn't simplify that.", time: getCurrentTime(), };
              } else {
                assistantMessage = { role: "assistant", content: "Nothing to explain.", time: getCurrentTime(), };
              }
            }
            break;

          case "Leave":
            for (let i = currentQuestionIndexRef.current; i < questionList.length; i++) {
              await handleSubmitAnswer(interviewId, "NOT ANSWERED", token, questionList[i].id);
            }
            handleExamLeave();
            return;

          default:
            console.error("Unknown intent:", intent);
            return;
        }

        if (assistantMessage) {
          // ✅ Add assistant message to chat and speak
          setChatHistory(prev => [...prev, assistantMessage]);
          speakText(assistantMessage.content, continueListening);
          resetTranscript();
          setAudioTranscript("");
        }
      } catch (error) {
        console.error("Error determining intent:", error);
        setLoading(false);
      }
    };

    testIntentDetermination();
  }, [audioTranscript]);



  return (

    <div className="p-2 h-full flex flex-col rounded-md">
      {/* Chat Container with Scroll */}
      <div className="flex flex-col h-[60vh] overflow-y-auto p-2 sm:p-4 space-y-4 scroll-smooth">
        {chatHistory.map((message, index) => {
          const isUser = message.role === "user";
          const bubbleColor = isUser ? "bg-white" : "bg-red-400";
          const textColor = isUser ? "text-gray-800" : "text-white";
          const timeColor = "text-red-700";
          const alignment = isUser ? "justify-end" : "justify-start";
          const roundedClass = isUser
            ? "rounded-2xl rounded-br-none"
            : "rounded-2xl rounded-bl-none";
          const avatarSrc = isUser
            ? "/images/Avatar/maleFormal.png"
            : "./images/Avatar/AiAgent.jpeg";
          const prefix = isUser ? "A." : "Q.";

          return (
            <div
              key={index}
              className={`flex w-full gap-2 items-end ${alignment}`}
            >
              {/* Left Avatar (Assistant) */}
              {!isUser && (
                <img
                  src={avatarSrc}
                  className="w-10 h-10 border-2 border-white rounded-full"
                  alt="AI Avatar"
                />
              )}

              {/* Message Bubble */}
              <div className={`max-w-[75%] px-4 py-3 shadow ${bubbleColor} ${roundedClass}`}>
                <div className={`text-sm sm:text-sm whitespace-pre-wrap font-normal ${textColor}`}>
                  <span className="font-semibold mr-1">{prefix}</span>
                  {message.content}
                </div>
                <div className={`text-xs text-right mt-1 ${timeColor}`}>
                  {message.time}
                </div>
              </div>

              {/* Right Avatar (User) */}
              {isUser && (
                <img
                  src={avatarSrc}
                  className="w-10 h-10 rounded-full"
                  alt="User Avatar"
                />
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex w-full items-center gap-1 self-end p-2 my-2 rounded-md bg-transparent">
            <span
              className="w-3 h-3 rounded-full  animate-pulse-color"
              style={{ animationDelay: "0s, 0s" }}
            ></span>
            <span
              className="w-3 h-3 rounded-full animate-pulse-color"
              style={{ animationDelay: "0.2s, 0.2s" }}
            ></span>
            <span
              className="w-3 h-3 rounded-full animate-pulse-color"
              style={{ animationDelay: "0.4s, 0.4s" }}
            ></span>

          </div>


        )}

        {/* Scroll to bottom reference */}
        <div ref={messagesEndRef}></div>
      </div>

    </div>

  );
};

export default AIChat;
