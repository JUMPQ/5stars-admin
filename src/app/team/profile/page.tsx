// app/team/profile/page.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";

type Team = {
  id: string;
  name: string;
  logo?: string;
};

export default function TeamProfilePage() {
  const [team] = useState<Team>({
    id: "bryan-fc",
    name: "Bryan FC",
    // replace with your image path or remote URL
    logo: "/images/arsenal-badge.png",
  });

  // basic info state (replace with real data sources)
  const [teamName, setTeamName] = useState(team.name);
  const [teamHeight, setTeamHeight] = useState("All");
  const [teamPosition, setTeamPosition] = useState("Any");
  const [teamCategory, setTeamCategory] = useState("First Team");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex">
        {/* Main content */}
        <main className="flex-1 p-8">
          {/* Top row: logo + team name on left, actions on the right */}
          <div className="flex items-start justify-between gap-6 mb-8">
            <div className="flex items-center gap-6">
              {/* Logo + name */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-white border">
                  {/* use next/image if you prefer */}
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-xl font-bold">{team.name}</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 rounded-md border border-slate-700 text-slate-700 font-semibold hover:bg-slate-50"
                onClick={() => alert("Manage team — implement flow")}
              >
                Manage Team
              </button>

              <button
                className="px-4 py-2 rounded-md border border-[#ED1E25] text-[#ED1E25] font-semibold hover:bg-red-50"
                onClick={() => alert("Request access — implement flow")}
              >
                Request Access To Edit
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 mb-6" />

          {/* Basic Information label */}
          <section className="mb-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Basic Information
            </h2>
          </section>

          {/* The row of selects (cards like in screenshot) */}
          <section>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px] w-full sm:w-auto">
                <label className="text-xs text-slate-500 mb-1 block">
                  Team Name
                </label>
                <select
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-[220px] px-3 py-2 rounded-md border bg-white shadow-sm"
                >
                  <option>{team.name}</option>
                  <option>Another Team</option>
                </select>
              </div>

              <div className="min-w-[200px] w-full sm:w-auto">
                <label className="text-xs text-slate-500 mb-1 block">
                  Team Height
                </label>
                <select
                  value={teamHeight}
                  onChange={(e) => setTeamHeight(e.target.value)}
                  className="w-[220px] px-3 py-2 rounded-md border bg-white shadow-sm"
                >
                  <option>All</option>
                  <option>U12</option>
                  <option>U15</option>
                </select>
              </div>

              <div className="min-w-[200px] w-full sm:w-auto">
                <label className="text-xs text-slate-500 mb-1 block">
                  Team Position
                </label>
                <select
                  value={teamPosition}
                  onChange={(e) => setTeamPosition(e.target.value)}
                  className="w-[220px] px-3 py-2 rounded-md border bg-white shadow-sm"
                >
                  <option>Any</option>
                  <option>Top</option>
                  <option>Mid</option>
                </select>
              </div>

              <div className="min-w-[200px] w-full sm:w-auto">
                <label className="text-xs text-slate-500 mb-1 block">
                  Category
                </label>
                <select
                  value={teamCategory}
                  onChange={(e) => setTeamCategory(e.target.value)}
                  className="w-[220px] px-3 py-2 rounded-md border bg-white shadow-sm"
                >
                  <option>First Team</option>
                  <option>Reserves</option>
                  <option>Academy</option>
                </select>
              </div>
            </div>
          </section>

          {/* Rest of page content can go here */}
          <div className="mt-10">
            {/* placeholder area for other content e.g. roster, management */}
            <div className="text-sm text-slate-500">
              Additional team details and content...
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
