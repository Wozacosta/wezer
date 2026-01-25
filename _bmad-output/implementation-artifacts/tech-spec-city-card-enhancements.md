---
title: 'City Card Enhancements - External Links & Flags'
slug: 'city-card-enhancements'
created: '2026-01-25'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 16', 'React 19', 'TypeScript 5', 'Vitest', 'Tailwind CSS 4']
files_to_modify: ['src/types/index.ts', 'src/lib/cities.ts', 'src/lib/historical-averages.ts', 'src/components/CityCard.tsx', 'src/__tests__/components/CityCard.test.tsx']
code_patterns: ['External links: target="_blank" rel="noopener noreferrer"', 'City data: static array in lib/', 'Tests: Vitest + data transformation testing (no component rendering due to React 19 compat)']
test_patterns: ['Vitest with describe/it/expect', 'Test file location: src/__tests__/**/*.test.ts(x)', 'Data transformation testing pattern for components']
---

# Tech-Spec: City Card Enhancements - External Links & Flags

**Created:** 2026-01-25

## Overview

### Problem Statement

City cards are not clickable and lack visual country identification. Users cannot quickly access detailed weather information or identify cities by country at a glance.

### Solution

Make city cards clickable to open external weather websites, add country flag emojis to city display (derived from ISO country codes), and expand the city list by 150 Western-focused cities (US/Europe).

### Scope

**In Scope:**
- Add external weather URL link to each city card (clicking opens external weather site in new tab)
- Add flag emoji display to `CityCard` component
- Add `countryCode` field to `City` type (ISO 3166-1 alpha-2, e.g., "US", "FR") for future-proofing
- Derive flag emoji programmatically from country code
- Add 150 new cities focused on US/Europe to `cities.ts`
- Add historical averages for all new cities in `historical-averages.ts`

**Out of Scope:**
- Creating internal city detail pages
- Extended forecast data
- Changes to weather data fetching logic

## Context for Development

### Codebase Patterns

- **Framework**: Next.js 16 App Router with React 19
- **Styling**: Tailwind CSS 4 with dark mode support
- **Types**: Strict TypeScript, interfaces in `src/types/index.ts`
- **Components**: Functional components with hooks in `src/components/`
- **Data**: Static city data in `src/lib/cities.ts`, historical averages in `src/lib/historical-averages.ts`
- **External links**: Use `target="_blank" rel="noopener noreferrer"` pattern (established in news links)
- **Accessibility**: aria-labels, sr-only text for screen readers

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/types/index.ts` | City interface - add `countryCode` field |
| `src/lib/cities.ts` | City data array (currently 50 cities) - add 150 more + countryCode to all |
| `src/lib/historical-averages.ts` | Monthly averages by city name - add averages for new cities |
| `src/components/CityCard.tsx` | City card component - add flag emoji + external link |
| `src/__tests__/components/CityCard.test.tsx` | Tests - add flag/link transformation tests |

### Technical Decisions

1. **Country Code Format**: ISO 3166-1 alpha-2 (e.g., "US", "FR", "DE")
2. **Flag Emoji Derivation**: `String.fromCodePoint(...[...countryCode].map(c => c.charCodeAt(0) + 127397))`
   - No external library needed, works in all modern browsers
3. **External Weather URL**: Use weather.com with lat/lon format: `https://weather.com/weather/today/l/{lat},{lon}`
   - Reliable, works globally, uses coordinates we already have
4. **Historical Averages**: Add monthly averages for each new city (12 values per city)
   - Use realistic climate data based on geographic location

## Implementation Plan

### Tasks

- [x] **Task 1: Update City type with countryCode**
  - File: `src/types/index.ts`
  - Action: Add `countryCode: string` field to the `City` interface
  - Notes: ISO 3166-1 alpha-2 format (e.g., "US", "FR", "DE")

- [x] **Task 2: Create utility functions for flag and weather URL**
  - File: `src/lib/city-utils.ts` (new file)
  - Action: Create two pure functions:
    - `countryCodeToFlag(countryCode: string): string` - converts "US" → 🇺🇸
    - `getWeatherUrl(lat: number, lon: number): string` - returns weather.com URL
  - Notes: Formula for flag: `String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + 127397))`

- [x] **Task 3: Add countryCode to existing 50 cities**
  - File: `src/lib/cities.ts`
  - Action: Add `countryCode` field to all 50 existing city entries
  - Notes: Map current `country` values to ISO codes (e.g., "USA" → "US", "UK" → "GB")

- [x] **Task 4: Add 150 new Western cities**
  - File: `src/lib/cities.ts`
  - Action: Add 150 new cities with focus on:
    - ~100 US cities (major cities across all states)
    - ~50 European cities (UK, France, Germany, Spain, Italy, etc.)
  - Notes: Each city needs: name, country, countryCode, lat, lon

- [x] **Task 5: Add historical averages for new cities**
  - File: `src/lib/historical-averages.ts`
  - Action: Add monthly average temperatures (12 values) for each of the 150 new cities
  - Notes: Use realistic climate data based on geographic location and latitude

