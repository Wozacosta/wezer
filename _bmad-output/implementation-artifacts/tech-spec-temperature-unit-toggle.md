---
title: 'Temperature Unit Toggle'
slug: 'temperature-unit-toggle'
created: '2026-01-25'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vitest']
files_to_modify: ['src/types/index.ts', 'src/context/TemperatureUnitContext.tsx', 'src/app/layout.tsx', 'src/components/Header.tsx', 'src/components/CityCard.tsx']
code_patterns: ['Functional components', 'Props interfaces above components', 'Tailwind for styling', 'Dark mode support via dark: prefix', 'ARIA accessibility attributes']
test_patterns: ['Vitest with describe/it/expect', 'Data transformation tests (not full component renders due to React 19 compatibility)', 'Test files in src/__tests__/ mirroring src/ structure']
---

# Tech-Spec: Temperature Unit Toggle

**Created:** 2026-01-25

## Overview

### Problem Statement

Users currently see all temperatures in Celsius only. US users especially would prefer Fahrenheit, and all users should be able to switch between units with their preference persisted.

### Solution

Add a toggle in the Header (near the title) to switch between °C and °F. Use React Context for state sharing, localStorage for persistence, and default to Fahrenheit for US locale, Celsius otherwise.

### Scope

**In Scope:**
- Toggle UI in Header component (near title)
- React Context for temperature unit state
- localStorage persistence of user preference
- Locale detection for smart defaults (US → °F, others → °C)
- Convert all 3 temperature displays in CityCard (current, average, deviation)

**Out of Scope:**
- Server-side unit preference storage
- Other locale customizations (date formats, etc.)
- Additional weather unit conversions (wind speed, etc.)

## Context for Development

### Codebase Patterns

- **Component Style**: Functional components with TypeScript interfaces for props
- **Styling**: Tailwind CSS with dark mode support (`dark:` prefix classes)
- **Accessibility**: ARIA attributes used throughout (aria-label, aria-describedby, sr-only)
- **File Structure**: Components in `src/components/`, types in `src/types/index.ts`
- **No Existing Providers**: No context providers exist yet - `layout.tsx` wraps children directly in body
- **Client/Server Split**: page.tsx is server component, child components are client-side

### Files to Reference

| File | Purpose |
| ---- | ------- |
| src/components/Header.tsx | Add toggle UI near title - currently a simple presentational component |
| src/components/CityCard.tsx | Convert temperature displays - uses `toFixed(1)` for formatting, has dark mode support |
| src/types/index.ts | Add TemperatureUnit type - already has SortOption type pattern to follow |
| src/app/layout.tsx | Wrap app with TemperatureUnitProvider |
| src/__tests__/components/CityCard.test.tsx | Test pattern reference - tests data transformations, not full renders |

### Technical Decisions

- **State Management**: React Context for sharing unit preference across components
- **Persistence**: localStorage for saving user preference
- **Default Logic**: Detect US locale via `navigator.language` → default Fahrenheit if 'en-US', else Celsius
- **Conversion**: All temperature values (current, average, deviation) will be converted
- **Provider Location**: New provider wraps children in layout.tsx (must be client component)
- **Header as Client Component**: Header must become 'use client' to access context

## Implementation Plan

### Tasks

- [x] **Task 1: Add TemperatureUnit type**
  - File: `src/types/index.ts`
  - Action: Add `TemperatureUnit` type alias following existing `SortOption` pattern
  - Details: `export type TemperatureUnit = 'celsius' | 'fahrenheit';`

- [x] **Task 2: Create TemperatureUnitContext**
  - File: `src/context/TemperatureUnitContext.tsx` (new file)
  - Action: Create React Context with provider, hook, and utility functions
  - Details:
    - Create context with `unit` state and `toggleUnit` function
    - Add `celsiusToFahrenheit(celsius: number): number` utility
    - Add `formatTemperature(celsius: number, unit: TemperatureUnit): string` utility (returns formatted string with unit symbol)
    - Initialize from localStorage on mount, fallback to locale detection
    - Locale detection: check if `navigator.language` starts with 'en-US' → fahrenheit, else celsius
    - Persist to localStorage on unit change
    - Export `useTemperatureUnit` hook
    - Must be 'use client' component

- [x] **Task 3: Create Providers wrapper component**
  - File: `src/components/Providers.tsx` (new file)
  - Action: Create client-side wrapper that includes TemperatureUnitProvider
  - Details:
    - 'use client' directive
    - Wrap children with TemperatureUnitProvider
    - This keeps layout.tsx as a server component

- [x] **Task 4: Integrate Providers in layout**
  - File: `src/app/layout.tsx`
  - Action: Wrap `{children}` with the new `Providers` component
  - Details: Import Providers from `@/components/Providers` and wrap children

