---
title: 'Wezer - Weather Anomaly Tracker'
slug: 'wezer-weather-anomaly-tracker'
created: '2026-01-25'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - Next.js 15.1.0
  - React 19.0.0
  - TypeScript 5.7.0
  - pnpm
  - Vitest 2.1.0
  - Tailwind CSS 3.4.0
  - Open-Meteo API
  - GNews API
files_to_modify:
  - src/app/page.tsx
  - src/app/layout.tsx
  - src/app/loading.tsx
  - src/app/error.tsx
  - src/app/globals.css
  - src/components/CityCard.tsx
  - src/components/AnomalyList.tsx
  - src/components/SortControls.tsx
  - src/components/Header.tsx
  - src/components/ErrorMessage.tsx
  - src/lib/weather.ts
  - src/lib/news.ts
  - src/lib/cities.ts
  - src/lib/anomaly.ts
  - src/lib/historical-averages.ts
  - src/types/index.ts
code_patterns:
  - App Router (Next.js 15)
  - Server Components by default
  - Client Components only where interactivity needed (SortControls)
  - Tailwind CSS for styling
  - ISR with hourly revalidation
  - Environment variables for API keys
  - All temperatures in Celsius
  - All dates in UTC for consistency
test_patterns:
  - Vitest 2.1.0 + React Testing Library 16.x
  - Unit tests in src/__tests__/lib/
  - Component tests in src/__tests__/components/
  - Co-located test files with .test.ts extension
  - @vitejs/plugin-react 4.3.0 for React 19 compatibility
---

# Tech-Spec: Wezer - Weather Anomaly Tracker

**Created:** 2026-01-25

## Overview

### Problem Statement

It's difficult to spot unusual weather events happening globally without manually checking multiple weather sources and comparing against historical norms. Users interested in climate anomalies have no easy way to see which cities are experiencing significant temperature deviations right now.

### Solution

A dashboard that displays the top cities with the biggest temperature deviations from their historical averages, refreshed hourly. Each anomaly is paired with live news article links to provide context about what's happening in that location.

### Scope

**In Scope:**
- 50 curated cities worldwide with geographic diversity
- Statistical temperature deviation calculation (current temp vs historical average for this date)
- Hourly data refresh
- News article links for cities showing significant anomalies (top 3 only, due to rate limits)
- Responsive dashboard UI
- Client-side sort controls (by deviation, by temperature, by city name)
- Loading and error states
- Accessibility (WCAG 2.1 AA compliance)

**Out of Scope:**
- Event-based detection (snow in unusual places, rain patterns)
- Real-time streaming updates
- User-customizable city lists
- User authentication/accounts
- Historical trend charts
- Push notifications/alerts
- Fahrenheit toggle (Celsius only for MVP)

## Context for Development

### Codebase Patterns

**Confirmed Clean Slate** - Greenfield Next.js 15 project.

Conventions to establish:
- **App Router**: All routes under `src/app/`
- **Server Components**: Default for all components, add `"use client"` only when needed
- **Styling**: Tailwind CSS utility classes
- **Data Fetching**: `fetch()` with `next: { revalidate: 3600 }` for ISR
- **TypeScript**: Strict mode enabled
- **Imports**: Absolute imports via `@/` alias
- **Temperature Units**: Celsius throughout (Open-Meteo default)
- **Timezone Handling**: All dates calculated in UTC for consistency across global cities

### Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main dashboard (Server Component)
│   ├── layout.tsx            # Root layout
│   ├── loading.tsx           # Loading skeleton UI
│   ├── error.tsx             # Error boundary UI (Client Component)
│   └── globals.css           # Tailwind imports + global styles
├── components/
│   ├── CityCard.tsx          # Individual city anomaly card
│   ├── AnomalyList.tsx       # Grid of anomaly cards
│   ├── SortControls.tsx      # Client Component for sort dropdown
│   ├── Header.tsx            # App header with title + last updated
│   └── ErrorMessage.tsx      # Reusable error display component
├── lib/
│   ├── weather.ts            # Open-Meteo API client
│   ├── news.ts               # GNews API client
│   ├── cities.ts             # 50 cities dataset (name, country, lat, lon)
│   ├── anomaly.ts            # Deviation calculation + orchestration
│   └── historical-averages.ts # Pre-computed historical averages
├── types/
│   └── index.ts              # TypeScript interfaces
└── __tests__/
    ├── lib/
    │   ├── weather.test.ts
    │   ├── anomaly.test.ts
    │   └── news.test.ts
    └── components/
        └── CityCard.test.ts
