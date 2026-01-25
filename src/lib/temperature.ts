import { TemperatureUnit } from "@/types";

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

/**
 * Convert a deviation value from Celsius to Fahrenheit
 * (no +32 since it's a relative delta)
 */
export function deviationToFahrenheit(celsiusDelta: number): number {
  return celsiusDelta * (9 / 5);
}

/**
 * Format a temperature value with the appropriate unit symbol
 */
export function formatTemperature(
  celsius: number,
  unit: TemperatureUnit
): string {
  if (unit === "fahrenheit") {
    return `${celsiusToFahrenheit(celsius).toFixed(1)}°F`;
  }
  return `${celsius.toFixed(1)}°C`;
}

/**
 * Format a deviation value with sign and unit symbol
 */
export function formatDeviation(
  celsiusDelta: number,
  unit: TemperatureUnit
): string {
  const sign = celsiusDelta > 0 ? "+" : "";
  if (unit === "fahrenheit") {
    return `${sign}${deviationToFahrenheit(celsiusDelta).toFixed(1)}°F`;
  }
  return `${sign}${celsiusDelta.toFixed(1)}°C`;
}

// Locales that use Fahrenheit
const FAHRENHEIT_LOCALES = ["en-US", "en-LR", "en-MM", "en-PR", "en-GU", "en-VI"];

/**
 * Detect default unit based on user locale
 */
export function getDefaultUnit(): TemperatureUnit {
  if (typeof navigator !== "undefined") {
    const language = navigator.language.toLowerCase();
    // Check if any Fahrenheit locale matches (case-insensitive)
    if (FAHRENHEIT_LOCALES.some((locale) => language === locale.toLowerCase())) {
      return "fahrenheit";
    }
  }
  return "celsius";
}

/**
 * Safely get value from localStorage
 */
export function getStoredUnit(key: string): TemperatureUnit | null {
  try {
    const stored = localStorage.getItem(key);
    if (stored === "celsius" || stored === "fahrenheit") {
      return stored;
    }
  } catch {
    // localStorage not available (private browsing, etc.)
  }
  return null;
}

/**
 * Safely set value in localStorage
 */
export function setStoredUnit(key: string, unit: TemperatureUnit): void {
  try {
    localStorage.setItem(key, unit);
  } catch {
    // localStorage not available (private browsing, etc.)
  }
}
