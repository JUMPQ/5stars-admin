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
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading team...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Team not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Error message */}
      {error && (
        <p className="text-red-500 text-center mb-8 bg-red-50 p-4 rounded-lg max-w-2xl mx-auto">
          {error}
        </p>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Team Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={team.logoUrl || "/default-logo.png"}
              alt={team.name}
              className="h-24 w-24 sm:h-32 sm:w-32 object-contain rounded-full border-2 border-gray-200"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {team.name}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base"
            >
              Delete Team
            </button>
            <button
              onClick={handleToggleEdit}
              className={`px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${
                allowEdit
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {allowEdit ? "Revoke Edit Access" : "Allow Edit Access"}
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Team Name</p>
            <p className="text-gray-800 font-medium">{team.name}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Number of Players</p>
            <p className="text-gray-800 font-medium">
              {team.playersCount || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Date Created</p>
            <p className="text-gray-800 font-medium">
              {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Head Coach</p>
            <p className="text-gray-800 font-medium">
              {team.headCoach?.name || "Unknown"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-gray-800 font-medium">{team.status}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-gray-800 font-medium">
              {team.isVerified ? "Yes" : "No"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Edit Access</p>
            <p className="text-gray-800 font-medium">
              {team.editAllowed ? "Allowed" : "Not Allowed"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
