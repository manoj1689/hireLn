"use client";

import React, { useState, useEffect, useRef } from "react";
import Speech from "speak-tts";
import { PiSpeakerHighFill } from "react-icons/pi";
const speech = new Speech();

// ✅ Initialize TTS once
if (speech.hasBrowserSupport()) {
  speech
    .init({
      volume: 1,
      lang: "en-GB",
      rate: 1,
      pitch: 1,
      voice: "Google UK English Male",
      splitSentences: false,
    })
    .then(() => console.log("✅ TTS initialized"))
    .catch((err: unknown) => console.error("❌ TTS init error:", err));
}

// ✅ Props interface
interface TextSpeakerProps {
  text: string;
  trigger: boolean;
  onComplete?: () => void;
}

const TextSpeaker: React.FC<TextSpeakerProps> = ({ text, trigger, onComplete }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const hasSpokenRef = useRef<boolean>(false); // prevent double speak

  const cleanText = (input: string): string => {
    if (!input) return "";
    return input
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/^"|"$/g, "")
      .trim();
  };

  const speakAndType = async (inputText: string): Promise<void> => {
    if (!inputText || !speech.hasBrowserSupport()) return;

    const sentenceRegex = /[^.!?]+[.!?]?/g;
    const sentences = inputText.match(sentenceRegex) || [];
    setDisplayedText("");
    setIsSpeaking(true);

    let cumulativeText = "";

    for (let sentence of sentences) {
      sentence = sentence.trim();
      if (!sentence) continue;

      // Speak the sentence
      speech.speak({
        text: sentence,
        queue: true,
        listeners: {
          onstart: () => console.log("▶️ Speaking sentence:", sentence),
          onend: () => console.log("✅ Finished sentence:", sentence),
        },
      });

      // Type sentence character by character while speaking
      for (const char of sentence) {
        cumulativeText += char;
        setDisplayedText(cumulativeText);
        await new Promise((res) => setTimeout(res, 80)); // adjust typing speed
      }

      // Small pause after each sentence
      await new Promise((res) => setTimeout(res, 400));
    }

    setIsSpeaking(false);
    hasSpokenRef.current = false;
    if (onComplete) onComplete(); // notify parent to move next
  };

  useEffect(() => {
    if (trigger && text && !hasSpokenRef.current) {
      hasSpokenRef.current = true;
      speakAndType(cleanText(text));
    }
  }, [trigger, text]);

  return (
    <div className="p-4">
      <p className="text-2xl text-stone-700 leading-relaxed">{displayedText}</p>
      {isSpeaking && (
        <p className="flex gap-4 text-sm justify-center text-blue-500 mt-2 animate-pulse"><span><PiSpeakerHighFill size={20} /> </span> Speaking...</p>
      )}
    </div>
  );
};

export default TextSpeaker;
