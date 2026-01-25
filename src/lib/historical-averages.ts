// Pre-computed historical average temperatures (Celsius) for each city by day of year
// Data based on typical climate patterns - in production, this would be generated
// from Open-Meteo archive API data across 10+ years

// Helper to generate daily averages from monthly averages
function generateDailyAverages(monthlyAvgs: number[]): number[] {
  const dailyAvgs: number[] = [];
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  for (let month = 0; month < 12; month++) {
    const currentAvg = monthlyAvgs[month];
    const nextAvg = monthlyAvgs[(month + 1) % 12];
    const days = daysInMonth[month];

    for (let day = 0; day < days; day++) {
      // Interpolate between months for smooth transitions
      const progress = day / days;
      const temp = currentAvg + (nextAvg - currentAvg) * progress * 0.5;
      dailyAvgs.push(Math.round(temp * 10) / 10);
    }
  }

  return dailyAvgs;
}

// Monthly averages for each city (Jan-Dec)
const monthlyAverages: Record<string, number[]> = {
  // North America
  'New York': [-1, 0, 5, 11, 17, 22, 25, 24, 20, 14, 8, 2],
  'Los Angeles': [14, 15, 16, 17, 19, 21, 23, 24, 23, 20, 17, 14],
  'Chicago': [-5, -3, 3, 10, 16, 22, 24, 23, 19, 12, 5, -2],
  'Toronto': [-6, -5, 0, 7, 14, 19, 22, 21, 17, 10, 4, -3],
  'Mexico City': [14, 16, 18, 19, 19, 18, 17, 17, 17, 16, 15, 14],
  'Miami': [20, 21, 23, 25, 27, 28, 29, 29, 28, 26, 24, 21],

  // South America (Southern Hemisphere - reversed seasons)
  'São Paulo': [23, 23, 22, 20, 18, 16, 16, 17, 18, 19, 21, 22],
  'Buenos Aires': [25, 24, 22, 17, 14, 11, 10, 12, 14, 17, 20, 23],
  'Lima': [23, 24, 23, 21, 19, 17, 16, 16, 17, 18, 19, 21],
  'Bogotá': [14, 14, 15, 15, 15, 14, 14, 14, 14, 14, 14, 14],
  'Santiago': [21, 20, 18, 14, 11, 8, 8, 9, 11, 14, 17, 19],

  // Europe
  'London': [5, 5, 7, 10, 13, 16, 18, 18, 15, 12, 8, 5],
  'Paris': [4, 5, 8, 11, 15, 18, 20, 20, 17, 12, 7, 4],
  'Berlin': [0, 1, 5, 9, 14, 17, 19, 19, 15, 10, 5, 1],
  'Madrid': [6, 8, 11, 13, 17, 22, 26, 25, 21, 15, 10, 6],
  'Rome': [8, 9, 11, 14, 18, 22, 25, 25, 22, 17, 12, 9],
  'Moscow': [-9, -7, -2, 6, 13, 17, 19, 17, 12, 5, -1, -6],
  'Amsterdam': [3, 4, 6, 9, 13, 16, 18, 18, 15, 11, 7, 4],
  'Stockholm': [-3, -3, 0, 5, 11, 15, 18, 17, 12, 7, 2, -1],
  'Athens': [10, 10, 12, 16, 21, 25, 28, 28, 24, 19, 15, 11],
  'Istanbul': [6, 6, 8, 13, 17, 22, 25, 25, 21, 16, 12, 8],

  // Africa
  'Cairo': [14, 15, 18, 22, 26, 29, 30, 30, 28, 25, 20, 15],
  'Lagos': [27, 28, 29, 29, 28, 26, 25, 25, 26, 27, 28, 27],
  'Johannesburg': [21, 20, 19, 16, 13, 10, 10, 13, 16, 18, 19, 20],
  'Nairobi': [19, 20, 20, 19, 18, 17, 16, 16, 18, 19, 18, 18],
  'Casablanca': [13, 14, 15, 17, 19, 22, 24, 24, 23, 20, 16, 14],
  'Accra': [27, 28, 28, 28, 27, 26, 25, 24, 25, 26, 27, 27],

  // Middle East
  'Dubai': [19, 20, 23, 27, 31, 33, 35, 36, 33, 29, 25, 21],
  'Tel Aviv': [13, 14, 16, 19, 22, 25, 27, 28, 26, 23, 19, 15],
  'Riyadh': [14, 17, 21, 27, 33, 36, 37, 37, 34, 28, 21, 16],

  // Asia
  'Tokyo': [6, 6, 9, 14, 19, 22, 26, 27, 24, 18, 13, 8],
  'Beijing': [-4, -1, 6, 14, 20, 24, 26, 25, 20, 13, 5, -2],
  'Shanghai': [5, 6, 10, 15, 20, 25, 28, 28, 24, 19, 13, 7],
  'Hong Kong': [16, 17, 19, 23, 27, 29, 29, 29, 28, 26, 22, 18],
  'Singapore': [27, 27, 28, 28, 28, 28, 28, 28, 27, 27, 27, 27],
  'Mumbai': [25, 26, 28, 30, 31, 29, 28, 28, 28, 29, 28, 26],
  'Delhi': [14, 17, 23, 30, 34, 35, 32, 31, 30, 27, 21, 15],
  'Bangkok': [27, 28, 30, 31, 30, 29, 29, 29, 28, 28, 27, 26],
  'Seoul': [-3, 0, 5, 12, 18, 22, 25, 26, 21, 14, 7, 0],
  'Jakarta': [27, 27, 27, 28, 28, 27, 27, 27, 28, 28, 28, 27],
  'Manila': [26, 27, 28, 30, 30, 29, 28, 28, 28, 28, 27, 26],
  'Hanoi': [17, 18, 20, 24, 28, 30, 30, 29, 28, 25, 22, 18],
  'Karachi': [19, 21, 26, 30, 32, 33, 31, 30, 30, 29, 25, 21],

  // Oceania (Southern Hemisphere)
  'Sydney': [23, 23, 22, 19, 16, 13, 12, 13, 16, 18, 20, 22],
  'Melbourne': [21, 21, 19, 16, 13, 10, 10, 11, 13, 15, 17, 19],
  'Auckland': [20, 20, 19, 16, 14, 12, 11, 11, 13, 14, 16, 18],
  'Perth': [25, 25, 23, 19, 16, 13, 12, 13, 14, 17, 20, 23],

  // Additional
  'Reykjavik': [-1, -1, 0, 3, 7, 10, 12, 11, 8, 4, 1, -1],
  'Anchorage': [-10, -8, -4, 2, 9, 14, 16, 15, 10, 2, -5, -9],
  'Timbuktu': [22, 25, 29, 33, 36, 35, 32, 30, 31, 32, 28, 23],
};

// Generate daily averages for all cities
export const historicalAverages: Record<string, number[]> = {};

for (const [city, monthly] of Object.entries(monthlyAverages)) {
  historicalAverages[city] = generateDailyAverages(monthly);
}

/**
 * Get the historical average temperature for a city on a specific day of year
 * @param cityName Name of the city
 * @param dayOfYear Day of year (1-366)
 * @returns Average temperature in Celsius, or null if city not found
 */
export function getHistoricalAverage(
  cityName: string,
  dayOfYear: number
): number | null {
  const cityData = historicalAverages[cityName];
  if (!cityData) return null;

  // dayOfYear is 1-indexed, array is 0-indexed
  const index = Math.max(0, Math.min(dayOfYear - 1, cityData.length - 1));
  return cityData[index];
}
