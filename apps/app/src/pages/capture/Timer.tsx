import { useEffect, useState, useRef } from "react";

interface Props {
  isActive: boolean;
  setAskSupervisor: () => void;
}

export default function Timer({ isActive, setAskSupervisor }: Props) {
  const [time, setTime] = useState(10);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Start the timer
      const startTimer = () => {
        timeoutRef.current = setTimeout(() => {
          setTime((prevTime) => {
            console.log("Current time:", prevTime);
            if (prevTime > 1) {
              startTimer(); // Schedule next tick
              return prevTime - 1;
            } else {
              // Timer finished
              setAskSupervisor();
              return 10; // Reset to 10
            }
          });
        }, 1000);
      };

      startTimer();
    } else {
      // Clear timeout when timer is stopped
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setTime(10);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, setAskSupervisor]);

  // useEffect(() => {
  //   console.log(time);
  // }, [time]);

  return (
    isActive && (
      <div className="text-2xl font-bold fixed top-6 left-6">{time}</div>
    )
  );
}
