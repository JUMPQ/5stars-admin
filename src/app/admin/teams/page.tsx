
"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function TeamsPage() {
  // const [registrations, setRegistrations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [unverifiedTeams, setUnverifiedTeams] = useState<any[]>([]);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all teams, unverified teams, and pending change requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsResponse = await api.get("/public/teams");
        setTeams(teamsResponse.data);
        try {
          const unverifiedResponse = await api.get("/admin/unverified-teams");
          setUnverifiedTeams(unverifiedResponse.data);
        } catch (err: any) {
          console.warn("Unverified teams fetch failed (non-admin?):", err);
        }
        try {
          const changeRequestsResponse = await api.get(
            "/admin/pending-change-requests"
          );
          setChangeRequests(changeRequestsResponse.data);
        } catch (err: any) {
          console.warn("Change requests fetch failed (non-admin?):", err);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerifyTeam = async (teamId: string, verify: boolean) => {
    try {
      await api.put(`/admin/verify-team/${teamId}`, {
        action: verify ? "approve" : "reject",
      });
      setUnverifiedTeams((prev) => prev.filter((team) => team._id !== teamId));
      if (verify) {
        setTeams((prev) =>
          prev.map((team) =>
            team._id === teamId
              ? { ...team, isVerified: true, status: "verified" }
              : team
          )
        );
      } else {
        setTeams((prev) => prev.filter((team) => team._id !== teamId));
      }
      alert(`Team ${verify ? "verified" : "rejected"} successfully`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to process team verification"
      );
    }
  };

  const handleReviewChangeRequest = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await api.put(`/admin/review-change/${requestId}`, { status });
      setChangeRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
      if (status === "approved") {
        const request = changeRequests.find((r) => r._id === requestId);
        if (request) {
          setTeams((prev) =>
            prev.map((team) =>
              team._id === request.team._id
                ? {
                    ...team,
                    [request.type === "name" ? "name" : "logoUrl"]:
                      request.newValue,
                  }
                : team
            )
          );
        }
      }
      alert(`Change request ${status} successfully`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to process change request"
      );
    }
  };

  const settings = {
    dots: true,
    infinite: teams.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">
        Our Teams
      </h2>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-lg max-w-lg mx-auto text-sm sm:text-base">
          {error}
        </p>
      )}

      {/* All Teams */}
      {teams.length === 0 ? (
        <p className="text-gray-600 text-center text-base sm:text-lg">
          No teams available yet.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Mobile View: Single Column Flex */}
          <div className="block sm:hidden space-y-3">
            {teams.map((team) => (
              <div
                key={team._id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`${team._id}`)}
              >
                <img
                  src={team.logoUrl || "/default-logo.png"}
                  alt={team.name}
                  className="h-16 w-16 object-contain rounded-full border-2 border-gray-200 mr-4"
                />
                <p className="text-sm font-medium text-gray-800 flex-1">
                  {team.name}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop View: Carousel */}
          <div className="hidden sm:block">
            <Slider {...settings}>
              {teams.map((team) => (
                <div key={team._id} className="px-2">
                  <div
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer mx-auto max-w-xs"
                    onClick={() => router.push(`teams/${team._id}`)}
                  >
                    <img
                      src={team.logoUrl || "/default-logo.png"}
                      alt={team.name}
                      className="h-24 w-24 object-contain mb-3 rounded-full border-2 border-gray-200"
                    />
                    <p className="text-sm sm:text-base font-medium text-center text-gray-800 truncate w-full">
                      {team.name}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}

      {/* Unverified Teams (Admin Only) */}
      {unverifiedTeams.length > 0 && (
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Unverified Teams
            </h3>
          </div>
          <div className="space-y-3">
            {unverifiedTeams.map((team) => (
              <div
                key={team._id}
                className="flex flex-col items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800 text-sm sm:text-base mb-3 flex-1">
                  {team.name} (Coach: {team.headCoach?.name || "Unknown"})
                </span>
                <div className="flex gap-2 w-full justify-end">
                  <button
                    onClick={() => handleVerifyTeam(team._id, true)}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerifyTeam(team._id, false)}
                    className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Access Requests (Pending Change Requests, Admin Only) */}
      {changeRequests.length > 0 && (
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Edit Access Requests
            </h3>
          </div>
          <div className="space-y-3">
            {changeRequests.map((request) => (
              <div
                key={request._id}
                className="flex flex-col items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800 text-sm sm:text-base mb-3 flex-1">
                  {request.team.name} requested to change {request.type} to{" "}
                  {request.newValue} (by{" "}
                  {request.requestedBy?.name || "Unknown"})
                </span>
                <div className="flex gap-2 w-full justify-end">
                  <button
                    onClick={() =>
                      handleReviewChangeRequest(request._id, "approved")
                    }
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    Allow
                  </button>
                  <button
                    onClick={() =>
                      handleReviewChangeRequest(request._id, "rejected")
                    }
                    className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
