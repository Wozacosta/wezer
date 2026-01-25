'use client';

import { SortOption } from '@/types';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'deviation-desc', label: 'Highest Deviation' },
  { value: 'deviation-asc', label: 'Lowest Deviation' },
  { value: 'temp-desc', label: 'Hottest' },
  { value: 'temp-asc', label: 'Coldest' },
  { value: 'name-asc', label: 'A-Z' },
];

export function SortControls({ currentSort, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="block rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
