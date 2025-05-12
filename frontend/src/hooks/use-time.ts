import { useState, useEffect } from "react";
import { formatTime } from "../lib/utils";

export function useTime() {
  const [time, setTime] = useState<string>(formatTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
}
