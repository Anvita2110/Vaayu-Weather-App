"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-zinc-50 font-sans">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/vayu_bg.jpg')" }}
      />
      
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl px-16 py-32">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">Welcome to</h1>
            <h2 className="text-8xl font-semibold text-white mb-8">Vayu</h2>
            <button
              onClick={() => router.push("/home")}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Let's Discover the Weather
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
