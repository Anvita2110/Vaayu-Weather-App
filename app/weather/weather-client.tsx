"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    air_quality: {
      pm2_5: number;
      pm10: number;
    };
  };
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetcher = async (url: string, city: string) => {
  const response = await axios.post(url, { city });
  return response.data;
};

export default function WeatherClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const city = searchParams.get("city");

  const [searchCity, setSearchCity] = useState("");

  const addToRecentSearches = (nextCity: string) => {
    const trimmed = nextCity.trim();
    if (!trimmed) return;

    const saved = localStorage.getItem("recentSearches");
    const existing: string[] = saved ? JSON.parse(saved) : [];
    const updated = [trimmed, ...existing.filter((c) => c !== trimmed)].slice(
      0,
      5
    );
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const { data: weather, error, isLoading } = useSWR<WeatherData>(
    city ? [`${BACKEND_URL}/weather/current`, city] : null,
    ([url, cityName]: [string, string]) => fetcher(url, cityName),
    {
      revalidateOnFocus: true,
      dedupingInterval: 60000,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      addToRecentSearches(searchCity);
      router.push(`/weather?city=${encodeURIComponent(searchCity)}`);
    }
  };

  const getAQILevel = (pm25: number) => {
    if (pm25 <= 12) return { level: "Good", color: "text-green-600" };
    if (pm25 <= 35.4) return { level: "Moderate", color: "text-yellow-600" };
    if (pm25 <= 55.4)
      return { level: "Unhealthy for Sensitive", color: "text-orange-600" };
    if (pm25 <= 150.4) return { level: "Unhealthy", color: "text-red-600" };
    return { level: "Hazardous", color: "text-purple-600" };
  };

  return (
    <div className="min-h-screen bg-[#A1E3F9] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#003285] mb-2">Vayu</h1>
          <p className="text-[#003285]">Real-time Weather Information</p>
        </div>

        <form onSubmit={handleSearch} className="mb-20">
          <div className="flex gap-6">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search another city..."
              className="flex-1 px-6 py-3 rounded-full text-lg bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:outline-none focus:border-white shadow-lg placeholder-zinc-500 text-black"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              Search
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center text-white text-xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="mt-4">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-xl text-center">
            Failed to fetch weather data. Please try again.
          </div>
        )}

        {weather && !isLoading && (
          <div className="space-y-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-zinc-800">
                  {weather.location.name}
                </h2>
                <p className="text-xl text-zinc-600">
                  {weather.location.region}, {weather.location.country}
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="text-7xl font-bold text-blue-600 mb-2">
                  {Math.round(weather.current.temp_c)}°C
                </div>
                <div className="text-2xl text-zinc-600">
                  {Math.round(weather.current.temp_f)}°F
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  {weather.current.condition.icon && (
                    <img
                      src={
                        weather.current.condition.icon.startsWith("//")
                          ? `https:${weather.current.condition.icon}`
                          : weather.current.condition.icon
                      }
                      alt={weather.current.condition.text}
                      className="w-16 h-16"
                    />
                  )}
                  <div className="text-2xl text-zinc-700 font-medium">
                    {weather.current.condition.text}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-zinc-800 mb-6">
                Air Quality
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f9f8d4] rounded-xl p-6">
                  <div className="text-sm text-zinc-600 mb-1">PM2.5</div>
                  <div className="text-3xl font-bold text-zinc-800 mb-2">
                    {weather.current.air_quality.pm2_5.toFixed(1)}
                  </div>
                  <div
                    className={`text-lg font-semibold ${getAQILevel(weather.current.air_quality.pm2_5).color}`}
                  >
                    {getAQILevel(weather.current.air_quality.pm2_5).level}
                  </div>
                </div>

                <div className="bg-[#f9f8d4] rounded-xl p-6">
                  <div className="text-sm text-zinc-600 mb-1">PM10</div>
                  <div className="text-3xl font-bold text-zinc-800">
                    {weather.current.air_quality.pm10.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-20">
              <button
                onClick={() => router.push("/home")}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        )}

        {!weather && !isLoading && !error && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center">
            <p className="text-xl text-zinc-600">
              Search for a city to see weather information
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

