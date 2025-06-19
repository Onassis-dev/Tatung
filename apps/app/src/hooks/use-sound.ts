import { useEffect, useRef } from "react";

export function useSounds() {
  const soundsRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    soundsRef.current = {
      error: new Audio("/sounds/error.mp3"),
      warn: new Audio("/sounds/warn.mp3"),
      success: new Audio("/sounds/success.mp3"),
      correct: new Audio("/sounds/correct.mp3"),
    };
  }, []);

  const play = (type: "error" | "warn" | "success" | "correct") => {
    const sound = soundsRef.current[type];
    sound?.play().catch(() => {
      console.warn(`Sonido bloqueado: ${type}`);
    });
  };

  return {
    playError: () => play("error"),
    playWarn: () => play("warn"),
    playSuccess: () => play("success"),
    playCorrect: () => play("correct"),
  };
}
