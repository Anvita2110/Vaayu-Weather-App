"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const POPULAR_CITIES = [
  "India",
  "New York",
  "Tokyo",
  "Switzerland",
  "Sydney",
  "Dubai",
  "Peru",
  "Egypt",
  "Italy",
];

export default function HomePage() {
  const [city, setCity] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Defer localStorage → state to avoid hydration mismatches.
    const id = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("recentSearches");
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentSearches(parsed as string[]);
      } catch {
        // ignore
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  const handleSearch = (searchCity: string) => {
    if (!searchCity.trim()) return;

    const updated = [
      searchCity,
      ...recentSearches.filter((c) => c !== searchCity),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    router.push(`/weather?city=${encodeURIComponent(searchCity)}`);
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    handleSearch(city);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 font-sans">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/vayu_bg.jpg')" }}
      />

      <main className="relative min-h-screen flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">
              Welcome to
            </h1>
            <h2 className="text-5xl sm:text-7xl font-semibold text-white mb-5 sm:mb-8">
              Vayu
            </h2>
            <p className="text-base sm:text-xl text-white/90">
              Your real-time weather companion
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full text-base sm:text-lg bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:outline-none focus:border-white shadow-lg placeholder-zinc-500 text-black"
              />
              <button
                type="submit"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl mb-6">
            <h3 className="text-lg font-semibold text-zinc-800 mb-4">
              Popular Cities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {POPULAR_CITIES.map((popularCity) => (
                <button
                  key={popularCity}
                  onClick={() => handleSearch(popularCity)}
                  className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-800 font-medium transition-colors"
                >
                  {popularCity}
                </button>
              ))}
            </div>
          </div>

          {recentSearches.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-zinc-800">
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((recentCity, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(recentCity)}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-800 font-medium transition-colors"
                  >
                    {recentCity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
