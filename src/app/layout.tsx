import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wezer - Global Weather Anomalies",
  description:
    "Track cities with the biggest temperature deviations from historical averages. Discover weather anomalies happening around the world right now.",
  keywords: ["weather", "anomalies", "temperature", "climate", "global"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-900 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