```

### Files to Reference

| File | Purpose |
| ---- | ------- |
| Greenfield | No existing files - clean slate confirmed |

### Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Weather API | Open-Meteo | Free, no API key, 80+ years historical data |
| News API | GNews | 100 req/day free, production-viable with caching |
| Data fetching | Server Components + ISR | Hourly revalidation (3600s), minimal client JS |
| Styling | Tailwind CSS | Fast iteration, Next.js native support |
| API keys | `.env.local` | GNews requires key (`GNEWS_API_KEY`) |
| City data | Static in `lib/cities.ts` | 50 cities don't need a database |
| Historical averages | Pre-computed static data | Avoids 500+ API calls per refresh |
| News caching | 24-hour cache | GNews fetched once/day max, separate from weather ISR |
| Caching | Next.js fetch cache | Built-in ISR handles hourly refresh |
| Temperature | Celsius only | Open-Meteo default, simplifies MVP |
| Timezone | UTC everywhere | Consistent date calculation across all cities |
| Parallel requests | Promise.allSettled | Graceful partial failures |

## Implementation Plan

### Tasks

#### Phase 1: Project Setup

- [ ] **Task 1: Initialize Next.js 15 project with pnpm**
  - File: `package.json`, `tsconfig.json`, `next.config.ts`
  - Action: Run `pnpm create next-app@latest wezer --typescript --tailwind --eslint --app --src-dir --use-pnpm`
  - Notes: Accept defaults for import alias (@/*)

- [ ] **Task 2: Configure Vitest for testing**
  - File: `vitest.config.ts`, `vitest.setup.ts`, `package.json`
  - Action: Install and configure Vitest with React 19 support
  - Notes: 
    ```bash
    pnpm add -D vitest@2.1.0 @testing-library/react@16.0.0 @testing-library/jest-dom @vitejs/plugin-react@4.3.0 jsdom@24.0.0
    ```
    Create `vitest.config.ts`:
    ```typescript
    import { defineConfig } from 'vitest/config'
    import react from '@vitejs/plugin-react'
    
    export default defineConfig({
      plugins: [react()],
      test: {
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        globals: true,
      },
      resolve: {
        alias: { '@': '/src' }
      }
    })
    ```
    Create `vitest.setup.ts`:
    ```typescript
    import '@testing-library/jest-dom'
    ```
    Add to `package.json` scripts: `"test": "vitest", "test:run": "vitest run"`

- [ ] **Task 3: Pin dependency versions**
  - File: `package.json`
  - Action: Update dependencies to exact versions
  - Notes:
    ```json
    {
      "dependencies": {
        "next": "15.1.0",
        "react": "19.0.0",
        "react-dom": "19.0.0"
      }
    }
    ```

- [ ] **Task 4: Create environment configuration**
  - File: `.env.local`, `.env.example`
  - Action: Add `GNEWS_API_KEY` placeholder
  - Notes: `.env.example` for documentation (committed), `.env.local` gitignored

#### Phase 2: Type Definitions

- [ ] **Task 5: Define core TypeScript interfaces**
  - File: `src/types/index.ts`
  - Action: Create interfaces for City, WeatherData, Anomaly, NewsArticle, and API responses
  - Notes: 
    ```typescript
    // Core domain types
    export interface City {
      name: string;
      country: string;
      lat: number;
      lon: number;
      timezone: string; // e.g., "America/New_York" - for reference only, calcs use UTC
    }
    
    export interface WeatherData {
      temperature: number; // Celsius
      timestamp: Date;
    }
    
    export interface Anomaly {
      city: City;
      currentTemp: number;      // Celsius
      avgTemp: number;          // Historical average for this UTC date
      deviation: number;        // currentTemp - avgTemp (signed)
      news: NewsArticle[];
      fetchedAt: Date;          // For "last updated" display
    }
    
    export interface NewsArticle {
      title: string;
      url: string;
      source: string;
      publishedAt: string;
    }
    
    // API response types for runtime validation
    export interface OpenMeteoCurrentResponse {
      current?: {
        temperature_2m?: number;
        time?: string;
      };
    }
    
    export interface GNewsResponse {
      articles?: Array<{
        title?: string;
        url?: string;
        source?: { name?: string };
        publishedAt?: string;
      }>;
    }
    
    // Sort options
    export type SortOption = 'deviation-desc' | 'deviation-asc' | 'temp-desc' | 'temp-asc' | 'name-asc';
    ```

#### Phase 3: Data Layer

- [ ] **Task 6: Create cities dataset with pre-computed historical averages**
  - File: `src/lib/cities.ts`, `src/lib/historical-averages.ts`
  - Action: Export array of 50 City objects + historical average temps for each day of year
  - Notes:
    - `cities.ts`: Array of 50 cities with geographic diversity (all continents)
    - `historical-averages.ts`: Pre-computed average temps for each city for each day (1-366)
    - **Critical**: Historical averages are STATIC data computed once, not fetched at runtime
    - Format: `{ [cityName: string]: { [dayOfYear: number]: number } }`
    - Source data from Open-Meteo archive API offline, store as JSON
    - This eliminates 500+ API calls per refresh (50 cities × 10 years)

- [ ] **Task 7: Implement Open-Meteo weather client**
  - File: `src/lib/weather.ts`
  - Action: Create function `getCurrentWeather(city: City): Promise<WeatherData | null>`
  - Notes: 
    - Endpoint: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m`
    - Add runtime validation of response shape
    - Return `null` on error (don't throw)
    - Use `fetch()` with `{ next: { revalidate: 3600 } }` for ISR caching
    ```typescript
    function isValidResponse(data: unknown): data is OpenMeteoCurrentResponse {
      return typeof data === 'object' && data !== null && 'current' in data;
    }
    ```

- [ ] **Task 8: Implement GNews client with 24-hour caching**
  - File: `src/lib/news.ts`
  - Action: Create function `getNewsForCity(cityName: string): Promise<NewsArticle[]>`
  - Notes:
    - Endpoint: `https://gnews.io/api/v4/search?q={city}+weather+anomaly&token={API_KEY}&max=3&lang=en`
    - **Critical**: Use `{ next: { revalidate: 86400 } }` (24 hours) NOT 3600
    - This ensures max ~3 cities/day get fresh news = ~3 req/day, well under 100 limit
    - Return empty array on any error (429, network, malformed response)
    - Add runtime validation of response shape

- [ ] **Task 9: Implement anomaly calculation logic**
  - File: `src/lib/anomaly.ts`
  - Action: Create orchestration function `getAnomalies(): Promise<Anomaly[]>`
  - Notes:
    ```typescript
    export function calculateDeviation(current: number, historical: number): number {
      return Math.round((current - historical) * 10) / 10; // 1 decimal place
    }
    
    export function getUtcDayOfYear(date: Date): number {
      const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
      const diff = date.getTime() - start.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    export async function getAnomalies(): Promise<Anomaly[]> {
      const now = new Date();
      const dayOfYear = getUtcDayOfYear(now);
      
      // Fetch current weather for all cities in parallel
      const weatherResults = await Promise.allSettled(
        cities.map(city => getCurrentWeather(city))
      );
      
      // Build anomalies (skip failed fetches)
      const anomalies: Anomaly[] = [];
      weatherResults.forEach((result, i) => {
        if (result.status === 'fulfilled' && result.value) {
          const city = cities[i];
          const currentTemp = result.value.temperature;
          const avgTemp = historicalAverages[city.name][dayOfYear];
          anomalies.push({
            city,
            currentTemp,
            avgTemp,
            deviation: calculateDeviation(currentTemp, avgTemp),
            news: [], // Populated below for top 3 only
            fetchedAt: now,
          });
        }
      });
      
      // Sort by absolute deviation descending
      anomalies.sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));
      
      // Fetch news for TOP 3 anomalies only (rate limit protection)
      const top3 = anomalies.slice(0, 3);
      const newsResults = await Promise.allSettled(
        top3.map(a => getNewsForCity(a.city.name))
      );
      newsResults.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          top3[i].news = result.value;
        }
      });
      
      return anomalies;
    }
    ```

#### Phase 4: Components

- [ ] **Task 10: Create Header component**
  - File: `src/components/Header.tsx`
  - Action: Header with title, subtitle, and last-updated timestamp
  - Notes:
    - Server Component
    - Accept `lastUpdated: Date` prop
    - Display: "Last updated: {time} UTC"
    - ARIA: Use `<header role="banner">` and proper heading hierarchy

- [ ] **Task 11: Create CityCard component with accessibility**
  - File: `src/components/CityCard.tsx`
  - Action: Accessible card displaying city, temp, deviation, and news links
  - Notes:
    - Server Component
    - Color coding: Red bg for +deviation, Blue bg for -deviation
    - **Accessibility requirements:**
      - Use `<article>` with `aria-label="{city} weather anomaly"`
      - Ensure color contrast ratio >= 4.5:1 (use darker red/blue + white text)
      - Add `aria-describedby` linking to deviation explanation
      - News links: `target="_blank" rel="noopener noreferrer"` with visible external link indicator
    - Show deviation with sign: "+12.3°C" or "-8.1°C"
    - If no news, show "No recent news" text (not empty)

- [ ] **Task 12: Create AnomalyList component**
  - File: `src/components/AnomalyList.tsx`
  - Action: Responsive grid of CityCard components
  - Notes: 
    - Server Component
    - CSS Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
    - Accept `anomalies: Anomaly[]` prop
    - Use `<ul role="list">` with `<li>` wrappers for semantic markup

- [ ] **Task 13: Create SortControls component (Client Component)**
  - File: `src/components/SortControls.tsx`
  - Action: Dropdown to sort anomalies client-side
  - Notes:
    - **Must be Client Component** (`"use client"`)
    - Accept `anomalies: Anomaly[]` and `onSort: (sorted: Anomaly[]) => void`
    - Sort options: "Highest Deviation", "Lowest Deviation", "Hottest", "Coldest", "A-Z"
    - Use `<select>` with proper `<label>` for accessibility
    - Keyboard accessible

- [ ] **Task 14: Create ErrorMessage component**
  - File: `src/components/ErrorMessage.tsx`
  - Action: Reusable error display with retry option
  - Notes:
    - Server Component
    - Accept `message: string` prop
    - Include icon, message text, and "Try again" link (to current page)
    - ARIA: `role="alert"`

#### Phase 5: Pages & Layout

- [ ] **Task 15: Configure root layout**
  - File: `src/app/layout.tsx`
  - Action: Set up HTML structure, metadata, font (Inter)
  - Notes:
    - Include `lang="en"` on `<html>`
    - Meta description for SEO
    - Use `next/font/google` for Inter font

- [ ] **Task 16: Set up global styles**
  - File: `src/app/globals.css`
  - Action: Tailwind directives + custom properties for colors
  - Notes:
    - Define CSS custom properties for hot/cold colors (ensures consistency)
    - `--color-hot: #dc2626` (red-600), `--color-cold: #2563eb` (blue-600)
    - Ensure sufficient contrast for accessibility

- [ ] **Task 17: Create loading state**
  - File: `src/app/loading.tsx`
  - Action: Skeleton UI while data loads
  - Notes:
    - Show pulsing placeholder cards matching CityCard dimensions
    - Use Tailwind `animate-pulse` on gray backgrounds
    - ARIA: `aria-busy="true"` on container

- [ ] **Task 18: Create error boundary**
  - File: `src/app/error.tsx`
  - Action: Error UI with reset functionality
  - Notes:
    - **Must be Client Component** (`"use client"`)
    - Accept `error: Error` and `reset: () => void` props
    - Display user-friendly message (not raw error)
    - "Try again" button calls `reset()`
    - Log error to console for debugging

- [ ] **Task 19: Build main dashboard page**
  - File: `src/app/page.tsx`
  - Action: Server Component that fetches and displays anomalies
  - Notes:
    ```typescript
    import { getAnomalies } from '@/lib/anomaly';
    import { Header } from '@/components/Header';
    import { AnomalyList } from '@/components/AnomalyList';
    import { AnomalyDashboard } from '@/components/AnomalyDashboard';
    
    export default async function Home() {
      const anomalies = await getAnomalies();
      const lastUpdated = anomalies[0]?.fetchedAt ?? new Date();
      
      return (
        <main className="container mx-auto px-4 py-8">
          <Header lastUpdated={lastUpdated} />
          <AnomalyDashboard anomalies={anomalies} />
        </main>
      );
    }
    ```
    - `AnomalyDashboard` is a Client Component wrapper that handles sort state

- [ ] **Task 20: Create AnomalyDashboard client wrapper**
  - File: `src/components/AnomalyDashboard.tsx`
  - Action: Client Component managing sort state
  - Notes:
    - `"use client"`
    - Contains SortControls + AnomalyList
    - Uses `useState` for current sort, `useMemo` for sorted list
    - Passes sorted anomalies to AnomalyList

#### Phase 6: Testing

- [ ] **Task 21: Write unit tests for anomaly calculation**
  - File: `src/__tests__/lib/anomaly.test.ts`
  - Action: Test `calculateDeviation` and `getUtcDayOfYear`
  - Notes:
    - Test positive deviation (current > historical)
    - Test negative deviation (current < historical)
    - Test zero deviation
    - Test day of year calculation for Jan 1, Dec 31, leap year

- [ ] **Task 22: Write unit tests for weather client**
  - File: `src/__tests__/lib/weather.test.ts`
  - Action: Test response parsing and error handling
  - Notes:
    - Mock `fetch` globally
    - Test valid response parsing
    - Test malformed response returns null
    - Test network error returns null

- [ ] **Task 23: Write unit tests for news client**
  - File: `src/__tests__/lib/news.test.ts`
  - Action: Test response parsing and rate limit handling
  - Notes:
    - Mock `fetch` globally
    - Test valid response parsing
    - Test 429 response returns empty array
    - Test malformed response returns empty array

- [ ] **Task 24: Write component tests for CityCard**
  - File: `src/__tests__/components/CityCard.test.ts`
  - Action: Test rendering and accessibility
  - Notes:
    - Test hot anomaly renders with warm colors
    - Test cold anomaly renders with cool colors
    - Test news links render correctly
    - Test "No recent news" shows when news array empty
    - Test accessibility attributes present

### Acceptance Criteria

#### Core Functionality
- [ ] **AC1:** Given the app is loaded, when the page renders, then a list of cities with temperature anomalies is displayed sorted by absolute deviation (highest first)
- [ ] **AC2:** Given a city has a positive temperature deviation, when viewing its card, then the deviation is shown with a "+" prefix and warm color styling (red background)
- [ ] **AC3:** Given a city has a negative temperature deviation, when viewing its card, then the deviation is shown with a "-" prefix and cool color styling (blue background)
- [ ] **AC4:** Given the top 3 anomalies, when viewing their cards, then up to 3 news article links are displayed per card
- [ ] **AC5:** Given the page was loaded more than 1 hour ago, when refreshing, then fresh weather data is fetched (ISR revalidation)

#### Data Accuracy
- [ ] **AC6:** Given a city's current temperature and historical average, when deviation is calculated, then deviation = current - historical (signed, 1 decimal place)
- [ ] **AC7:** Given the cities dataset, when loaded, then exactly 50 cities from diverse global locations are available
- [ ] **AC8:** Given any city at any time, when calculating historical average, then the UTC date is used (not local timezone)

#### Error Handling
- [ ] **AC9:** Given the GNews API returns a rate limit error (429), when fetching news, then the city card displays "No recent news" (graceful degradation)
- [ ] **AC10:** Given the Open-Meteo API is unavailable for a city, when fetching weather, then that city is omitted from results (no crash)
- [ ] **AC11:** Given all weather fetches fail, when the page loads, then an error message with retry option is shown

#### UI/UX
- [ ] **AC12:** Given a mobile viewport (< 640px), when viewing the dashboard, then city cards display in a single column
- [ ] **AC13:** Given a desktop viewport (> 1024px), when viewing the dashboard, then city cards display in a 3-column grid
- [ ] **AC14:** Given the user clicks the sort dropdown, when selecting an option, then the anomaly list re-orders client-side without page reload
- [ ] **AC15:** Given the page is loading, when the user views the dashboard, then a skeleton loading UI is displayed

#### Accessibility
- [ ] **AC16:** Given a screen reader user, when navigating the page, then all interactive elements have accessible labels
- [ ] **AC17:** Given the color-coded cards, when viewed, then color contrast ratio meets WCAG 2.1 AA (>= 4.5:1)
- [ ] **AC18:** Given a keyboard user, when navigating the sort controls, then all options are reachable via Tab and selectable via Enter

## Additional Context

### Dependencies

```json
{
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "typescript": "5.7.0",
    "@types/node": "20.11.0",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "tailwindcss": "3.4.0",
    "postcss": "8.4.33",
    "autoprefixer": "10.4.17",
    "vitest": "2.1.0",
    "@testing-library/react": "16.0.0",
    "@testing-library/jest-dom": "6.6.0",
    "@vitejs/plugin-react": "4.3.0",
    "jsdom": "24.0.0",
    "eslint": "8.57.0",
    "eslint-config-next": "15.1.0"
  }
}
```

### Environment Variables

```bash
# .env.example
GNEWS_API_KEY=your_gnews_api_key_here
```

### API Reference

#### Open-Meteo Current Weather
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m
```
Response:
```json
{
  "current": {
    "time": "2026-01-25T12:00",
    "temperature_2m": 15.3
  }
}
```

#### GNews Search
```
GET https://gnews.io/api/v4/search
  ?q={city}+weather+anomaly
  &token={GNEWS_API_KEY}
  &max=3
  &lang=en
```
Response:
```json
{
  "articles": [
    {
      "title": "...",
      "url": "...",
      "source": { "name": "..." },
      "publishedAt": "2026-01-25T10:00:00Z"
    }
  ]
}
```

### Testing Strategy

| Test Type | Scope | Framework | Task |
|-----------|-------|-----------|------|
| Unit | `lib/anomaly.ts` - deviation math, UTC day calc | Vitest | Task 21 |
| Unit | `lib/weather.ts` - response parsing, error handling | Vitest + mocked fetch | Task 22 |
| Unit | `lib/news.ts` - response parsing, rate limit handling | Vitest + mocked fetch | Task 23 |
| Component | `CityCard` - rendering states, accessibility | Vitest + RTL | Task 24 |
| E2E | Full page load (optional future) | Playwright | - |

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| GNews rate limit (100/day) | Only fetch news for top 3 anomalies + 24-hour cache = max ~3 req/day |
| Open-Meteo downtime | Use `Promise.allSettled`, skip failed cities, show error only if ALL fail |
| Historical data accuracy | Pre-computed averages from 10 years of data, stored statically |
| Timezone confusion | All date calculations use UTC, documented in code comments |
| Color accessibility | Use Tailwind colors with verified 4.5:1+ contrast ratios |

### Pre-computed Historical Averages

**Important**: The historical averages in `src/lib/historical-averages.ts` must be generated ONCE as a build-time artifact, not fetched at runtime. 

To generate:
1. Use Open-Meteo archive API to fetch daily temps for each city for past 10 years
2. Calculate mean temp for each day-of-year (1-366)
3. Store as static TypeScript object

This is a one-time data preparation task, not part of runtime code.

### Notes

- **GNews rate limit**: 100 req/day. With 24-hour cache + top 3 only = ~3 req/day max. Safe margin.
- **Temperature units**: Celsius throughout. Open-Meteo returns Celsius by default.
- **Timezone handling**: All dates use UTC. `getUtcDayOfYear()` ensures consistent day calculation regardless of server timezone.
- **Historical averages**: Pre-computed static data. No runtime API calls for historical data.
- **Accessibility**: WCAG 2.1 AA compliance required. All colors tested for contrast.
- **Sort/filter**: Client-side only via React state. No server round-trip needed.
