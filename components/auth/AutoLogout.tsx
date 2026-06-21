"use client";

import { useEffect, useCallback, useRef } from "react";
import { logout } from "@/app/actions/auth";

export default function AutoLogout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 30 minutes timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await logout();
      } finally {
        window.location.href = "/";
      }
    }, 30 * 60 * 1000);
  }, []);

  useEffect(() => {
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    const reset = () => resetTimeout();

    events.forEach((event) => {
      window.addEventListener(event, reset);
    });

    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, reset);
      });
    };
  }, [resetTimeout]);

  return null;
}
