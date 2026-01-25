"use client";

import { useTemperatureUnit } from "@/context/TemperatureUnitContext";

interface HeaderProps {
  lastUpdated: Date;
}

export function Header({ lastUpdated }: HeaderProps) {
  const { unit, toggleUnit } = useTemperatureUnit();
  const isCelsius = unit === "celsius";

  const formattedTime = lastUpdated.toLocaleString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header role="banner" className="mb-8 text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Wezer
        </h1>
        <button
          onClick={toggleUnit}
          role="switch"
          aria-checked={!isCelsius}
          aria-label={`Temperature unit: ${isCelsius ? "Celsius" : "Fahrenheit"}. Switch to ${isCelsius ? "Fahrenheit" : "Celsius"}`}
          className="flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          <span
            className={`px-2 py-0.5 rounded-full transition-colors ${
              isCelsius
                ? "bg-blue-500 text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            °C
          </span>
          <span
            className={`px-2 py-0.5 rounded-full transition-colors ${
              !isCelsius
                ? "bg-blue-500 text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            °F
          </span>
        </button>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        Global Weather Anomalies
      </p>
      <p
        className="text-sm text-gray-500 dark:text-gray-400"
        aria-label={`Data last updated at ${formattedTime} UTC`}
      >
        Last updated: {formattedTime} UTC
      </p>
    </header>
  );
}
