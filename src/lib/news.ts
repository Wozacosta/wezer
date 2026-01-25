import { NewsArticle, GNewsResponse } from '@/types';

const GNEWS_BASE_URL = 'https://gnews.io/api/v4/search';

/**
 * Validate that the response has the expected shape
 */
function isValidResponse(data: unknown): data is GNewsResponse {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Record<string, unknown>;
  return Array.isArray(response.articles);
}

/**
 * Fetch news articles related to weather in a city
 * @param cityName Name of the city to search for
 * @returns Array of NewsArticle (empty array on error)
 */
export async function getNewsForCity(cityName: string): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey || apiKey === 'your_gnews_api_key_here') {
    // Return empty array if no API key configured
    return [];
  }

  try {
    const query = encodeURIComponent(`${cityName} weather`);
    const url = `${GNEWS_BASE_URL}?q=${query}&token=${apiKey}&max=3&lang=en`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours to respect rate limits
    });

    if (response.status === 429) {
      // Rate limited - return empty array gracefully
      console.warn(`GNews rate limit hit for ${cityName}`);
      return [];
    }

    if (!response.ok) {
      console.error(
        `GNews API error for ${cityName}: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data: unknown = await response.json();

    if (!isValidResponse(data)) {
      console.error(`Invalid GNews response for ${cityName}:`, data);
      return [];
    }

    return (data.articles || [])
      .filter(
        (article) =>
          article.title && article.url && article.source?.name
      )
      .map((article) => ({
        title: article.title!,
        url: article.url!,
        source: article.source!.name!,
        publishedAt: article.publishedAt || '',
      }));
  } catch (error) {
    console.error(`Failed to fetch news for ${cityName}:`, error);
    return [];
  }
}
