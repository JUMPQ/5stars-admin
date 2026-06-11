// app/admin/teams/[id]/page.tsx  (or wherever it is)
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { format } from "date-fns";

interface Player {
  _id: string;
  fullName: string;
  dob?: string;
  nationality?: string;
  jerseyNumber?: string;
  position?: string;
  nationalId?: string;
  passportPhoto?: string;
  parentalConsent?: string;
  medicalDoc?: string;
}

interface Team {
  _id: string;
  name: string;
  logoUrl?: string;
  playersCount?: number;
  createdAt: string;
  headCoach?: { name: string };
  status: string;
  isVerified: boolean;
  editAllowed: boolean;
}

export default function TeamProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "players">("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allowEdit, setAllowEdit] = useState(false);

  // Fetch team + players
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, playersRes] = await Promise.all([
          api.get(`/admin/teams/${id}`),
          api.get(`/admin/teams/${id}/players`), // NEW ENDPOINT
        ]);

        setTeam(teamRes.data);
        setPlayers(playersRes.data);
        setAllowEdit(teamRes.data.editAllowed || false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this team and all players?")) return;
    try {
      await api.delete(`/admin/teams/${id}`);
      alert("Team deleted");
      router.push("/admin/teams");
    } catch (err: any) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleToggleEdit = async () => {
    try {
      const newVal = !allowEdit;
      await api.put(`/admin/teams/${id}/edit-access`, { allow: newVal });
      setAllowEdit(newVal);
      alert(`Edit access ${newVal ? "granted" : "revoked"}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Toggle failed");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!team) return <div className="p-8 text-center">Team not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded mb-6 max-w-4xl mx-auto text-center">
          {error}
        </p>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={team.logoUrl || "/default-logo.png"}
              alt={team.name}
              className="w-20 h-20 object-contain rounded-full border"
            />
            <h1 className="text-2xl sm:text-3xl font-bold">{team.name}</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Team
            </button>
            <button
              onClick={handleToggleEdit}
              className={`px-4 py-2 rounded text-white ${
                allowEdit ? "bg-yellow-600" : "bg-green-600"
              } hover:opacity-90`}
            >
              {allowEdit ? "Revoke Edit" : "Allow Edit"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "info"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            Team Info
          </button>
          <button
            onClick={() => setActiveTab("players")}
            className={`px-6 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "players"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            Players ({players.length})
          </button>
        </div>

        {/* TAB: Team Info */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Team Name", value: team.name },
              { label: "Players", value: team.playersCount || 0 },
              { label: "Created", value: new Date(team.createdAt).toLocaleDateString() },
              { label: "Head Coach", value: team.headCoach?.name || "—"},
              { label: "Status", value: team.status },
              { label: "Verified", value: team.isVerified ? "Yes" : "No" },
              { label: "Edit Access", value: team.editAllowed ? "Allowed" : "Not Allowed" },
            ].map((item) => (
              <div key={item.label} className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Players */}
        {activeTab === "players" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nationality</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jersey</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Files</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No players found.
                      </td>
                    </tr>
                  ) : (
                    players.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{p.fullName}</td>
                        <td className="px-4 py-3 text-sm">
                          {p.dob ? format(new Date(p.dob), "dd/MM/yy") : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm">{p.nationality || "—"}</td>
                        <td className="px-4 py-3 text-sm">{p.jerseyNumber || "—"}</td>
                        <td className="px-4 py-3 text-sm">{p.position || "—"}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2 flex-wrap">
                            {p.passportPhoto && (
                              <a
                                href={`http://localhost:5000${p.passportPhoto}`}
                                target="_blank"
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                Passport
                              </a>
                            )}
                            {p.parentalConsent && (
                              <a
                                href={`http://localhost:5000${p.parentalConsent}`}
                                target="_blank"
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                              >
                                Consent
                              </a>
                            )}
                            {p.medicalDoc && (
                              <a
                                href={`http://localhost:5000${p.medicalDoc}`}
                                target="_blank"
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                              >
                                Medical
                              </a>
                            )}
                            {!p.passportPhoto && !p.parentalConsent && !p.medicalDoc && "—"}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}