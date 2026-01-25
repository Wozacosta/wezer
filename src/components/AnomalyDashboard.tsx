'use client';

import { useState, useMemo } from 'react';
import { Anomaly, SortOption } from '@/types';
import { SortControls } from './SortControls';
import { AnomalyList } from './AnomalyList';

interface AnomalyDashboardProps {
  anomalies: Anomaly[];
}

function sortAnomalies(anomalies: Anomaly[], sortOption: SortOption): Anomaly[] {
  const sorted = [...anomalies];

  switch (sortOption) {
    case 'deviation-desc':
      return sorted.sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));
    case 'deviation-asc':
      return sorted.sort((a, b) => Math.abs(a.deviation) - Math.abs(b.deviation));
    case 'temp-desc':
      return sorted.sort((a, b) => b.currentTemp - a.currentTemp);
    case 'temp-asc':
      return sorted.sort((a, b) => a.currentTemp - b.currentTemp);
    case 'name-asc':
      return sorted.sort((a, b) => a.city.name.localeCompare(b.city.name));
    default:
      return sorted;
  }
}

export function AnomalyDashboard({ anomalies }: AnomalyDashboardProps) {
  const [sortOption, setSortOption] = useState<SortOption>('deviation-desc');

  const sortedAnomalies = useMemo(
    () => sortAnomalies(anomalies, sortOption),
    [anomalies, sortOption]
  );

  return (
    <div>
      <SortControls currentSort={sortOption} onSortChange={setSortOption} />
      <AnomalyList anomalies={sortedAnomalies} />
    </div>
  );
}
