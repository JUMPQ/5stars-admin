"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function TeamProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowEdit, setAllowEdit] = useState(false);

  // Fetch team details
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get(`/admin/teams/${id}`);
        const teamData = response.data;
        console.log("Fetched team data:", teamData);
        setTeam(teamData);
        setAllowEdit(teamData.editAllowed || false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTeam();
  }, [id]);

  // Handle delete team
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      await api.delete(`/admin/teams/${id}`);
      alert("Team deleted successfully");
      router.push("/teams");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete team");
    }
  };

  // Handle toggle edit access
  const handleToggleEdit = async () => {
    try {
      const newAllowEdit = !allowEdit;
      await api.put(`/admin/teams/${id}/edit-access`, { allow: newAllowEdit });
      setAllowEdit(newAllowEdit);
      alert(
        `Edit access ${newAllowEdit ? "granted" : "revoked"} for ${team?.name}`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to toggle edit access");
    }
  };

  if (loading) {
    return <p className="p-6 text-white">Loading team...</p>;
  }

  if (!team) {
    return <p className="p-6 text-white">Team not found.</p>;
  }

  return (
    <div className="p-6 text-white">
      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-between">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={team.logoUrl || "/default-logo.png"}
            alt={team.name}
            className="h-32 w-32 object-contain"
          />
          <h1 className="text-2xl font-bold">{team.name}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-start gap-10 mb-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-pryRed text-pryRed rounded hover:bg-pryRed hover:text-white"
          >
            Delete Team
          </button>
          <button
            onClick={handleToggleEdit}
            className={`px-4 py-2 border rounded ${
              allowEdit
                ? "border-pryRed text-pryRed hover:bg-pryRed hover:text-white"
                : "border-pryGold text-pryGold hover:bg-pryGold hover:text-black"
            }`}
          >
            {allowEdit ? "Revoke Edit Access" : "Allow Edit Access"}
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-pryGrey p-4 rounded">
          <p className="text-sm text-gray-400">Team name</p>
          <p>{team.name}</p>
        </div>
        <div className="border border-pryGrey p-4 rounded">
          <p className="text-sm text-gray-400">Number of players</p>
          <p>{team.playersCount || 0}</p>
        </div>
        <div className="border border-pryGrey p-4 rounded">
          <p className="text-sm text-gray-400">Date created</p>
          <p>{new Date(team.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="border border-pryGrey p-4 rounded">
          <p className="text-sm text-gray-400">Head Coach</p>
          <p>{team.headCoach?.name || "Unknown"}</p>
        </div>
        <div className="border border-pryGrey p-4 rounded">
          <p className="text-sm text-gray-400">Status</p>
          <p>{team.status}</p>
        </div>
        <div className="border border-pryGrey p-4 rounded">
          <p className="text-sm text-gray-400">Verified</p>
          <p>{team.isVerified ? "Yes" : "No"}</p>
        </div>
        <div className="border border-pryGrey p-4 rounded">
          <p className="text-sm text-gray-400">Edit Access</p>
          <p>{team.editAllowed ? "Allowed" : "Not Allowed"}</p>
        </div>
      </div>
    </div>
  );
}
