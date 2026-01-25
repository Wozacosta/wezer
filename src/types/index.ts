// Core domain types

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  temperature: number; // Celsius
  timestamp: Date;
}

export interface Anomaly {
  city: City;
  currentTemp: number; // Celsius
  avgTemp: number; // Historical average for this UTC date
  deviation: number; // currentTemp - avgTemp (signed)
  news: NewsArticle[];
  fetchedAt: Date; // For "last updated" display
}

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  image: string | null;
}

// API response types for runtime validation

export interface OpenMeteoCurrentResponse {
  current?: {
    temperature_2m?: number;
    time?: string;
  };
}

export interface GNewsResponse {
  articles?: Array<{
    title?: string;
    url?: string;
    source?: { name?: string };
    publishedAt?: string;
    image?: string;
  }>;
}

// Sort options
export type SortOption =
  | "deviation-desc"
  | "deviation-asc"
  | "temp-desc"
  | "temp-asc"
  | "name-asc";

// Temperature unit preference
export type TemperatureUnit = "celsius" | "fahrenheit";
