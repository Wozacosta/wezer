"use client";

import { ReactNode } from "react";
import { TemperatureUnitProvider } from "@/context/TemperatureUnitContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <TemperatureUnitProvider>{children}</TemperatureUnitProvider>;
}
