import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  celsiusToFahrenheit,
  deviationToFahrenheit,
  formatTemperature,
  formatDeviation,
  getDefaultUnit,
  getStoredUnit,
  setStoredUnit,
} from "@/lib/temperature";

describe("celsiusToFahrenheit", () => {
  it("should convert 0°C to 32°F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it("should convert 100°C to 212°F", () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("should convert -40°C to -40°F", () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it("should convert 20°C to 68°F", () => {
    expect(celsiusToFahrenheit(20)).toBe(68);
  });

  it("should handle decimal values", () => {
    expect(celsiusToFahrenheit(25.5)).toBeCloseTo(77.9, 1);
  });
});

describe("deviationToFahrenheit", () => {
  it("should convert +5°C deviation to +9°F", () => {
    expect(deviationToFahrenheit(5)).toBe(9);
  });

  it("should convert -10°C deviation to -18°F", () => {
    expect(deviationToFahrenheit(-10)).toBe(-18);
  });

  it("should convert 0°C deviation to 0°F", () => {
    expect(deviationToFahrenheit(0)).toBe(0);
  });
});

describe("formatTemperature", () => {
  it("should format Celsius temperature correctly", () => {
    expect(formatTemperature(25.5, "celsius")).toBe("25.5°C");
  });

  it("should format Fahrenheit temperature correctly", () => {
    expect(formatTemperature(25, "fahrenheit")).toBe("77.0°F");
  });

  it("should handle negative Celsius values", () => {
    expect(formatTemperature(-10.5, "celsius")).toBe("-10.5°C");
  });

  it("should handle negative Fahrenheit conversion", () => {
    expect(formatTemperature(-40, "fahrenheit")).toBe("-40.0°F");
  });

  it("should format to one decimal place", () => {
    expect(formatTemperature(20.123, "celsius")).toBe("20.1°C");
  });
});

describe("formatDeviation", () => {
  it("should format positive Celsius deviation with + sign", () => {
    expect(formatDeviation(5.0, "celsius")).toBe("+5.0°C");
  });

  it("should format negative Celsius deviation without + sign", () => {
    expect(formatDeviation(-3.5, "celsius")).toBe("-3.5°C");
  });

  it("should format positive Fahrenheit deviation with + sign", () => {
    expect(formatDeviation(5.0, "fahrenheit")).toBe("+9.0°F");
  });

  it("should format negative Fahrenheit deviation", () => {
    expect(formatDeviation(-10, "fahrenheit")).toBe("-18.0°F");
  });

  it("should format zero deviation without + sign", () => {
    expect(formatDeviation(0, "celsius")).toBe("0.0°C");
  });
});

describe("getDefaultUnit", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", { language: "en-US" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return fahrenheit for en-US locale", () => {
    vi.stubGlobal("navigator", { language: "en-US" });
    expect(getDefaultUnit()).toBe("fahrenheit");
  });

  it("should return fahrenheit for en-us locale (lowercase)", () => {
    vi.stubGlobal("navigator", { language: "en-us" });
    expect(getDefaultUnit()).toBe("fahrenheit");
  });

  it("should return celsius for en-GB locale", () => {
    vi.stubGlobal("navigator", { language: "en-GB" });
    expect(getDefaultUnit()).toBe("celsius");
  });

  it("should return celsius for fr-FR locale", () => {
    vi.stubGlobal("navigator", { language: "fr-FR" });
    expect(getDefaultUnit()).toBe("celsius");
  });

  it("should return celsius for de-DE locale", () => {
    vi.stubGlobal("navigator", { language: "de-DE" });
    expect(getDefaultUnit()).toBe("celsius");
  });
});

describe("localStorage utilities", () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: vi.fn(() => {
        Object.keys(mockLocalStorage).forEach(
          (key) => delete mockLocalStorage[key],
        );
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.keys(mockLocalStorage).forEach(
      (key) => delete mockLocalStorage[key],
    );
  });

  describe("getStoredUnit", () => {
    it("should return celsius when stored", () => {
      mockLocalStorage["test-key"] = "celsius";
      expect(getStoredUnit("test-key")).toBe("celsius");
    });

    it("should return fahrenheit when stored", () => {
      mockLocalStorage["test-key"] = "fahrenheit";
      expect(getStoredUnit("test-key")).toBe("fahrenheit");
    });

    it("should return null for invalid value", () => {
      mockLocalStorage["test-key"] = "kelvin";
      expect(getStoredUnit("test-key")).toBeNull();
    });

    it("should return null when key does not exist", () => {
      expect(getStoredUnit("nonexistent")).toBeNull();
    });

    it("should return null when localStorage throws", () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn(() => {
          throw new Error("Private browsing");
        }),
      });
      expect(getStoredUnit("test-key")).toBeNull();
    });
  });

  describe("setStoredUnit", () => {
    it("should store celsius value", () => {
      setStoredUnit("test-key", "celsius");
      expect(mockLocalStorage["test-key"]).toBe("celsius");
    });

    it("should store fahrenheit value", () => {
      setStoredUnit("test-key", "fahrenheit");
      expect(mockLocalStorage["test-key"]).toBe("fahrenheit");
    });

    it("should not throw when localStorage throws", () => {
      vi.stubGlobal("localStorage", {
        setItem: vi.fn(() => {
          throw new Error("Quota exceeded");
        }),
      });
      expect(() => setStoredUnit("test-key", "celsius")).not.toThrow();
    });
  });
});
