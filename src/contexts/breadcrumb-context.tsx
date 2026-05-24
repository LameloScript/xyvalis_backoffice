"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbContextType {
  customLabels: Record<string, string>;
  setCustomLabel: (key: string, label: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});

  const setCustomLabel = (key: string, label: string) => {
    setCustomLabels((prev) => {
      if (prev[key] === label) return prev;
      return { ...prev, [key]: label };
    });
  };

  return (
    <BreadcrumbContext.Provider value={{ customLabels, setCustomLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    return {
      customLabels: {},
      setCustomLabel: () => {}
    };
  }
  return context;
}
