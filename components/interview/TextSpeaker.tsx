"use client";

import React, { useState, useEffect, useRef } from "react";
import { PiSpeakerHighFill } from "react-icons/pi";

interface TextSpeakerProps {
  text: string;
  trigger: boolean;
  onComplete?: () => void;
}

const TextSpeaker: React.FC<TextSpeakerProps> = ({ text, trigger, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hasPlayedRef = useRef(false);

  const cleanText = (input: string) => {
    if (!input) return "";
    return input
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/^"|"$/g, "")
      .trim();
  };

  const playAudio = async (audioBuffer: ArrayBuffer) => {
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const audio = new Audio(URL.createObjectURL(blob));
    await audio.play();
    return new Promise((resolve) => audio.onended = resolve);
  };

  const speakAndType = async (inputText: string) => {
    if (!inputText) return;

    setIsSpeaking(true);
    setDisplayedText("");

    // Start typing with a small delay to sync with audio
    const typeText = async () => {
      // Wait for audio to start playing
      await new Promise((r) => setTimeout(r, 200));

      let typed = "";
      for (const char of inputText) {
        typed += char;
        setDisplayedText(typed);
        await new Promise((r) => setTimeout(r, 80));
      }
    };

    // Start audio fetching and playback in parallel with typing
    const playAudioAsync = async () => {
      const res = await fetch("/api/tts", {
        method: "POST",
        body: JSON.stringify({ text: inputText }),
        headers: { "Content-Type": "application/json" },
      });
      const audioBuffer = await res.arrayBuffer();
      await playAudio(audioBuffer);
    };

    // Run both in parallel
    await Promise.all([typeText(), playAudioAsync()]);

    setIsSpeaking(false);
    hasPlayedRef.current = false;

    onComplete?.();
  };

  useEffect(() => {
    if (trigger && text && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      speakAndType(cleanText(text));
    }
  }, [trigger, text]);

  return (
    <div className="p-4">
      <p className="text-2xl text-stone-700 leading-relaxed">
        {displayedText}
      </p>

      {isSpeaking && (
        <p className="flex gap-4 text-sm justify-center text-blue-500 mt-2 animate-pulse">
          <PiSpeakerHighFill size={20} /> Speaking...
        </p>
      )}
    </div>
  );
};

export default TextSpeaker;