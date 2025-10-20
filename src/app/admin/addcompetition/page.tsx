"use client";

import { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";
import { ChevronDown, Upload, CircleQuestionMark, Plus, X } from "lucide-react";
import api from "@/utils/api";

export default function BannerForm() {
  const [banner, setBanner] = useState<File | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [competitionName, setCompetitionName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [division, setDivision] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [prizes, setPrizes] = useState([{ place: "1st Place", amount: "" }]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getOrdinal = (n: number) => {
    const j = n % 10,
      k = n % 100;
    if (k >= 11 && k <= 13) return `${n}th Place`;
    if (j === 1) return `${n}st Place`;
    if (j === 2) return `${n}nd Place`;
    if (j === 3) return `${n}rd Place`;
    return `${n}th Place`;
  };

  const addPrize = () =>
    setPrizes((prev) => {
      const next = [...prev, { place: "", amount: "" }];
      return next.map((p, i) => ({ ...p, place: getOrdinal(i + 1) }));
    });

  const removePrize = (index: number) =>
    setPrizes((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      return next.map((p, i) => ({ ...p, place: getOrdinal(i + 1) }));
    });

  const updatePrize = (index: number, field: string, value: string) =>
    setPrizes((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );

  const handlePrizeCurrencyChange = (index: number) => (valOrEvent: any) => {
    let raw = valOrEvent;
    if (raw && typeof raw === "object") {
      if ("target" in raw && raw.target && "value" in raw.target)
        raw = raw.target.value;
      else if ("value" in raw) raw = raw.value;
      else if ("formattedValue" in raw) raw = raw.formattedValue;
    }
    if (!raw) {
      updatePrize(index, "amount", "");
      return;
    }
    const cleaned = String(raw)
      .replace(/[₦,\s]/g, "")
      .replace(/[^\d.-]/g, "");
    updatePrize(index, "amount", cleaned);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        setError("Start date must be before or equal to end date");
        return;
      }

      const bannerBase64 = banner ? await fileToBase64(banner) : "";
      const cleanedFee = registrationFee
        ? parseFloat(registrationFee.replace(/[₦,\s]/g, ""))
        : 0;

      if (isNaN(cleanedFee) || cleanedFee <= 0) {
        setError("Registration fee must be a positive number");
        return;
      }

      const payload = {
        name: competitionName,
        contactInfo: contactInfo || "",
        ageGroup: ageGroup || "",
        division: division || "",
        registrationFee: cleanedFee,
        prizes: prizes.map((p) => ({
          place: p.place,
          amount: p.amount || "",
        })),
        banner: bannerBase64,
        status: "pending",
        startDate: startDate || null,
        endDate: endDate || null,
      };

      const response = await api.post("/admin/competitions/create", payload);

      setCompetitionName("");
      setContactInfo("");
      setAgeGroup("");
      setDivision("");
      setRegistrationFee("");
      setPrizes([{ place: "1st Place", amount: "" }]);
      setBanner(null);
      setImportFile(null);
      setStartDate("");
      setEndDate("");

      alert("Competition added successfully ✅");
      window.location.href = "/admin/competitions";
    } catch (error: any) {
      console.error("Error creating competition:", error);
      const message =
        error.response?.data?.message || "Failed to create competition";
      setError(message);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto p-6 space-y-12 bg-gray-100"
      onSubmit={handleSubmit}
    >
      {/* Error message */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Full-width button */}
      <button
        type="submit"
        className="w-[120%] cursor-pointer -ml-[10%] bg-red-500 text-white py-2 px-4 hover:bg-red-600 transition"
      >
        Add Competition
      </button>

      {/* Upload section */}
      <div className="flex justify-center gap-4">
        <label className="border border-gray-400 rounded-md break-words cursor-pointer hover:border-yellow-400 transition px-4 py-2 bg-white">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setBanner(e.target.files?.[0] || null)}
          />
          <span className="text-sm text-gray-800">
            {banner
              ? `Banner.${banner.name.split(".").pop()}`
              : "Upload Banner"}
          </span>
          <Upload className="inline ml-2 rounded-sm p-0.5 bg-gray-400 text-gray-800 w-5 h-5" />
        </label>

        <label className="border border-gray-400 rounded-md cursor-pointer hover:border-yellow-400 transition px-4 py-2 bg-white">
          <input
            type="file"
            accept=".xlsx,.csv,.pdf"
            className="hidden"
            onChange={(e) => setImportFile(e.target.files?.[0] || null)}
          />
          <span className="text-sm text-gray-800">
            {importFile
              ? `Rules.${importFile.name.split(".").pop()}`
              : "Upload Rules List (.xlsx, .csv, .pdf)"}
          </span>
          <Upload className="inline ml-2 rounded-sm p-0.5 bg-gray-400 text-gray-800 w-5 h-5" />
        </label>

        <CircleQuestionMark
          onClickCapture={() => alert("Accepted formats: .xlsx, .csv, .pdf")}
          className="text-gray-800 w-5 h-5 mt-2"
        />
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Competition Name"
          className="input bg-white text-gray-800 border-gray-400"
          value={competitionName}
          onChange={(e) => setCompetitionName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Contact Info"
          className="input bg-white text-gray-800 border-gray-400"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
        />

        {/* Age Group */}
        <div className="relative">
          <select
            className="input bg-white text-gray-800 border-gray-400 appearance-none pr-10"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="">Select Age Group</option>
            <option value="U18">U18</option>
            <option value="U21">U21</option>
            <option value="Open">Open</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-800 w-4 h-4" />
        </div>

        {/* Division */}
        <div className="relative">
          <select
            className="input bg-white text-gray-800 border-gray-400 appearance-none pr-10"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          >
            <option value="">Select Division</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Mixed">Mixed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-800 w-4 h-4" />
        </div>

        <CurrencyInput
          placeholder="Registration Fee"
          value={registrationFee}
          onValueChange={(val) => setRegistrationFee(val)}
          className="bg-white text-gray-800 border-gray-400"
        />

        {/* Start Date */}
        <input
          type="date"
          placeholder="Start Date"
          className="input bg-white text-gray-800 border-gray-400"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* End Date */}
        <input
          type="date"
          placeholder="End Date"
          className="input bg-white text-gray-800 border-gray-400"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* Dynamic Prize Pool Section */}
        <div className="space-y-3 border border-yellow-400 rounded-md p-3 bg-white">
          <h3 className="text-gray-900 font-semibold">Prize Pool</h3>

          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                className="input bg-white text-gray-800 border-gray-400 w-40"
                value={prize.place}
                onChange={(e) => updatePrize(index, "place", e.target.value)}
              />

              <div className="flex-1">
                <CurrencyInput
                  placeholder="₦0.00"
                  value={prize.amount}
                  onValueChange={handlePrizeCurrencyChange(index)}
                  className="bg-white text-gray-800 border-gray-400"
                />
              </div>

              {prizes.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removePrize(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove prize ${index + 1}`}
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-5" />
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addPrize}
            className="flex items-center gap-2 text-gray-800 hover:text-yellow-400 transition"
          >
            <Plus className="w-4 h-4" /> Add Prize
          </button>
        </div>
      </div>
    </form>
  );
}
