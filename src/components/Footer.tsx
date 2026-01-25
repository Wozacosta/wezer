export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2 font-medium text-gray-600 dark:text-gray-300">
          Data Sources
        </p>
        <ul className="space-y-1">
          <li>
            Weather data from{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Open-Meteo
            </a>
          </li>
          <li>
            News articles from{" "}
            <a
              href="https://gnews.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              GNews
            </a>
          </li>
          <li>Historical averages based on typical climate patterns</li>
        </ul>
      </div>
    </footer>
  );
}
