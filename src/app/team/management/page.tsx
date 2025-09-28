"use client";
import React, { useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AddPlayerModal, { Player } from "@/components/AddPlayerModal";
import { Bell } from "lucide-react"; // optional icon usage
import CoachProfile from "@/components/CoachProfile";

// small helper to duplicate sample rows like your screenshot
const samplePlayer = (i: number): Player => ({
  id: String(i),
  fullName: "Gogo Jeffery",
  dob: "1995-10-20",
  nationality: "Nigerian",
  jerseyNumber: "7",
  position: "MidFielder",
  nationalId: "2****12333",
  passportPhoto: undefined,
  parentalConsent: undefined,
  medicalDoc: undefined,
});

const INITIAL_PLAYERS = Array.from({ length: 14 }).map((_, i) =>
  samplePlayer(i + 1)
);

/* --------- Coaches (simple) ---------- */
type Coach = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  badge?: string;
};

const INITIAL_COACHES: Coach[] = [
  { id: "c1", name: "Coach A", phone: "0801xxxxxxx", email: "coachA@team.com" },
  { id: "c2", name: "Coach B", phone: "0802xxxxxxx", email: "coachB@team.com" },
];

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState<"players" | "coaches">("players");
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [coaches, setCoaches] = useState<Coach[]>(INITIAL_COACHES);
  const [openAddPlayer, setOpenAddPlayer] = useState(false);
  const [query, setQuery] = useState("");

  const filteredPlayers = useMemo(() => {
    if (!query.trim()) return players;
    const q = query.toLowerCase();
    return players.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        p.jerseyNumber.toString().includes(q)
    );
  }, [players, query]);

  function handleAddPlayer(p: Player) {
    setPlayers((prev) => [p, ...prev]);
  }

  function handleDeletePlayer(id?: string) {
    if (!id) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  // dummy import/export handlers
  function handleImport() {
    // hook into file input or drop — placeholder
    alert("Import CSV/XLSX/PDF not implemented in this demo.");
  }
  function handleExport() {
    alert("Exporting team list... (hook up your backend)");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Tabs (Players / Coach) */}
            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={() => setActiveTab("players")}
                className={`px-6 py-2 rounded-full font-semibold ${
                  activeTab === "players"
                    ? "bg-[#ED1E25] text-white shadow-md"
                    : "bg-white border"
                }`}
              >
                Players Profile
              </button>
              <button
                onClick={() => setActiveTab("coaches")}
                className={`px-6 py-2 rounded-full font-semibold ${
                  activeTab === "coaches"
                    ? "border-b-2 border-[#ED1E25] text-[#111827]"
                    : "bg-white border"
                }`}
              >
                Coach Profile
              </button>
            </div>

            {activeTab === "players" ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Players Detail</h2>
                    <button
                      onClick={() => setOpenAddPlayer(true)}
                      className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                      Add Player
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleImport}
                        className="px-4 py-2 border rounded-lg flex items-center gap-2"
                      >
                        Import Team List (,.xlsx, .csv, .pdf)
                      </button>
                      <button
                        onClick={handleExport}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Export Team List
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search players..."
                        className="px-3 py-2 border rounded w-64"
                      />
                      <button
                        aria-label="search"
                        className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center"
                      >
                        🔍
                      </button>
                    </div>
                  </div>
                </div>

                {/* Players table */}
                <div className="overflow-auto border rounded">
                  <table className="min-w-full table-fixed">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="p-3 text-left">Full Name</th>
                        <th className="p-3 text-left">Date of Birth</th>
                        <th className="p-3 text-left">Nationality</th>
                        <th className="p-3 text-left">Jersey Number</th>
                        <th className="p-3 text-left">Position</th>
                        <th className="p-3 text-left">National ID</th>
                        <th className="p-3 text-left">Passport-Photo</th>
                        <th className="p-3 text-left">Parental Consent</th>
                        <th className="p-3 text-left">Medical Doc</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPlayers.map((p) => (
                        <tr
                          key={p.id}
                          className="odd:bg-white even:bg-slate-50"
                        >
                          <td className="p-3">{p.fullName}</td>
                          <td className="p-3">{formatDate(p.dob)}</td>
                          <td className="p-3">{p.nationality}</td>
                          <td className="p-3">{p.jerseyNumber}</td>
                          <td className="p-3">{p.position}</td>
                          <td className="p-3">{p.nationalId}</td>

                          <td className="p-3">
                            <button className="px-3 py-1 rounded bg-gray-400 text-sm">
                              img.jpg
                            </button>
                          </td>

                          <td className="p-3">
                            <button className="px-3 py-1 rounded bg-gray-400 text-sm">
                              Img.pdf
                            </button>
                          </td>

                          <td className="p-3">
                            <button className="px-3 py-1 rounded bg-gray-400 text-sm">
                              Medical Doc
                            </button>
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => alert("Edit not implemented")}
                                className="px-2 py-1 border rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePlayer(p.id)}
                                className="px-2 py-1 border rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredPlayers.length === 0 && (
                        <tr>
                          <td
                            colSpan={10}
                            className="p-6 text-center text-sm text-slate-500"
                          >
                            No players found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* spacing bottom like your screenshot */}
                <div className="h-32" />
              </>
            ) : (
              /* --- Coach Profile Tab --- */
              <CoachProfile coaches={coaches} setCoaches={setCoaches} />
            )}
          </div>
        </main>
      </div>

      <AddPlayerModal
        open={openAddPlayer}
        onClose={() => setOpenAddPlayer(false)}
        onAdd={handleAddPlayer}
      />
    </div>
  );
}

/* ---------- small helpers ---------- */
function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    // dd/mm/yy like screenshot
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  } catch {
    return iso;
  }
}
