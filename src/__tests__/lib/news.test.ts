import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNewsForCity } from "@/lib/news";

describe("getNewsForCity", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env = { ...originalEnv, GNEWS_API_KEY: "test-api-key" };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  it("should return news articles for valid response", async () => {
    const mockResponse = {
      articles: [
        {
          title: "Weather Alert in Test City",
          url: "https://example.com/news1",
          source: { name: "Test News" },
          publishedAt: "2026-01-25T10:00:00Z",
          image: "https://example.com/image1.jpg",
        },
        {
          title: "Temperature Records Broken",
          url: "https://example.com/news2",
          source: { name: "Weather Daily" },
          publishedAt: "2026-01-25T09:00:00Z",
        },
      ],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getNewsForCity("Test City");

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Weather Alert in Test City");
    expect(result[0].source).toBe("Test News");
    expect(result[0].image).toBe("https://example.com/image1.jpg");
    expect(result[1].url).toBe("https://example.com/news2");
    expect(result[1].image).toBeNull();
  });

  it("should return empty array when API key is not configured", async () => {
    process.env.GNEWS_API_KEY = "your_gnews_api_key_here";

    const result = await getNewsForCity("Test City");

    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should return empty array on rate limit (429)", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as Response);

    const result = await getNewsForCity("Test City");

    expect(result).toEqual([]);
  });

  it("should return empty array on other errors", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    const result = await getNewsForCity("Test City");

    expect(result).toEqual([]);
  });

  it("should return empty array for malformed response", async () => {
    const malformedResponse = {
      data: [], // Wrong shape
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(malformedResponse),
    } as Response);

    const result = await getNewsForCity("Test City");

    expect(result).toEqual([]);
  });

  it("should return empty array on network error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const result = await getNewsForCity("Test City");

    expect(result).toEqual([]);
  });

  it("should filter out articles with missing required fields", async () => {
    const mockResponse = {
      articles: [
        {
          title: "Valid Article",
          url: "https://example.com/valid",
          source: { name: "Valid Source" },
          publishedAt: "2026-01-25T10:00:00Z",
        },
        {
          title: "Missing URL",
          // url missing
          source: { name: "Some Source" },
        },
        {
          // title missing
          url: "https://example.com/no-title",
          source: { name: "Another Source" },
        },
      ],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getNewsForCity("Test City");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Valid Article");
  });
});
