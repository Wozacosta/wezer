interface HeaderProps {
  lastUpdated: Date;
}

export function Header({ lastUpdated }: HeaderProps) {
  const formattedTime = lastUpdated.toLocaleString('en-US', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header role="banner" className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Wezer
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        Global Weather Anomalies
      </p>
      <p
        className="text-sm text-gray-500 dark:text-gray-400"
        aria-label={`Data last updated at ${formattedTime} UTC`}
      >
        Last updated: {formattedTime} UTC
      </p>
    </header>
  );
}
