import { City } from '@/types';

// 50 cities with global geographic diversity
export const cities: City[] = [
  // North America
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.006 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437 },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332 },
  { name: 'Miami', country: 'USA', lat: 25.7617, lon: -80.1918 },

  // South America
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816 },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lon: -77.0428 },
  { name: 'Bogotá', country: 'Colombia', lat: 4.711, lon: -74.0721 },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693 },

  // Europe
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.405 },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041 },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686 },
  { name: 'Athens', country: 'Greece', lat: 37.9838, lon: 23.7275 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784 },

  // Africa
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lon: 3.3792 },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lon: 28.0473 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lon: -7.5898 },
  { name: 'Accra', country: 'Ghana', lat: 5.6037, lon: -0.187 },

  // Middle East
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lon: 34.7818 },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753 },

  // Asia
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lon: 121.4737 },
  { name: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777 },
  { name: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.978 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456 },
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lon: 120.9842 },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0285, lon: 105.8542 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lon: 67.0011 },

  // Oceania
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631 },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8509, lon: 174.7645 },
  { name: 'Perth', country: 'Australia', lat: -31.9505, lon: 115.8605 },

  // Additional diverse locations
  { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426 },
  { name: 'Anchorage', country: 'USA', lat: 61.2181, lon: -149.9003 },
  { name: 'Timbuktu', country: 'Mali', lat: 16.7666, lon: -3.0026 },
];
