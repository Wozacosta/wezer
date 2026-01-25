import { describe, it, expect } from 'vitest';
import { calculateDeviation, getUtcDayOfYear } from '@/lib/anomaly';

describe('calculateDeviation', () => {
  it('should return positive deviation when current > historical', () => {
    expect(calculateDeviation(25, 20)).toBe(5);
  });

  it('should return negative deviation when current < historical', () => {
    expect(calculateDeviation(15, 20)).toBe(-5);
  });

  it('should return zero when current equals historical', () => {
    expect(calculateDeviation(20, 20)).toBe(0);
  });

  it('should round to 1 decimal place', () => {
    expect(calculateDeviation(25.567, 20.123)).toBe(5.4);
  });

  it('should handle negative temperatures', () => {
    expect(calculateDeviation(-5, -10)).toBe(5);
    expect(calculateDeviation(-15, -10)).toBe(-5);
  });
});

describe('getUtcDayOfYear', () => {
  it('should return 1 for January 1st', () => {
    const jan1 = new Date(Date.UTC(2026, 0, 1));
    expect(getUtcDayOfYear(jan1)).toBe(1);
  });

  it('should return 365 for December 31st in non-leap year', () => {
    const dec31 = new Date(Date.UTC(2025, 11, 31));
    expect(getUtcDayOfYear(dec31)).toBe(365);
  });

  it('should return 366 for December 31st in leap year', () => {
    const dec31 = new Date(Date.UTC(2024, 11, 31));
    expect(getUtcDayOfYear(dec31)).toBe(366);
  });

  it('should return correct day for mid-year date', () => {
    // July 1st = 31 (Jan) + 28 (Feb) + 31 (Mar) + 30 (Apr) + 31 (May) + 30 (Jun) + 1 = 182
    const july1 = new Date(Date.UTC(2025, 6, 1));
    expect(getUtcDayOfYear(july1)).toBe(182);
  });

  it('should handle leap year February 29th', () => {
    const feb29 = new Date(Date.UTC(2024, 1, 29));
    expect(getUtcDayOfYear(feb29)).toBe(60);
  });
});
