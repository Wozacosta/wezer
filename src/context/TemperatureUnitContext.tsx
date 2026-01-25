"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TemperatureUnit } from "@/types";
import {
  getDefaultUnit,
  getStoredUnit,
  setStoredUnit,
} from "@/lib/temperature";

// Re-export utilities for convenience
export {
  celsiusToFahrenheit,
  deviationToFahrenheit,
  formatTemperature,
  formatDeviation,
  getDefaultUnit,
} from "@/lib/temperature";

const STORAGE_KEY = "temperature-unit";

interface TemperatureUnitContextValue {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  isInitialized: boolean;
}

const TemperatureUnitContext = createContext<
  TemperatureUnitContextValue | undefined
>(undefined);

interface TemperatureUnitProviderProps {
  children: ReactNode;
}

export function TemperatureUnitProvider({
  children,
}: TemperatureUnitProviderProps) {
  const [unit, setUnit] = useState<TemperatureUnit>("celsius");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage or locale detection
  useEffect(() => {
    const stored = getStoredUnit(STORAGE_KEY);
    if (stored) {
      setUnit(stored);
    } else {
      setUnit(getDefaultUnit());
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      setStoredUnit(STORAGE_KEY, unit);
    }
  }, [unit, isInitialized]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"));
  };

  // Suppress hydration mismatch by not rendering until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <TemperatureUnitContext.Provider
      value={{ unit, toggleUnit, isInitialized }}
    >
      {children}
    </TemperatureUnitContext.Provider>
  );
}

export function useTemperatureUnit(): TemperatureUnitContextValue {
  const context = useContext(TemperatureUnitContext);
  if (context === undefined) {
    throw new Error(
      "useTemperatureUnit must be used within a TemperatureUnitProvider",
    );
  }
  return context;
}