- [x] **Task 5: Add toggle UI to Header**
  - File: `src/components/Header.tsx`
  - Action: Add 'use client', import context hook, add toggle button near title
  - Details:
    - Add 'use client' directive at top
    - Import and use `useTemperatureUnit` hook
    - Add toggle button styled as `°C | °F` with current unit highlighted
    - Position inline with or near the h1 title
    - Include aria-label for accessibility (e.g., "Switch to Fahrenheit" or "Switch to Celsius")
    - Use Tailwind classes matching existing dark mode patterns

- [x] **Task 6: Convert temperatures in CityCard**
  - File: `src/components/CityCard.tsx`
  - Action: Add 'use client', use context hook, convert all temperature displays
  - Details:
    - Add 'use client' directive at top
    - Import `useTemperatureUnit` and `formatTemperature` from context
    - Convert `currentTemp`, `avgTemp`, and `deviation` displays using `formatTemperature`
    - Update aria-label and sr-only text to use correct unit
    - Preserve existing deviation sign formatting (+/-)

- [x] **Task 7: Add unit tests for temperature utilities**
  - File: `src/__tests__/context/TemperatureUnitContext.test.ts` (new file)
  - Action: Test conversion and formatting utilities
  - Details:
    - Test `celsiusToFahrenheit`: 0°C → 32°F, 100°C → 212°F, -40°C → -40°F
    - Test `formatTemperature` with both units
    - Test locale detection logic (mock navigator.language)
    - Follow existing Vitest patterns

### Acceptance Criteria

- [x] **AC 1**: Given a user visits the app for the first time with US locale (en-US), when the page loads, then all temperatures display in Fahrenheit (°F)

- [x] **AC 2**: Given a user visits the app for the first time with non-US locale, when the page loads, then all temperatures display in Celsius (°C)

- [x] **AC 3**: Given a user is viewing temperatures in Celsius, when they click the unit toggle in the header, then all temperatures convert to Fahrenheit immediately

- [x] **AC 4**: Given a user is viewing temperatures in Fahrenheit, when they click the unit toggle in the header, then all temperatures convert to Celsius immediately

- [x] **AC 5**: Given a user changes their unit preference, when they refresh the page or return later, then the app remembers their preference via localStorage

- [x] **AC 6**: Given temperatures are displayed in Fahrenheit, when viewing a city card, then current temp, average temp, AND deviation all show in °F with correct conversion

- [x] **AC 7**: Given a positive deviation in Celsius (e.g., +5.0°C), when converted to Fahrenheit, then it displays with + sign and correct conversion (e.g., +9.0°F)

- [x] **AC 8**: Given the toggle button in the header, when using a screen reader, then it announces the current state and action (e.g., "Switch to Fahrenheit")

## Additional Context

### Dependencies

None - using built-in React Context and browser localStorage APIs only.

### Testing Strategy

- **Unit Tests**: Test `celsiusToFahrenheit` and `formatTemperature` utility functions
- **Unit Tests**: Test locale detection logic with mocked `navigator.language`
- **Unit Tests**: Test localStorage read/write behavior
- **Manual Testing**: 
  1. Clear localStorage, set browser to en-US locale, verify Fahrenheit default
  2. Clear localStorage, set browser to other locale, verify Celsius default
  3. Toggle unit and verify all temperatures update
  4. Refresh page and verify preference persists
  5. Test in dark mode to verify styling

### Notes

- **Conversion formula**: °F = °C × 9/5 + 32 (for deviation, same formula applies since it's a delta)
- **Deviation conversion**: A +5°C deviation = +9°F deviation (multiply by 9/5, no +32 since it's relative)
- **Hydration**: Since localStorage is client-only, there may be a brief flash on initial load. Consider initializing with a default and updating after hydration.
- **Future enhancement**: Could add automatic detection based on IP geolocation (out of scope)

## Review Notes

- Adversarial review completed
- Findings: 12 total, 11 fixed, 1 skipped (noise)
- Resolution approach: auto-fix

### Fixes Applied
- F1 [Critical]: Fixed hydration mismatch by returning null until initialized
- F2 [High]: Added try/catch around localStorage access
- F3 [High]: Added tests for localStorage utilities
- F4 [High]: Updated CityCard tests to use actual formatting functions
- F5 [Medium]: Added Header component tests
- F6 [Medium]: Improved locale detection (case-insensitive, more locales)
- F7 [Medium]: Added visible focus indicator to toggle button
- F8 [Medium]: Suppressed content flash during initialization
- F9 [Low]: Simplified screen reader text
- F10 [Low]: Moved utility functions to separate src/lib/temperature.ts file
- F11 [Low]: Added role='switch' and aria-checked to toggle button

### Skipped
- F12 [Noise]: Unused variable in test (cleaned up during refactor)
