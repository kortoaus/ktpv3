"use client";
import React, { useEffect, useState } from "react";

export default function useAutoReload() {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        window.location.reload();
      }, 1000 * 60 * 5); // 30000 milliseconds = 30 seconds
      setTimeoutId(newTimeoutId);
    };

    const clearTimer = (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    // Event listeners to track user activity
    if (window) {
      if (timeoutId === null) {
        resetTimer();
      }
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
    }

    return () => {
      // Cleanup: remove event listeners and clear timeout
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      clearTimer();
    };
  }, [timeoutId]);
  return timeoutId;
}
