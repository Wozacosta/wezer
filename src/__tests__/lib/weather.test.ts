import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCurrentWeather } from '@/lib/weather';
import { City } from '@/types';

const mockCity: City = {
  name: 'Test City',
  country: 'Test Country',
  lat: 40.7128,
  lon: -74.006,
};

describe('getCurrentWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return weather data for valid response', async () => {
    const mockResponse = {
      current: {
        temperature_2m: 22.5,
        time: '2026-01-25T12:00',
      },
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getCurrentWeather(mockCity);

    expect(result).not.toBeNull();
    expect(result?.temperature).toBe(22.5);
    expect(result?.timestamp).toBeInstanceOf(Date);
  });

  it('should return null for non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    const result = await getCurrentWeather(mockCity);

    expect(result).toBeNull();
  });

  it('should return null for malformed response', async () => {
    const malformedResponse = {
      data: { temp: 22.5 }, // Wrong shape
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(malformedResponse),
    } as Response);

    const result = await getCurrentWeather(mockCity);

    expect(result).toBeNull();
  });

  it('should return null for network error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await getCurrentWeather(mockCity);

    expect(result).toBeNull();
  });

  it('should return null when current.temperature_2m is missing', async () => {
    const incompleteResponse = {
      current: {
        time: '2026-01-25T12:00',
        // temperature_2m missing
      },
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(incompleteResponse),
    } as Response);

    const result = await getCurrentWeather(mockCity);

    expect(result).toBeNull();
  });
});
