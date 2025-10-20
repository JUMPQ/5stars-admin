"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function TeamsPage() {
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
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(teams.length || 1, 5),
    slidesToScroll: 1,
    arrows: true,
  };

  if (loading) {
    return <p className="text-gray-600 text-center mt-10">Loading teams...</p>;
  }

  return (
    <div className="p-16 bg-gray-100">
      <h2 className="text-2xl text-center font-semibold mb-16 text-gray-900">
        Teams
      </h2>

      {/* Error message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* All Teams Carousel */}
      {teams.length === 0 ? (
        <p className="text-gray-600 text-center">No teams yet.</p>
      ) : (
        <Slider {...settings}>
          {teams.map((team) => (
            <div key={team._id} className="!flex !justify-center">
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => router.push(`teams/${team._id}`)}
              >
                <img
                  src={team.logoUrl || "/default-logo.png"}
                  alt={team.name}
                  className="h-28 w-28 object-contain mb-2"
                />
                <p className="w-28 text-sm text-center text-gray-800">
                  {team.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {/* Unverified Teams (Admin Only) */}
      {unverifiedTeams.length > 0 && (
        <div className="mt-14">
          <div className="flex gap-4 items-center justify-center">
            <h3 className="text-md font-medium mb-2 text-gray-700">
              Unverified Teams
            </h3>
            <div className="flex-1 pb-1.5 border-t border-gray-400"></div>
          </div>
          <div className="space-y-2 mt-10">
            {unverifiedTeams.map((team) => (
              <div
                key={team._id}
                className="grid grid-cols-[350px_auto] items-center mt-2 pb-2 gap-4"
              >
                <span className="text-gray-800">
                  {team.name} (Coach: {team.headCoach?.name || "Unknown"})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerifyTeam(team._id, true)}
                    className="px-2 py-1 border border-red-500 text-gray-800 bg-white rounded-md hover:bg-yellow-400 hover:text-gray-900"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerifyTeam(team._id, false)}
                    className="px-2 py-1 border border-gray-400 text-gray-800 bg-white rounded-md hover:bg-red-500 hover:text-white"
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
        <div className="mt-14">
          <div className="flex gap-4 items-center justify-center">
            <h3 className="text-md font-medium mb-2 text-gray-700">
              Edit Access Requests
            </h3>
            <div className="flex-1 pb-1.5 border-t border-gray-400"></div>
          </div>
          <div className="space-y-2 mt-10">
            {changeRequests.map((request) => (
              <div
                key={request._id}
                className="grid grid-cols-[350px_auto] items-center mt-2 pb-2 gap-4"
              >
                <span className="text-gray-800">
                  {request.team.name} requested to change {request.type} to{" "}
                  {request.newValue} (by{" "}
                  {request.requestedBy?.name || "Unknown"})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleReviewChangeRequest(request._id, "approved")
                    }
                    className="px-2 py-1 border border-red-500 text-gray-800 bg-white rounded-md hover:bg-yellow-400 hover:text-gray-900"
                  >
                    Allow
                  </button>
                  <button
                    onClick={() =>
                      handleReviewChangeRequest(request._id, "rejected")
                    }
                    className="px-2 py-1 border border-gray-400 text-gray-800 bg-white rounded-md hover:bg-red-500 hover:text-white"
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
