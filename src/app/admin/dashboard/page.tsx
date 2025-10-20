"use client";

import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import api from "@/utils/api"; // Import API utility

interface Competition {
  _id: string;
  name: string;
  banner?: string;
}

interface DashboardData {
  totalCompetitions: number;
  ongoingCompetitions: Competition[];
  totalTeams: number;
  unverifiedTeams: number;
  pendingChangeRequests: number;
  adminStatus: string;
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCompetitions: 0,
    ongoingCompetitions: [],
    totalTeams: 0,
    unverifiedTeams: 0,
    pendingChangeRequests: 0,
    adminStatus: "Pending",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setDashboardData(response.data);
        // Save to localStorage for fallback (optional)
        localStorage.setItem(
          "competitions",
          JSON.stringify(response.data.ongoingCompetitions)
        );
      } catch (err: any) {
        console.error("Fetch dashboard error:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
        // Fallback to localStorage
        const stored = localStorage.getItem("competitions");
        if (stored) {
          setDashboardData((prev) => ({
            ...prev,
            ongoingCompetitions: JSON.parse(stored),
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(dashboardData.ongoingCompetitions.length, 3) || 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "20px",
  };

  if (loading) {
    return (
      <p className="p-6 text-gray-600 text-center">Loading dashboard...</p>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100">
      {/* Error message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-10 w-full gap-4">
        {/* Add Competition */}
        <Link
          href="/admin/addcompetition"
          className="col-span-3 bg-red-500 text-white p-6 hover:bg-red-600 transition duration-250"
        >
          <div className="text-center mb-2">Add Competition</div>
          <div className="text-center text-2xl">+</div>
        </Link>

        {/* Total Competitions */}
        <div className="rounded-md text-gray-800 text-center col-span-2 border-2 border-gray-400 bg-white p-6 shadow">
          <h2 className="text-sm text-gray-600">Total Competitions</h2>
          <p className="mt-2 text-2xl font-semibold">
            {dashboardData.totalCompetitions}
          </p>
        </div>

        {/* Total Teams */}
        <div className="rounded-md text-gray-800 text-center col-span-2 border-2 border-gray-400 bg-white p-6 shadow">
          <h2 className="text-sm text-gray-600">Total Teams</h2>
          <p className="mt-2 text-2xl font-semibold">
            {dashboardData.totalTeams}
          </p>
        </div>

        {/* Admin Status */}
        <div className="rounded-md border-2 border-green-500 text-center col-span-3 bg-white p-6 text-gray-800 shadow">
          <h2 className="mb-1 text-sm text-gray-600">Admin Status</h2>
          <span className="p-2 rounded-md bg-green-100 text-green-700 text-sm font-bold">
            Verified
          </span>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Ongoing Competitions */}
        <div className="lg:col-span-7 rounded-lg border-2 border-gray-400 bg-white p-6 shadow">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">
            Ongoing Competitions
          </h2>
          <div className="relative">
            {dashboardData.ongoingCompetitions.length > 0 ? (
              <Slider {...settings}>
                {dashboardData.ongoingCompetitions.map((comp) => (
                  <div key={comp._id} className="px-2">
                    <div
                      onClick={() =>
                        (window.location.href = `competitions/${comp._id}`)
                      }
                      className="cursor-pointer bg-gray-600 rounded-lg overflow-hidden shadow-sm"
                    >
                      {/* Banner with centered button */}
                      <div className="h-40 relative flex items-center justify-center overflow-hidden">
                        {comp.banner ? (
                          <img
                            src={comp.banner}
                            alt={comp.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-200">No Banner</span>
                        )}

                        {/* Competition Name */}
                        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-fit h-fit px-2 py-1 rounded-md border border-yellow-400 bg-white text-gray-800 hover:bg-yellow-400 hover:text-gray-900 transition">
                          {comp.name || "Untitled Competition"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="h-40 flex items-center justify-center bg-gray-600 rounded-lg">
                <span className="text-gray-200 font-medium">
                  No competitions in progress
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Important Info */}
        <div className="rounded-lg col-span-3 border border-gray-400 bg-white p-6 shadow row-span-2">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">
            Important Info
          </h2>
          <p className="text-gray-600 text-sm">
            Updates, announcements, or key details can go here.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="rounded-lg col-span-7 border border-gray-400 bg-white p-6 shadow">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Ads</h2>
          <div className="h-32 flex items-center justify-center bg-gray-100 text-gray-600 rounded">
            Ad placement
          </div>
        </div>
      </div>
    </div>
  );
}
