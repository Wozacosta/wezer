# TODO

## Historical Temperature Data

**Task:** Replace manually curated temperature averages with real climate data.

Currently, `src/lib/historical-averages.ts` uses hand-coded monthly averages interpolated into daily values. These should be replaced with actual historical climate normals.

### Potential Data Sources

**Open-Meteo Historical Weather API**
- URL: https://open-meteo.com/en/docs/historical-weather-api
- Provides hourly/daily historical data from 1940 to present
- Free, no API key required
- Could query 30 years of data per city and compute averages
- Same API already used for current weather

**NOAA Climate Normals**
- URL: https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals
- Official 30-year climate normals (1991-2020)
- High quality but US-focused
- International data available via Global Historical Climatology Network (GHCN)

**World Bank Climate Data API**
- URL: https://climateknowledgeportal.worldbank.org/
- Monthly averages by country/region
- Good for baseline validation

**Copernicus Climate Data Store**
- URL: https://cds.climate.copernicus.eu/
- ERA5 reanalysis data (1950-present)
- Requires free registration
- Comprehensive global coverage

### Implementation Approach

1. **Build-time generation:** Create a script that fetches historical data from Open-Meteo for each city and computes daily averages across multiple years
2. **Store as static JSON:** Generate `historical-averages.json` at build time
3. **Update footer:** Link to actual data source once implemented

### Open-Meteo Example Query

```
https://archive-api.open-meteo.com/v1/archive?
  latitude=40.71&longitude=-74.01
  &start_date=1993-01-01&end_date=2023-12-31
  &daily=temperature_2m_mean
  &timezone=UTC
```

This would return ~30 years of daily mean temperatures for New York, which could be averaged by day-of-year to get climate normals.
