"use client";

import React, { useState } from "react";

type Coach = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  dob?: string;
  nationality?: string;
  position?: string;
};

export default function CoachProfile({
  coaches,
  setCoaches,
}: {
  coaches: Coach[];
  setCoaches: React.Dispatch<React.SetStateAction<Coach[]>>;
}) {
  // local state for two explicit coach forms: head + assistant
  const [head, setHead] = useState<Coach>(
    () =>
      coaches[0] || {
        id: "head",
        name: "",
        phone: "",
        email: "",
        position: "Head Coach",
      }
  );
  const [assistant, setAssistant] = useState<Coach>(
    () =>
      coaches[1] || {
        id: "assistant",
        name: "",
        phone: "",
        email: "",
        position: "Assistant Coach",
      }
  );

  function save(role: "head" | "assistant") {
    setCoaches((prev) => {
      const next = [...prev];
      if (role === "head") {
        next[0] = { ...(next[0] || { id: "head" }), ...head };
      } else {
        next[1] = { ...(next[1] || { id: "assistant" }), ...assistant };
      }
      return next;
    });
    alert("Saved (demo)");
  }

  function remove(role: "head" | "assistant") {
    setCoaches((prev) =>
      prev.filter((_, i) => (role === "head" ? i !== 0 : i !== 1))
    );
    if (role === "head")
      setHead({
        id: "head",
        name: "",
        phone: "",
        email: "",
        position: "Head Coach",
      });
    else
      setAssistant({
        id: "assistant",
        name: "",
        phone: "",
        email: "",
        position: "Assistant Coach",
      });
  }

  // Each form will have its own two-column md grid: form (col-span-2) + label (col-span-1)
  const FormCard = ({
    title,
    role,
    data,
    setData,
  }: {
    title: string;
    role: "head" | "assistant";
    data: Coach;
    setData: (s: Coach) => void;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      {/* form content (left) - spans 2 columns on md */}
      <div className="md:col-span-2">
        <div className=" rounded p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <button className="px-4 py-2 bg-black text-white rounded-md">
              Upload Passport
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => save(role)}
                className="px-3 py-1 bg-[#ED1E25] text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => remove(role)}
                className="px-3 py-1 border rounded"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm text-slate-600">Full Name</label>
            <input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Full Name"
              className="border-b focus:outline-none py-2"
            />

            <label className="text-sm text-slate-600 mt-3">Date Of Birth</label>
            <input
              value={data.dob || ""}
              onChange={(e) => setData({ ...data, dob: e.target.value })}
              placeholder="YYYY-MM-DD"
              className="border-b focus:outline-none py-2"
            />

            <label className="text-sm text-slate-600 mt-3">Nationality</label>
            <select
              value={data.nationality || ""}
              onChange={(e) =>
                setData({ ...data, nationality: e.target.value })
              }
              className="border-b focus:outline-none py-2"
            >
              <option value="">Select nationality</option>
              <option value="Nigerian">Nigerian</option>
              <option value="Ghanaian">Ghanaian</option>
              <option value="Cameroonian">Cameroonian</option>
            </select>

            <label className="text-sm text-slate-600 mt-3">Position</label>
            <select
              value={data.position || title}
              onChange={(e) => setData({ ...data, position: e.target.value })}
              className="border-b focus:outline-none h-full flex"
            >
              <option value="Head Coach">Head Coach</option>
              <option value="Assistant Coach">Assistant Coach</option>
              <option value="Fitness Coach">Fitness Coach</option>
            </select>

            <label className="text-sm text-slate-600 mt-3">Phone Number</label>
            <input
              value={data.phone || ""}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="0801xxxxxxx"
              className="border-b focus:outline-none py-2"
            />
          </div>
        </div>
      </div>

      {/* label column (right) - appears beside the form on md+ */}
      <div className="hidden md:flex md:items-center md:justify-center h-full">
        <div className="text-sm font-semibold text-slate-700 mt-4">{title}</div>
      </div>

      {/* On small screens show label below the form so there's always clarity */}
      <div className="md:hidden text-sm font-semibold text-slate-700 mt-2">
        {title}
      </div>
    </div>
  );

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-8">
        <FormCard
          title="Head Coach"
          role="head"
          data={head}
          setData={(s) => setHead(s)}
        />
        <FormCard
          title="Assistant Coach"
          role="assistant"
          data={assistant}
          setData={(s) => setAssistant(s)}
        />
      </div>

      <div className="h-20" />
    </div>
  );
}

// Usage: <CoachProfile coaches={coaches} setCoaches={setCoaches} />
