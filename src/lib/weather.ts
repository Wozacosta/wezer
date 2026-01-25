import { City, WeatherData, OpenMeteoCurrentResponse } from '@/types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Validate that the response has the expected shape
 */
function isValidResponse(data: unknown): data is OpenMeteoCurrentResponse {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Record<string, unknown>;
  if (!response.current || typeof response.current !== 'object') return false;
  const current = response.current as Record<string, unknown>;
  return typeof current.temperature_2m === 'number';
}

/**
 * Fetch current weather for a city from Open-Meteo API
 * @param city City to fetch weather for
 * @returns WeatherData or null if fetch fails
 */
export async function getCurrentWeather(
  city: City
): Promise<WeatherData | null> {
  try {
    const url = `${OPEN_METEO_BASE_URL}?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour (ISR)
    });

    if (!response.ok) {
      console.error(
        `Weather API error for ${city.name}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data: unknown = await response.json();

    if (!isValidResponse(data)) {
      console.error(`Invalid weather response for ${city.name}:`, data);
      return null;
    }

    return {
      temperature: data.current!.temperature_2m!,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(`Failed to fetch weather for ${city.name}:`, error);
    return null;
  }
}
