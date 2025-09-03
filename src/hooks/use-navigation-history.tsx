"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavigationHistory {
  path: string;
  timestamp: number;
}

export function useNavigationHistory() {
  const [history, setHistory] = useState<NavigationHistory[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only track dashboard routes
    if (pathname.startsWith('/dashboard')) {
      setHistory((prev) => {
        const newEntry: NavigationHistory = {
          path: pathname,
          timestamp: Date.now(),
        };

        // Avoid adding the same path consecutively
        if (prev.length === 0 || prev[prev.length - 1].path !== pathname) {
          // Keep only the last 10 entries to avoid memory issues
          const updatedHistory = [...prev, newEntry].slice(-10);
          return updatedHistory;
        }
        return prev;
      });
    }
  }, [pathname]);

  const goBack = () => {
    if (history.length > 1) {
      // Get the previous page (second to last entry)
      const previousPage = history[history.length - 2];
      
      // Remove the current page from history to avoid loops
      setHistory((prev) => prev.slice(0, -1));
      
      // Navigate to the previous page
      router.push(previousPage.path);
    } else {
      // Fallback to dashboard if no history
      router.push('/dashboard');
    }
  };

  const canGoBack = history.length > 1;
  
  const getCurrentPage = () => {
    return history.length > 0 ? history[history.length - 1] : null;
  };

  const getPreviousPage = () => {
    return history.length > 1 ? history[history.length - 2] : null;
  };

  return {
    history,
    goBack,
    canGoBack,
    getCurrentPage,
    getPreviousPage,
  };
}
