"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
});

interface LoadingContextProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingContextProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const value = {
    loading,
    setLoading,
  };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [loading]);

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context)
    throw new Error("useLoading must be used within LoadingProvider");
  return context;
}
