"use client";

import React, { useEffect, useState } from "react";

const SpeakingAvatar = ({ text, imgSrc }: { text: string; imgSrc: string }) => {
  const [pulseKey, setPulseKey] = useState(0);
  const [showRings, setShowRings] = useState(false);

  // Get last 5 words
  const words = text.trim().split(/\s+/);
  const lastWords = words.slice(-5);
  const lastWordCount = lastWords.length;

  //console.log("Last words:", lastWords.join(" "));
  //console.log("Last word count:", lastWordCount);

  // Adjust pulse size based on last word count
  const pulseScale = lastWordCount <= 2 ? 1.2 : lastWordCount <= 4 ? 1.5 : 2;
  const ringCount = 6;

  useEffect(() => {
    if (text?.trim()) {
      setPulseKey((prev) => prev + 1);
      setShowRings(true);

      // Estimate duration: 400ms per word
      const estimatedDuration = lastWordCount * 400;

      const timeout = setTimeout(() => {
        setShowRings(false);
      }, estimatedDuration + 500);

      return () => clearTimeout(timeout);
    }
  }, [text]);

  return (
    <div className="relative flex flex-col items-center justify-center ">
      {/* Pulse Rings */}
      {showRings &&
        Array.from({ length: ringCount }).map((_, index) => (
          <div
            key={`${pulseKey}-${index}`}
            className="absolute w-[80px] h-[80px] border-4 rounded-full border-cyan-400 opacity-30 animate-pulse-ring"
            style={
              {
                animationDelay: `${index * 0.1}s`,
                "--pulse-scale": pulseScale,
              } as React.CSSProperties
            }
          />
          
        ))}
      <img src="./images/Avatar/femaleUsAi.jpeg" className="w-20 rounded-full"/>
    </div>
  );
};

export default SpeakingAvatar;


