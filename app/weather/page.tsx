import { Suspense } from "react";
import type { ReactNode } from "react";
import WeatherClient from "./weather-client";

export default function WeatherPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#A1E3F9] py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#003285] mb-2">Vayu</h1>
              <p className="text-[#003285]">Real-time Weather Information</p>
            </div>
            <div className="text-center text-white text-xl">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              <p className="mt-4">Loading weather page...</p>
            </div>
          </div>
        </div>
      }
    >
      <WeatherPageShell>
        <WeatherClient />
      </WeatherPageShell>
    </Suspense>
  );
}

function WeatherPageShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
