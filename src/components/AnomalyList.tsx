import { Anomaly } from '@/types';
import { CityCard } from './CityCard';

interface AnomalyListProps {
  anomalies: Anomaly[];
}

export function AnomalyList({ anomalies }: AnomalyListProps) {
  if (anomalies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No weather data available at the moment.
        </p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-label="List of cities with weather anomalies"
    >
      {anomalies.map((anomaly) => (
        <li key={anomaly.city.name}>
          <CityCard anomaly={anomaly} />
        </li>
      ))}
    </ul>
  );
}
