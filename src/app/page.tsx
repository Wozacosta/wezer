import { getAnomalies } from "@/lib/anomaly";
import { Header } from "@/components/Header";
import { AnomalyDashboard } from "@/components/AnomalyDashboard";
import { ErrorMessage } from "@/components/ErrorMessage";

export default async function Home() {
  const anomalies = await getAnomalies();

  if (anomalies.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Header lastUpdated={new Date()} />
        <ErrorMessage message="Unable to fetch weather data. Please try again later." />
      </main>
    );
  }

  const lastUpdated = anomalies[0]?.fetchedAt ?? new Date();

  return (
    <main className="container mx-auto px-4 py-8">
      <Header lastUpdated={lastUpdated} />
      <AnomalyDashboard anomalies={anomalies} />
    </main>
  );
}
