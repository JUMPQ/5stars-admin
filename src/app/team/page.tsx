// pages/teams.tsx (or app/teams/page.tsx)
import React from "react";

function StatCard({
  title,
  value,
  className = "",
}: {
  title: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border-2 p-6 flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-bold mt-3">{value}</div>
    </div>
  );
}

export default function TeamDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* PAGE CONTENT */}
      <main className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT - main content */}
          <div className="col-span-12 lg:col-span-9">
            {/* Top stats row */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 xl:col-span-6">
                <StatCard
                  title="Competitions Joined"
                  value={2}
                  className="bg-indigo-100 border-indigo-500 text-center"
                />
              </div>

              <div className="col-span-12 sm:col-span-3 md:col-span-2 lg:col-span-2">
                <StatCard
                  title="Coaches"
                  value={2}
                  className="bg-gray-200 border-black/80"
                />
              </div>

              <div className="col-span-12 sm:col-span-3 md:col-span-2 lg:col-span-2">
                <StatCard
                  title="Players"
                  value={13}
                  className="bg-gray-200 border-black/80"
                />
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2">
                <StatCard
                  title="Team Status"
                  value={
                    <span className="bg-green-100 px-3 py-1 rounded">
                      Verified
                    </span>
                  }
                  className="bg-green-50 border-green-600"
                />
              </div>
            </div>

            {/* Large content card */}
            <div className="bg-gray-200 rounded-lg h-96 mb-6 flex items-center justify-center text-lg font-semibold">
              No Available Competitions at the moment
            </div>

            {/* Ads / bottom card */}
            <div className="bg-gray-200 rounded-lg h-48 p-4">
              <h4 className="font-semibold mb-2">Ads</h4>
              <div className="h-full">Ad content / promo</div>
            </div>
          </div>

          {/* RIGHT - sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            {/* Make sidebar sticky so it stays visible while the left scrolls */}
            <div className="sticky top-[88px]">
              <div className="bg-gray-200 rounded-lg p-6 mb-4 h-3/4">
                <h3 className="font-bold text-center mb-4">IMPORTANT INFO</h3>
                <p className="text-sm">
                  Put announcements, links, contact info here.
                </p>
                {/* fill with content to make it tall like the screenshot */}
                <div className="mt-6 space-y-2 text-sm">
                  <div>• Upcoming training</div>
                  <div>• Payment reminder</div>
                  <div>• Rules & guidelines</div>
                </div>
              </div>

              {/* Extra small cards if needed */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="font-semibold">Quick Links</h4>
                <ul className="mt-2 text-sm space-y-1">
                  <li>Profile</li>
                  <li>Competitions</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
