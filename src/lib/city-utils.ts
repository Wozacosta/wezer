/**
 * Convert an ISO 3166-1 alpha-2 country code to a flag emoji
 * @param countryCode Two-letter country code (e.g., "US", "FR", "GB")
 * @returns Flag emoji (e.g., "🇺🇸", "🇫🇷", "🇬🇧"), or empty string if invalid
 */
export function countryCodeToFlag(countryCode: string): string {
  // Validate: must be exactly 2 alphabetic characters
  if (
    !countryCode ||
    countryCode.length !== 2 ||
    !/^[A-Za-z]{2}$/.test(countryCode)
  ) {
    return "";
  }

  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((c) => c.charCodeAt(0) + 127397),
  );
}

/**
 * Generate a weather.com URL for a given location
 * @param lat Latitude (-90 to 90)
 * @param lon Longitude (-180 to 180)
 * @returns Weather.com URL for the location, or empty string if coordinates invalid
 */
export function getWeatherUrl(lat: number, lon: number): string {
  // Validate coordinate ranges
  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    isNaN(lat) ||
    isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return "";
  }

  return `https://weather.com/weather/today/l/${lat},${lon}`;
}
