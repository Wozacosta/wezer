import { Anomaly } from "@/types";
import { cities } from "./cities";
import { getHistoricalAverage } from "./historical-averages";
import { getCurrentWeather } from "./weather";
import { getNewsForCity } from "./news";

/**
 * Calculate deviation between current and historical temperature
 * @param current Current temperature in Celsius
 * @param historical Historical average temperature in Celsius
 * @returns Signed deviation rounded to 1 decimal place
 */
export function calculateDeviation(
  current: number,
  historical: number,
): number {
  return Math.round((current - historical) * 10) / 10;
}

/**
 * Get the day of year (1-366) for a given date in UTC
 * @param date Date to calculate day of year for
 * @returns Day of year (1-indexed)
 */
export function getUtcDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Fetch weather anomalies for all cities
 * @returns Array of Anomaly objects sorted by absolute deviation (descending)
 */
export async function getAnomalies(): Promise<Anomaly[]> {
  const now = new Date();
  const dayOfYear = getUtcDayOfYear(now);

  // Fetch current weather for all cities in parallel
  const weatherResults = await Promise.allSettled(
    cities.map((city) => getCurrentWeather(city)),
  );

  // Build anomalies array (skip failed fetches)
  const anomalies: Anomaly[] = [];

  weatherResults.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      const city = cities[index];
      const currentTemp = result.value.temperature;
      const avgTemp = getHistoricalAverage(city.name, dayOfYear);

      if (avgTemp !== null) {
        anomalies.push({
          city,
          currentTemp,
          avgTemp,
          deviation: calculateDeviation(currentTemp, avgTemp),
          news: [], // Will be populated for top anomalies
          fetchedAt: now,
        });
      }
    }
  });

  // Sort by absolute deviation (highest first)
  anomalies.sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));

  // Fetch news for TOP 3 anomalies only (to respect GNews rate limits)
  const top3 = anomalies.slice(0, 3);
  const newsResults = await Promise.allSettled(
    top3.map((anomaly) => getNewsForCity(anomaly.city.name, anomaly.deviation)),
  );

  newsResults.forEach((result, index) => {
    if (result.status === "fulfilled") {
      top3[index].news = result.value;
    }
  });

  return anomalies;
}
