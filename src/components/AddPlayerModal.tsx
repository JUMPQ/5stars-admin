"use client";
import React, { useState, useRef, useEffect } from "react";

export type Player = {
  id?: string;
  fullName: string;
  dob: string; // ISO date string
  nationality: string;
  jerseyNumber: string;
  position: string;
  nationalId: string;
  passportPhoto?: File | null;
  parentalConsent?: File | null;
  medicalDoc?: File | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (player: Player) => void;
};

export default function AddPlayerModal({ open, onClose, onAdd }: Props) {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [position, setPosition] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [parentalConsent, setParentalConsent] = useState<File | null>(null);
  const [medicalDoc, setMedicalDoc] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // For focus trap / returning focus
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      // clear form on close
      setFullName("");
      setDob("");
      setNationality("");
      setJerseyNumber("");
      setPosition("");
      setNationalId("");
      setPassportPhoto(null);
      setParentalConsent(null);
      setMedicalDoc(null);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!dob) e.dob = "Date of birth required";
    if (!nationality.trim()) e.nationality = "Nationality required";
    if (!jerseyNumber.trim()) e.jerseyNumber = "Jersey number required";
    if (!position.trim()) e.position = "Position required";
    if (!nationalId.trim()) e.nationalId = "National ID required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    const newPlayer: Player = {
      id: String(Date.now()),
      fullName,
      dob,
      nationality,
      jerseyNumber,
      position,
      nationalId,
      passportPhoto,
      parentalConsent,
      medicalDoc,
    };

    onAdd(newPlayer);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-player-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-3xl mx-4">
        <form
          className="bg-white rounded-lg shadow-lg overflow-hidden border"
          onSubmit={handleSubmit}
        >
          <header className="px-6 py-4 border-b flex items-center justify-between">
            <h3 id="add-player-title" className="text-lg font-semibold">
              Add Player
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                ref={closeBtnRef}
                onClick={onClose}
                className="px-3 py-1 rounded hover:bg-slate-100"
                aria-label="Close add player"
              >
                ✕
              </button>
            </div>
          </header>

          <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium">Full Name</span>
                <input
                  ref={firstInputRef}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 px-3 py-2 border rounded focus:outline-none"
                  placeholder="Gogo Jeffery"
                />
                {errors.fullName && (
                  <span className="text-xs text-red-600 mt-1">
                    {errors.fullName}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Date of Birth</span>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1 px-3 py-2 border rounded focus:outline-none"
                />
                {errors.dob && (
                  <span className="text-xs text-red-600 mt-1">
                    {errors.dob}
                  </span>
                )}
              </label>
            </div>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Nationality</span>
              <input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="mt-1 px-3 py-2 border rounded focus:outline-none"
                placeholder="Nigerian"
              />
              {errors.nationality && (
                <span className="text-xs text-red-600 mt-1">
                  {errors.nationality}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Jersey Number</span>
              <input
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                className="mt-1 px-3 py-2 border rounded focus:outline-none"
                placeholder="7"
              />
              {errors.jerseyNumber && (
                <span className="text-xs text-red-600 mt-1">
                  {errors.jerseyNumber}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Position</span>
              <input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="mt-1 px-3 py-2 border rounded focus:outline-none"
                placeholder="MidFielder"
              />
              {errors.position && (
                <span className="text-xs text-red-600 mt-1">
                  {errors.position}
                </span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">National ID</span>
              <input
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="mt-1 px-3 py-2 border rounded focus:outline-none"
                placeholder="2****12333"
              />
              {errors.nationalId && (
                <span className="text-xs text-red-600 mt-1">
                  {errors.nationalId}
                </span>
              )}
            </label>

            {/* File uploads */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Passport Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPassportPhoto(e.target.files?.[0] ?? null)}
              />
              {passportPhoto && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(passportPhoto)}
                    alt="passport preview"
                    className="w-28 h-28 object-cover border rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Parental Consent</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) =>
                  setParentalConsent(e.target.files?.[0] ?? null)
                }
              />
              {parentalConsent && (
                <div className="mt-2 text-sm">
                  {parentalConsent.name} •{" "}
                  {(parentalConsent.size / 1024).toFixed(0)} KB
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Medical Doc</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setMedicalDoc(e.target.files?.[0] ?? null)}
              />
              {medicalDoc && (
                <div className="mt-2 text-sm">
                  {medicalDoc.name} • {(medicalDoc.size / 1024).toFixed(0)} KB
                </div>
              )}
            </div>
          </main>

          <footer className="px-6 py-4 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#ED1E25] text-white font-semibold hover:opacity-95"
            >
              Add Player
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
