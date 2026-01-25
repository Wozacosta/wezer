# Wezer

Real-time weather anomaly tracking for global cities.

Wezer monitors temperature deviations from historical averages across 50 cities worldwide, highlighting locations experiencing unusual weather patterns and providing contextual news coverage.

## Features

- **Global Coverage** - Track 50 cities across North America, South America, Europe, Africa, Middle East, Asia, and Oceania
- **Real-Time Anomalies** - Compare current temperatures against historical daily averages
- **Contextual News** - Weather-related articles for top anomalies via GNews API
- **Flexible Sorting** - Sort by deviation, temperature, or alphabetically
- **Dark Mode** - Automatic theme based on system preferences
- **Accessible** - WCAG AA compliant with full keyboard navigation

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Testing:** Vitest + Testing Library
- **APIs:** Open-Meteo (weather), GNews (news)

## Getting Started

### Prerequisites

- Node.js (compatible with Next.js 16)
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wezer

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GNEWS_API_KEY` | No | API key for news integration. App works without it. |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once (CI mode) |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (server component)
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── AnomalyDashboard.tsx
│   ├── AnomalyList.tsx
│   ├── CityCard.tsx
│   └── SortControls.tsx
├── lib/                   # Core logic and API integrations
│   ├── anomaly.ts         # Deviation calculations
│   ├── weather.ts         # Open-Meteo API
│   ├── news.ts            # GNews API
│   ├── cities.ts          # City database
│   └── historical-averages.ts
├── types/                 # TypeScript interfaces
└── __tests__/            # Test files
```

## How It Works

1. **Data Fetching** - Server-side fetches current temperatures for all 50 cities in parallel
2. **Anomaly Calculation** - Compares each temperature against that city's historical average for the current day
3. **Sorting** - Client-side sorting with memoized calculations
4. **News Context** - Fetches related articles for the top 3 anomalies

### Caching Strategy

- **Weather data:** 1-hour ISR (Incremental Static Regeneration)
- **News data:** 24-hour cache to respect API rate limits

## Cities Covered

The application tracks 50 cities strategically distributed across climate zones:

| Region | Cities |
|--------|--------|
| North America | New York, Los Angeles, Chicago, Toronto, Mexico City, Miami |
| South America | São Paulo, Buenos Aires, Lima, Bogotá, Santiago |
| Europe | London, Paris, Berlin, Madrid, Rome, Moscow, Amsterdam, Stockholm, Athens, Istanbul |
| Africa | Cairo, Lagos, Johannesburg, Nairobi, Casablanca, Accra |
| Middle East | Dubai, Tel Aviv, Riyadh |
| Asia | Tokyo, Beijing, Shanghai, Hong Kong, Singapore, Mumbai, Delhi, Bangkok, Seoul, Jakarta, Manila, Hanoi, Karachi |
| Oceania | Sydney, Melbourne, Auckland, Perth |
| Extreme | Reykjavik, Anchorage, Timbuktu |

## Testing

```bash
# Run all tests
pnpm test:run

# Run tests in watch mode
pnpm test
```

Test coverage includes:

- Unit tests for deviation calculations
- API integration tests
- Component rendering tests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## BMAD Development

This project uses the [BMAD framework](./AGENTS.md) for AI-assisted development. See `AGENTS.md` for available agents and workflows.

## License

MIT
