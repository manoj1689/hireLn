import React, { useEffect, useState } from "react";

export const ShowTimer = ({ duration }: { duration: number }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <p>
      <span className="font-semibold">{minutes}m {seconds < 10 ? `0${seconds}` : seconds}s</span>
    </p>
  );
};
