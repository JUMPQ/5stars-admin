"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get("/admin/registrations");
        setRegistrations(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading registrations...</p>
      </div>
    );
  }

  // Empty State
  if (registrations.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Competition Registrations
        </h1>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          No registrations found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Competition Registrations
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left">Team</th>
              <th className="p-4 text-left">Competition</th>
              <th className="p-4 text-left">Zone</th>
              <th className="p-4 text-left">Coach</th>
              <th className="p-4 text-left">Phone</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((reg: any) => (
              <tr
                key={reg._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={reg.team?.logoUrl || "/default-logo.png"}
                    alt={reg.team?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <span>{reg.team?.name}</span>
                </td>

                <td className="p-4">
                  {reg.competition?.name}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {reg.zone}
                  </span>
                </td>

                <td className="p-4">
                  {reg.coachName}
                </td>

                <td className="p-4">
                  {reg.phoneNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}