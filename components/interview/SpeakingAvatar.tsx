"use client";

import React, { useEffect, useState } from "react";

const SpeakingAvatar = ({
  text,
  imgSrc,
  candidateName,
}: {
  text: string;
  imgSrc: string;
  candidateName: string;
}) => {
  const [pulseKey, setPulseKey] = useState(0);
  const [showRings, setShowRings] = useState(false);

  const words = text.trim().split(/\s+/);
  const lastWords = words.slice(-5);
  const lastWordCount = lastWords.length;

  const pulseScale = lastWordCount <= 2 ? 1.2 : lastWordCount <= 4 ? 1.5 : 2;
  const ringCount = 6;

  useEffect(() => {
    if (text?.trim()) {
      setPulseKey((prev) => prev + 1);
      setShowRings(true);

      const estimatedDuration = lastWordCount * 400;
      const timeout = setTimeout(() => {
        setShowRings(false);
      }, estimatedDuration + 500);

      return () => clearTimeout(timeout);
    }
  }, [text]);

  // 🔠 Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) || "";
    const last = parts[parts.length - 1]?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  const initials = getInitials(candidateName || "");

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Pulse Rings */}
      {showRings &&
        Array.from({ length: ringCount }).map((_, index) => (
          <div
            key={`${pulseKey}-${index}`}
            className="absolute w-[120px] h-[120px] border-4 rounded-full border-cyan-400 opacity-30 animate-pulse-ring"
            style={
              {
                animationDelay: `${index * 0.1}s`,
                "--pulse-scale": pulseScale,
              } as React.CSSProperties
            }
          />
        ))}

      {/* Initials Circle */}
      <div className="w-28 h-28 rounded-full bg-cyan-500 text-white flex border-4 border-white items-center shadow-lg justify-center text-2xl font-bold">
        {initials}
      </div>
    </div>
  );
};

export default SpeakingAvatar;

