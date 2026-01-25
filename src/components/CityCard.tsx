"use client";

import Image from "next/image";
import { Anomaly } from "@/types";
import {
  useTemperatureUnit,
  formatTemperature,
  formatDeviation,
  deviationToFahrenheit,
} from "@/context/TemperatureUnitContext";

interface CityCardProps {
  anomaly: Anomaly;
}

export function CityCard({ anomaly }: CityCardProps) {
  const { unit } = useTemperatureUnit();
  const { city, currentTemp, avgTemp, deviation, news } = anomaly;
  const isHot = deviation > 0;
  const isCold = deviation < 0;

  // Format temperatures with appropriate unit
  const formattedCurrentTemp = formatTemperature(currentTemp, unit);
  const formattedAvgTemp = formatTemperature(avgTemp, unit);
  const formattedDeviation = formatDeviation(deviation, unit);

  // Get absolute deviation value for screen reader text
  const absDeviationValue =
    unit === "fahrenheit"
      ? Math.abs(deviationToFahrenheit(deviation)).toFixed(1)
      : Math.abs(deviation).toFixed(1);

  // Background color based on deviation (WCAG AA compliant contrast)
  const bgColorClass = isHot
    ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
    : isCold
      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
      : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700";

  // Text color for deviation (high contrast)
  const deviationColorClass = isHot
    ? "text-red-700 dark:text-red-300"
    : isCold
      ? "text-blue-700 dark:text-blue-300"
      : "text-gray-700 dark:text-gray-300";

  return (
    <article
      className={`rounded-lg border p-4 ${bgColorClass} transition-shadow hover:shadow-md`}
      aria-label={`${city.name} weather anomaly: ${formattedDeviation} from average`}
    >
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {city.name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {city.country}
        </p>
      </div>

      <div className="mb-4 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {formattedCurrentTemp}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Average
          </span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {formattedAvgTemp}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Deviation
          </span>
          <span
            className={`text-lg font-bold ${deviationColorClass}`}
            aria-describedby={`deviation-explanation-${city.name.replace(/\s+/g, "-")}`}
          >
            {formattedDeviation}
          </span>
        </div>
        <p
          id={`deviation-explanation-${city.name.replace(/\s+/g, "-")}`}
          className="sr-only"
        >
          {isHot
            ? `${city.name} is ${absDeviationValue} degrees warmer than usual`
            : isCold
              ? `${city.name} is ${absDeviationValue} degrees colder than usual`
              : `${city.name} is at its average temperature`}
        </p>
      </div>

      {/* News Section */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Related News
        </h3>
        {news.length > 0 ? (
          <ul className="space-y-2">
            {news.map((article, index) => (
              <li key={index}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  {article.image && (
                    <Image
                      src={article.image}
                      alt={`Thumbnail for: ${article.title}`}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded shrink-0"
                      unoptimized
                    />
                  )}
                  <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline flex items-start gap-1 min-w-0">
                    <span className="line-clamp-2">{article.title}</span>
                    <span className="shrink-0" aria-hidden="true">
                      ↗
                    </span>
                    <span className="sr-only">(opens in new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            No recent news
          </p>
        )}
      </div>
    </article>
  );
}
