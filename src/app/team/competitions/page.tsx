// src/app/competitions/page.tsx
import React from "react";

type Competition = {
  id: string;
  title: string;
  // add image/url/description as needed later
};

const COMPETITIONS: Competition[] = [
  { id: "1", title: "Corporate Stars League" },
  { id: "2", title: "5stars Premier League" },
];

function CompetitionCard({ title }: { title: string }) {
  return (
    <article
      className="relative bg-gray-300 rounded-xl h-48 md:h-56 flex items-end overflow-hidden"
      aria-label={title}
    >
      {/* If you want a background image later, replace the bg with an <img> absolutely positioned */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      {/* The pill label centered near the bottom */}
      <div className="w-full flex justify-center pb-6">
        <span className="inline-block bg-white/90 border border-black/20 rounded-full px-4 py-1 text-sm font-medium shadow-sm">
          {title}
        </span>
      </div>
    </article>
  );
}

export default function CompetitionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center font-semibold text-2xl mb-8">
            Available Competitions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPETITIONS.map((c) => (
              <CompetitionCard key={c.id} title={c.title} />
            ))}
          </div>

          {/* keep the large vertical whitespace like your screenshot */}
          <div className="h-32" />
        </div>
      </main>
    </div>
  );
}
