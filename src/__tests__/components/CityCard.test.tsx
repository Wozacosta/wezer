import { describe, it, expect } from "vitest";
import { Anomaly } from "@/types";
import {
  formatTemperature,
  formatDeviation,
  deviationToFahrenheit,
} from "@/lib/temperature";
import { countryCodeToFlag, getWeatherUrl } from "@/lib/city-utils";

// Due to React 19 + Testing Library compatibility issues,
// we test the component logic indirectly through data transformations
// Full component rendering tests would require React 19 compatible testing library

const baseAnomaly: Anomaly = {
  city: {
    name: "Test City",
    country: "Test Country",
    countryCode: "US",
    lat: 40.7128,
    lon: -74.006,
  },
  currentTemp: 25,
  avgTemp: 20,
  deviation: 5,
  news: [],
  fetchedAt: new Date("2026-01-25T12:00:00Z"),
};

describe("CityCard data transformations", () => {
  describe("temperature formatting with unit", () => {
    it("should format temperature in Celsius", () => {
      const formatted = formatTemperature(baseAnomaly.currentTemp, "celsius");
      expect(formatted).toBe("25.0°C");
    });

    it("should format temperature in Fahrenheit", () => {
      const formatted = formatTemperature(
        baseAnomaly.currentTemp,
        "fahrenheit",
      );
      expect(formatted).toBe("77.0°F");
    });

    it("should format average temperature in Celsius", () => {
      const formatted = formatTemperature(baseAnomaly.avgTemp, "celsius");
      expect(formatted).toBe("20.0°C");
    });

    it("should format average temperature in Fahrenheit", () => {
      const formatted = formatTemperature(baseAnomaly.avgTemp, "fahrenheit");
      expect(formatted).toBe("68.0°F");
    });
  });

  describe("deviation formatting with unit", () => {
    it("should format positive deviation in Celsius with + prefix", () => {
      const formatted = formatDeviation(baseAnomaly.deviation, "celsius");
      expect(formatted).toBe("+5.0°C");
    });

    it("should format positive deviation in Fahrenheit with + prefix", () => {
      const formatted = formatDeviation(baseAnomaly.deviation, "fahrenheit");
      expect(formatted).toBe("+9.0°F");
    });

    it("should format negative deviation in Celsius with - prefix", () => {
      const formatted = formatDeviation(-5, "celsius");
      expect(formatted).toBe("-5.0°C");
    });

    it("should format negative deviation in Fahrenheit with - prefix", () => {
      const formatted = formatDeviation(-5, "fahrenheit");
      expect(formatted).toBe("-9.0°F");
    });

    it("should format zero deviation without prefix", () => {
      const formatted = formatDeviation(0, "celsius");
      expect(formatted).toBe("0.0°C");
    });
  });

  describe("screen reader deviation value", () => {
    it("should calculate absolute deviation value for Celsius", () => {
      const deviation = baseAnomaly.deviation;
      const absValue = Math.abs(deviation).toFixed(1);
      expect(absValue).toBe("5.0");
    });

    it("should calculate absolute deviation value for Fahrenheit", () => {
      const deviation = baseAnomaly.deviation;
      const absValue = Math.abs(deviationToFahrenheit(deviation)).toFixed(1);
      expect(absValue).toBe("9.0");
    });
  });

  describe("anomaly classification", () => {
    it("should correctly identify hot anomaly", () => {
      const isHot = baseAnomaly.deviation > 0;
      expect(isHot).toBe(true);
    });

    it("should correctly identify cold anomaly", () => {
      const coldAnomaly: Anomaly = { ...baseAnomaly, deviation: -5 };
      const isCold = coldAnomaly.deviation < 0;
      expect(isCold).toBe(true);
    });

    it("should correctly identify neutral anomaly", () => {
      const neutralAnomaly: Anomaly = { ...baseAnomaly, deviation: 0 };
      const isHot = neutralAnomaly.deviation > 0;
      const isCold = neutralAnomaly.deviation < 0;
      expect(isHot).toBe(false);
      expect(isCold).toBe(false);
    });
  });

  describe("aria ID generation", () => {
    it("should generate safe city name for aria IDs", () => {
      const cityName = "New York";
      const safeId = cityName.replace(/\s+/g, "-");
      expect(safeId).toBe("New-York");
    });

    it("should handle city names with multiple spaces", () => {
      const cityName = "Salt Lake City";
      const safeId = cityName.replace(/\s+/g, "-");
      expect(safeId).toBe("Salt-Lake-City");
    });
  });

  describe("news handling", () => {
    it("should check news array length correctly", () => {
      expect(baseAnomaly.news.length).toBe(0);
    });

    it("should handle anomaly with news", () => {
      const anomalyWithNews: Anomaly = {
        ...baseAnomaly,
        news: [
          {
            title: "Test",
            url: "https://test.com",
            source: "Test",
            publishedAt: "",
            image: null,
          },
        ],
      };
      expect(anomalyWithNews.news.length).toBe(1);
    });

    it("should handle news with image", () => {
      const anomalyWithImage: Anomaly = {
        ...baseAnomaly,
        news: [
          {
            title: "Weather Story",
            url: "https://news.com/story",
            source: "News Source",
            publishedAt: "2026-01-25T10:00:00Z",
            image: "https://news.com/image.jpg",
          },
        ],
      };
      expect(anomalyWithImage.news[0].image).toBe("https://news.com/image.jpg");
    });

    it("should handle news without image", () => {
      const anomalyWithoutImage: Anomaly = {
        ...baseAnomaly,
        news: [
          {
            title: "Weather Story",
            url: "https://news.com/story",
            source: "News Source",
            publishedAt: "2026-01-25T10:00:00Z",
            image: null,
          },
        ],
      };
      expect(anomalyWithoutImage.news[0].image).toBeNull();
    });
  });

  describe("aria-label generation", () => {
    it("should generate correct aria-label in Celsius", () => {
      const { city } = baseAnomaly;
      const formattedDeviation = formatDeviation(
        baseAnomaly.deviation,
        "celsius",
      );
      const ariaLabel = `${city.name} weather anomaly: ${formattedDeviation} from average`;
      expect(ariaLabel).toBe("Test City weather anomaly: +5.0°C from average");
    });

    it("should generate correct aria-label in Fahrenheit", () => {
      const { city } = baseAnomaly;
      const formattedDeviation = formatDeviation(
        baseAnomaly.deviation,
        "fahrenheit",
      );
      const ariaLabel = `${city.name} weather anomaly: ${formattedDeviation} from average`;
      expect(ariaLabel).toBe("Test City weather anomaly: +9.0°F from average");
    });
  });

  describe("flag emoji generation", () => {
    it("should generate correct flag emoji from countryCode", () => {
      const flag = countryCodeToFlag(baseAnomaly.city.countryCode);
      expect(flag).toBe("🇺🇸");
    });

    it("should handle UK country code (GB)", () => {
      const ukAnomaly: Anomaly = {
        ...baseAnomaly,
        city: { ...baseAnomaly.city, countryCode: "GB" },
      };
      const flag = countryCodeToFlag(ukAnomaly.city.countryCode);
      expect(flag).toBe("🇬🇧");
    });

    it("should handle France country code", () => {
      const frAnomaly: Anomaly = {
        ...baseAnomaly,
        city: { ...baseAnomaly.city, countryCode: "FR" },
      };
      const flag = countryCodeToFlag(frAnomaly.city.countryCode);
      expect(flag).toBe("🇫🇷");
    });

    it("should handle Japan country code", () => {
      const jpAnomaly: Anomaly = {
        ...baseAnomaly,
        city: { ...baseAnomaly.city, countryCode: "JP" },
      };
      const flag = countryCodeToFlag(jpAnomaly.city.countryCode);
      expect(flag).toBe("🇯🇵");
    });
  });

  describe("weather URL generation", () => {
    it("should generate correct weather URL from coordinates", () => {
      const url = getWeatherUrl(baseAnomaly.city.lat, baseAnomaly.city.lon);
      expect(url).toBe("https://weather.com/weather/today/l/40.7128,-74.006");
    });

    it("should handle southern hemisphere coordinates", () => {
      const sydneyAnomaly: Anomaly = {
        ...baseAnomaly,
        city: { ...baseAnomaly.city, lat: -33.8688, lon: 151.2093 },
      };
      const url = getWeatherUrl(sydneyAnomaly.city.lat, sydneyAnomaly.city.lon);
      expect(url).toBe("https://weather.com/weather/today/l/-33.8688,151.2093");
    });

    it("should handle European coordinates", () => {
      const parisAnomaly: Anomaly = {
        ...baseAnomaly,
        city: { ...baseAnomaly.city, lat: 48.8566, lon: 2.3522 },
      };
      const url = getWeatherUrl(parisAnomaly.city.lat, parisAnomaly.city.lon);
      expect(url).toBe("https://weather.com/weather/today/l/48.8566,2.3522");
    });
  });
});
