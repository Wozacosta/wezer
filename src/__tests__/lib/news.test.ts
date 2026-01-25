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

  describe("deviation-based query building", () => {
    const mockEmptyResponse = () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ articles: [] }),
      } as Response);
    };

    const getQueryFromFetch = () => vi.mocked(fetch).mock.calls[0][0] as string;

    it("should include 'heatwave' for deviation >= 10", async () => {
      mockEmptyResponse();
      await getNewsForCity("Paris", 12);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Paris%20weather%20heatwave"),
        expect.any(Object),
      );
    });

    it("should include 'heatwave' at exact boundary (deviation = 10)", async () => {
      mockEmptyResponse();
      await getNewsForCity("Paris", 10);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Paris%20weather%20heatwave"),
        expect.any(Object),
      );
    });

    it("should include 'hot' for deviation >= 5 and < 10", async () => {
      mockEmptyResponse();
      await getNewsForCity("Paris", 7);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Paris%20weather%20hot"),
        expect.any(Object),
      );
    });

    it("should include 'hot' at exact boundary (deviation = 5)", async () => {
      mockEmptyResponse();
      await getNewsForCity("Paris", 5);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Paris%20weather%20hot"),
        expect.any(Object),
      );
    });

    it("should include 'freezing' for deviation <= -10", async () => {
      mockEmptyResponse();
      await getNewsForCity("Moscow", -15);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Moscow%20weather%20freezing"),
        expect.any(Object),
      );
    });

    it("should include 'freezing' at exact boundary (deviation = -10)", async () => {
      mockEmptyResponse();
      await getNewsForCity("Moscow", -10);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Moscow%20weather%20freezing"),
        expect.any(Object),
      );
    });

    it("should include 'cold' for deviation <= -5 and > -10", async () => {
      mockEmptyResponse();
      await getNewsForCity("Berlin", -7);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Berlin%20weather%20cold"),
        expect.any(Object),
      );
    });

    it("should include 'cold' at exact boundary (deviation = -5)", async () => {
      mockEmptyResponse();
      await getNewsForCity("Berlin", -5);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("Berlin%20weather%20cold"),
        expect.any(Object),
      );
    });

    it("should not include descriptor for small positive deviations", async () => {
      mockEmptyResponse();
      await getNewsForCity("London", 2);
      const query = getQueryFromFetch();
      expect(query).toContain("London%20weather");
      expect(query).not.toContain("hot");
      expect(query).not.toContain("heatwave");
    });

    it("should not include descriptor for small negative deviations", async () => {
      mockEmptyResponse();
      await getNewsForCity("London", -3);
      const query = getQueryFromFetch();
      expect(query).toContain("London%20weather");
      expect(query).not.toContain("cold");
      expect(query).not.toContain("freezing");
    });

    it("should not include descriptor for deviation = 0", async () => {
      mockEmptyResponse();
      await getNewsForCity("London", 0);
      const query = getQueryFromFetch();
      expect(query).toContain("London%20weather");
      expect(query).not.toContain("hot");
      expect(query).not.toContain("cold");
      expect(query).not.toContain("heatwave");
      expect(query).not.toContain("freezing");
    });

    it("should work without deviation (backward compatible)", async () => {
      mockEmptyResponse();
      await getNewsForCity("Tokyo");
      const query = getQueryFromFetch();
      expect(query).toContain("Tokyo%20weather");
      expect(query).not.toContain("hot");
      expect(query).not.toContain("cold");
    });

    it("should handle cities with spaces correctly", async () => {
      mockEmptyResponse();
      await getNewsForCity("New York", 12);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("New%20York%20weather%20heatwave"),
        expect.any(Object),
      );
    });
  });
});
