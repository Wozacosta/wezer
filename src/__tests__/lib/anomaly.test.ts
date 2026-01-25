import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateDeviation,
  getUtcDayOfYear,
  getAnomalies,
} from "@/lib/anomaly";

describe("calculateDeviation", () => {
  it("should return positive deviation when current > historical", () => {
    expect(calculateDeviation(25, 20)).toBe(5);
  });

  it("should return negative deviation when current < historical", () => {
    expect(calculateDeviation(15, 20)).toBe(-5);
  });

  it("should return zero when current equals historical", () => {
    expect(calculateDeviation(20, 20)).toBe(0);
  });

  it("should round to 1 decimal place", () => {
    expect(calculateDeviation(25.567, 20.123)).toBe(5.4);
  });

  it("should handle negative temperatures", () => {
    expect(calculateDeviation(-5, -10)).toBe(5);
    expect(calculateDeviation(-15, -10)).toBe(-5);
  });
});

describe("getUtcDayOfYear", () => {
  it("should return 1 for January 1st", () => {
    const jan1 = new Date(Date.UTC(2026, 0, 1));
    expect(getUtcDayOfYear(jan1)).toBe(1);
  });

  it("should return 365 for December 31st in non-leap year", () => {
    const dec31 = new Date(Date.UTC(2025, 11, 31));
    expect(getUtcDayOfYear(dec31)).toBe(365);
  });

  it("should return 366 for December 31st in leap year", () => {
    const dec31 = new Date(Date.UTC(2024, 11, 31));
    expect(getUtcDayOfYear(dec31)).toBe(366);
  });

  it("should return correct day for mid-year date", () => {
    // July 1st = 31 (Jan) + 28 (Feb) + 31 (Mar) + 30 (Apr) + 31 (May) + 30 (Jun) + 1 = 182
    const july1 = new Date(Date.UTC(2025, 6, 1));
    expect(getUtcDayOfYear(july1)).toBe(182);
  });

  it("should handle leap year February 29th", () => {
    const feb29 = new Date(Date.UTC(2024, 1, 29));
    expect(getUtcDayOfYear(feb29)).toBe(60);
  });
});

describe("getAnomalies", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return sorted anomalies with weather data", async () => {
    const mockWeatherResponse = (temp: number) => ({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          current: {
            temperature_2m: temp,
            time: "2026-01-25T12:00",
          },
        }),
    });

    vi.mocked(fetch).mockImplementation((url) => {
      const urlStr = String(url);
      if (urlStr.includes("api.open-meteo.com")) {
        if (urlStr.includes("40.7128"))
          return Promise.resolve(mockWeatherResponse(35) as Response);
        if (urlStr.includes("34.0522"))
          return Promise.resolve(mockWeatherResponse(-10) as Response);
        return Promise.resolve(mockWeatherResponse(15) as Response);
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ articles: [] }),
      } as Response);
    });

    const anomalies = await getAnomalies();

    expect(anomalies.length).toBeGreaterThan(0);
    for (let i = 1; i < anomalies.length; i++) {
      expect(Math.abs(anomalies[i - 1].deviation)).toBeGreaterThanOrEqual(
        Math.abs(anomalies[i].deviation),
      );
    }
  });

  it("should return empty array when all weather fetches fail", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    const anomalies = await getAnomalies();

    expect(anomalies).toEqual([]);
  });

  it("should fetch news only for top 3 anomalies", async () => {
    const mockWeatherResponse = {
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          current: { temperature_2m: 25, time: "2026-01-25T12:00" },
        }),
    };

    const fetchCalls: string[] = [];
    vi.mocked(fetch).mockImplementation((url) => {
      fetchCalls.push(String(url));
      if (String(url).includes("gnews.io")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ articles: [] }),
        } as Response);
      }
      return Promise.resolve(mockWeatherResponse as Response);
    });

    await getAnomalies();

    const newsCalls = fetchCalls.filter((url) => url.includes("gnews.io"));
    expect(newsCalls.length).toBeLessThanOrEqual(3);
  });
});
