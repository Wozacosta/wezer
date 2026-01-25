export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8" aria-busy="true">
      {/* Header skeleton */}
      <div className="mb-8 text-center">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse" />
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
      </div>

      {/* Sort controls skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4 animate-pulse"
          >
            {/* City name */}
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            {/* Country */}
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            {/* Temperature rows */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            {/* News section */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
