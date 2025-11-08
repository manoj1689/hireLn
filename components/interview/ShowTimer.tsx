import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export const ShowTimer = ({ duration }: { duration: number }) => {
  // Convert minutes → seconds
  const totalSeconds = duration * 60;

  // Formatter for MM:SS
  const formatTime = (remainingTime: number) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <CountdownCircleTimer
        isPlaying
        duration={totalSeconds}
        size={120}
        strokeWidth={8}
        trailColor="#E5E7EB"
        colors={["#22c55e", "#eab308", "#ef4444", "#b91c1c"]}
        colorsTime={[totalSeconds, totalSeconds * 0.5, totalSeconds * 0.25, 0]}
      >
        {({ remainingTime }) => (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-sky-500">
              {formatTime(remainingTime)}
            </span>
            <span className="text-xs text-gray-500">Time Left</span>
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};
