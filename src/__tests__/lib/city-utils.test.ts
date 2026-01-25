import { describe, it, expect } from "vitest";
import { countryCodeToFlag, getWeatherUrl } from "@/lib/city-utils";

describe("countryCodeToFlag", () => {
  describe("valid inputs", () => {
    it("should convert US to US flag emoji", () => {
      expect(countryCodeToFlag("US")).toBe("🇺🇸");
    });

    it("should convert GB to UK flag emoji", () => {
      expect(countryCodeToFlag("GB")).toBe("🇬🇧");
    });

    it("should convert FR to France flag emoji", () => {
      expect(countryCodeToFlag("FR")).toBe("🇫🇷");
    });

    it("should convert DE to Germany flag emoji", () => {
      expect(countryCodeToFlag("DE")).toBe("🇩🇪");
    });

    it("should convert JP to Japan flag emoji", () => {
      expect(countryCodeToFlag("JP")).toBe("🇯🇵");
    });

    it("should convert AU to Australia flag emoji", () => {
      expect(countryCodeToFlag("AU")).toBe("🇦🇺");
    });

    it("should handle lowercase country codes", () => {
      expect(countryCodeToFlag("us")).toBe("🇺🇸");
      expect(countryCodeToFlag("fr")).toBe("🇫🇷");
    });

    it("should handle mixed case country codes", () => {
      expect(countryCodeToFlag("Us")).toBe("🇺🇸");
      expect(countryCodeToFlag("gB")).toBe("🇬🇧");
    });
  });

  describe("invalid inputs", () => {
    it("should return empty string for empty input", () => {
      expect(countryCodeToFlag("")).toBe("");
    });

    it("should return empty string for single character", () => {
      expect(countryCodeToFlag("U")).toBe("");
    });

    it("should return empty string for three or more characters", () => {
      expect(countryCodeToFlag("USA")).toBe("");
      expect(countryCodeToFlag("USAA")).toBe("");
    });

    it("should return empty string for numeric input", () => {
      expect(countryCodeToFlag("12")).toBe("");
    });

    it("should return empty string for special characters", () => {
      expect(countryCodeToFlag("U!")).toBe("");
      expect(countryCodeToFlag("##")).toBe("");
    });

    it("should return empty string for mixed alphanumeric", () => {
      expect(countryCodeToFlag("U1")).toBe("");
      expect(countryCodeToFlag("1S")).toBe("");
    });

    it("should return empty string for whitespace", () => {
      expect(countryCodeToFlag("  ")).toBe("");
      expect(countryCodeToFlag("U ")).toBe("");
    });
  });
});

describe("getWeatherUrl", () => {
  describe("valid coordinates", () => {
    it("should return correct weather.com URL for positive coordinates", () => {
      const url = getWeatherUrl(40.7128, -74.006);
      expect(url).toBe("https://weather.com/weather/today/l/40.7128,-74.006");
    });

    it("should return correct weather.com URL for negative coordinates", () => {
      const url = getWeatherUrl(-33.8688, 151.2093);
      expect(url).toBe("https://weather.com/weather/today/l/-33.8688,151.2093");
    });

    it("should return correct URL for equatorial coordinates", () => {
      const url = getWeatherUrl(1.3521, 103.8198);
      expect(url).toBe("https://weather.com/weather/today/l/1.3521,103.8198");
    });

    it("should return correct URL for zero coordinates", () => {
      const url = getWeatherUrl(0, 0);
      expect(url).toBe("https://weather.com/weather/today/l/0,0");
    });

    it("should preserve decimal precision in URL", () => {
      const url = getWeatherUrl(48.8566, 2.3522);
      expect(url).toBe("https://weather.com/weather/today/l/48.8566,2.3522");
    });

    it("should handle boundary values", () => {
      expect(getWeatherUrl(90, 180)).toBe(
        "https://weather.com/weather/today/l/90,180",
      );
      expect(getWeatherUrl(-90, -180)).toBe(
        "https://weather.com/weather/today/l/-90,-180",
      );
    });
  });

  describe("invalid coordinates", () => {
    it("should return empty string for latitude out of range", () => {
      expect(getWeatherUrl(91, 0)).toBe("");
      expect(getWeatherUrl(-91, 0)).toBe("");
    });

    it("should return empty string for longitude out of range", () => {
      expect(getWeatherUrl(0, 181)).toBe("");
      expect(getWeatherUrl(0, -181)).toBe("");
    });

    it("should return empty string for NaN values", () => {
      expect(getWeatherUrl(NaN, 0)).toBe("");
      expect(getWeatherUrl(0, NaN)).toBe("");
    });

    it("should return empty string for extreme values", () => {
      expect(getWeatherUrl(999, 0)).toBe("");
      expect(getWeatherUrl(0, -999)).toBe("");
    });
  });
});
