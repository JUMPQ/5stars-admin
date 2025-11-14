// app/competitions/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await api.get("/competitions/view");
        setCompetitions(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load competitions");
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">Competitions</h1>

      {competitions.length === 0 ? (
        <p className="text-center text-gray-600">No competitions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((comp) => (
            <Link
              key={comp._id}
              href={`/competitions/${comp._id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-300 relative">
                {comp.banner ? (
                  <img src={comp.banner} alt={comp.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Banner
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg">{comp.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}