- [x] **Task 6: Update CityCard to display flag emoji**
  - File: `src/components/CityCard.tsx`
  - Action: 
    - Import `countryCodeToFlag` from `city-utils.ts`
    - Display flag emoji next to city name in the header
  - Notes: Add to existing h2 element, before or after city name

- [x] **Task 7: Make CityCard clickable with external weather link**
  - File: `src/components/CityCard.tsx`
  - Action:
    - Import `getWeatherUrl` from `city-utils.ts`
    - Wrap card content in an `<a>` tag or add a "View Weather" link
    - Use `target="_blank" rel="noopener noreferrer"`
    - Add appropriate hover styles
  - Notes: Follow existing external link pattern from news section; add sr-only text "(opens in new tab)"

- [x] **Task 8: Add unit tests for new utilities**
  - File: `src/__tests__/lib/city-utils.test.ts` (new file)
  - Action: Add tests for:
    - `countryCodeToFlag`: "US" → 🇺🇸, "GB" → 🇬🇧, "FR" → 🇫🇷
    - `getWeatherUrl`: returns correct weather.com URL format
  - Notes: Follow existing Vitest patterns

- [x] **Task 9: Update CityCard tests**
  - File: `src/__tests__/components/CityCard.test.tsx`
  - Action: Add tests for:
    - Flag emoji generation from countryCode
    - Weather URL generation from lat/lon
  - Notes: Test data transformations, not rendering

- [x] **Task 10: Verify build and run tests**
  - Action: Run `npm run build` and `npm run test:run`
  - Notes: Ensure no TypeScript errors and all tests pass

### Acceptance Criteria

- [x] **AC 1**: Given a city card is displayed, when I look at the city header, then I see the country's flag emoji displayed next to the city name

- [x] **AC 2**: Given a city card is displayed, when I click on the card (or the weather link), then a new browser tab opens to weather.com showing that city's weather using lat/lon coordinates

- [x] **AC 3**: Given the external weather link, when I inspect the HTML, then it has `target="_blank"` and `rel="noopener noreferrer"` attributes

- [x] **AC 4**: Given the cities data file, when I count the entries, then there are approximately 200 cities total (50 existing + 150 new)

- [x] **AC 5**: Given the new cities, when I check their distribution, then approximately 100 are US cities and 50 are European cities

- [x] **AC 6**: Given any city in the list, when the app fetches weather data, then historical averages are available (no null returns from `getHistoricalAverage`)

- [x] **AC 7**: Given the City type, when I inspect it, then it includes a `countryCode` field of type string

- [x] **AC 8**: Given the countryCodeToFlag function, when called with "US", then it returns "🇺🇸"

- [x] **AC 9**: Given the application, when I run `npm run build`, then it completes without TypeScript errors

- [x] **AC 10**: Given the test suite, when I run `npm run test:run`, then all tests pass

## Additional Context

### Dependencies

None - no new packages required. All functionality uses native JavaScript/TypeScript.

### Testing Strategy

1. **Unit Tests (new file: `src/__tests__/lib/city-utils.test.ts`)**
   - Test `countryCodeToFlag` with various country codes
   - Test `getWeatherUrl` returns correct URL format

2. **Integration Tests (update: `src/__tests__/components/CityCard.test.tsx`)**
   - Test flag emoji derivation in card context
   - Test weather URL generation with city coordinates

3. **Manual Testing**
   - Verify flag emojis display correctly in browser
   - Click city cards and confirm weather.com opens with correct location
   - Spot-check historical averages for new cities

### Notes

**Implementation Details:**
- Flag emoji formula: `countryCodeToFlag(code: string) => String.fromCodePoint(...[...code.toUpperCase()].map(c => c.charCodeAt(0) + 127397))`
- Weather URL format: `https://weather.com/weather/today/l/${lat},${lon}`

**Country Code Mapping for Existing Cities:**
- "USA" → "US"
- "UK" → "GB" (ISO standard)
- "Canada" → "CA"
- "Mexico" → "MX"
- "Brazil" → "BR"
- "Argentina" → "AR"
- (etc. - full mapping needed for all 50 existing cities)

**Risk Considerations:**
- Large data file changes (cities.ts, historical-averages.ts) - ensure proper formatting
- Historical averages must match city names exactly or anomaly calculation fails
- Weather.com URL format may change - consider fallback strategy in future

## Review Notes

- Adversarial review completed
- Findings: 15 total, 6 fixed, 9 skipped (noise/undecided)
- Resolution approach: auto-fix

**Fixed Issues:**
- F1: Added input validation to `countryCodeToFlag` (returns empty string for invalid input)
- F2: Fixed Hong Kong country/countryCode inconsistency (country now "Hong Kong")
- F3: Added edge-case tests for invalid inputs to both utility functions
- F4: Added coordinate validation to `getWeatherUrl` (returns empty string for out-of-range)
- F10: Renamed "Birmingham" to "Birmingham (Alabama)" to avoid collision with UK city
- F12: Added data integrity tests verifying all cities have matching historical data
