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
        console.error("Fetch competitions error:", err);
        setError(err.response?.data?.message || "Failed to load competitions");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  if (loading) {
    return (
      <p className="text-gray-600 text-center mt-10">Loading competitions...</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-25 bg-gray-100">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Competitions
      </h1>

      {/* Error message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Grid of competitions */}
      {competitions.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No competitions added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
          {competitions.map((comp) => (
            <Link
              key={comp._id}
              href={`${comp._id}`}
              className="border border-gray-400 rounded-lg overflow-hidden hover:border-yellow-400 transition cursor-pointer"
            >
              {/* Banner */}
              <div className="h-full relative bg-gray-600 flex items-center justify-center overflow-hidden">
                {comp.banner ? (
                  <img
                    src={comp.banner}
                    alt={comp.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-200">No Banner</span>
                )}
                <button className="w-fit absolute bottom-4 px-2 py-1 rounded-md border border-yellow-400 bg-white text-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition">
                  {comp.name || "Untitled Competition"}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
