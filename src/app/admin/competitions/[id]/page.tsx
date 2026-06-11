"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CurrencyInput } from "@/components/CurrencyInput";
import { ChevronDown, Upload, X, Plus } from "lucide-react";
import api from "@/utils/api";

export default function CompetitionEditPage() { 
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [competition, setCompetition] = useState<any>(null);
  const [competitionName, setCompetitionName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [division, setDivision] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [prizes, setPrizes] = useState<{ place: string; amount: string }[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [status, setStatus] = useState("pending");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!id) return;

    const fetchCompetition = async () => {
      try {
        const response = await api.get(`/competitions/select/${id}`);
        const comp = response.data;
        setCompetition(comp);
        setCompetitionName(comp.name || "");
        setContactInfo(comp.contactInfo || "");
        setAgeGroup(comp.ageGroup || "");
        setDivision(comp.division || "");
        setRegistrationFee(comp.registrationFee || "");
        setPrizes(comp.prizes || [{ place: "1st Place", amount: "" }]);
        setBanner(comp.banner || null);
        setImportFile(comp.importFile || null);
        setStatus(comp.status || "pending");
        setStartDate(
          comp.startDate
            ? new Date(comp.startDate).toISOString().split("T")[0]
            : ""
        );
        setEndDate(
          comp.endDate ? new Date(comp.endDate).toISOString().split("T")[0] : ""
        );
      } catch (err: any) {
        console.error("Fetch competition error:", err);
        setError(err.response?.data?.message || "Failed to load competition");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [id]);
  function isFile(value: unknown): value is File {
    return value instanceof File;
  }
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSave = async () => {
    setError(null);

    try {
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        setError("Start date must be before or equal to end date");
        return;
      }

      let bannerBase64 = banner;
      if (banner && banner.startsWith("data:")) {
        // Already base64
      } else if (isFile(banner)) {
        bannerBase64 = await fileToBase64(banner);
      }

      const cleanedFee = registrationFee
        ? registrationFee.replace(/[₦,\s]/g, "")
        : "";

      const payload = {
        name: competitionName,
        contactInfo: contactInfo || "",
        ageGroup: ageGroup || "",
        division: division || "",
        registrationFee: cleanedFee,
        prizes: prizes.map((p) => ({
          place: p.place,
          amount: p.amount.replace(/[₦,\s]/g, "") || "",
        })),
        banner: bannerBase64 || "",
        status,
        startDate: startDate || null,
        endDate: endDate || null,
      };

      await api.put(`/admin/competitions/update/${id}`, payload);
      alert("Competition updated ✅");
      router.push("/admin/competitions");
    } catch (err: any) {
      console.error("Update competition error:", err);
      setError(err.response?.data?.message || "Failed to update competition");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/competitions/delete/${id}`);
      alert("Competition deleted ✅");
      router.push("/admin/competitions");
    } catch (err: any) {
      console.error("Delete competition error:", err);
      setError(err.response?.data?.message || "Failed to delete competition");
    }
  };

  if (loading)
    return <p className="text-gray-600 text-center mt-10">Loading...</p>;
  if (!competition)
    return (
      <p className="text-gray-600 text-center mt-10">Competition not found.</p>
    );

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-gray-900">EDIT:</h1>
      <h1 className="text-2xl font-bold text-center text-gray-900">
        {competitionName}
      </h1>

      {/* Error message */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Banner Upload */}
      {banner && (
        <img
          src={banner}
          alt="banner"
          className="w-full h-full object-fill rounded-md"
        />
      )}

      <div className="flex justify-center gap-4">
        <label className="border border-gray-400 rounded-md cursor-pointer hover:border-yellow-400 transition px-4 py-2 flex items-center gap-2 bg-white">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setBanner(URL.createObjectURL(file));
            }}
          />
          <span className="text-sm text-gray-800">
            {banner ? "Change Banner" : "Upload Banner"}
          </span>
          <Upload className="inline ml-2 rounded-md p-0.5 bg-gray-400 text-gray-800 w-5 h-5" />
        </label>

        <label className="border border-gray-400 rounded-md cursor-pointer hover:border-yellow-400 transition px-4 py-2 flex items-center gap-2 bg-white">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImportFile(file?.name || null);
            }}
          />
          <span className="text-sm text-gray-800">
            {importFile
              ? "Update Rules"
              : "Upload Rules File (.xlsx, .csv, .pdf)"}
          </span>
          <Upload className="inline ml-2 rounded-sm p-0.5 bg-gray-400 text-gray-800 w-5 h-5" />
        </label>
      </div>

      {/* Name */}
      <input
        type="text"
        placeholder="Competition Name"
        className="input w-full bg-white text-gray-800 border-gray-400"
        value={competitionName}
        onChange={(e) => setCompetitionName(e.target.value)}
      />

      {/* Contact Info */}
      <input
        type="text"
        placeholder="Contact Info"
        className="input w-full bg-white text-gray-800 border-gray-400"
        value={contactInfo}
        onChange={(e) => setContactInfo(e.target.value)}
      />

      {/* Age Group */}
      <div className="relative">
        <select
          className="input w-full appearance-none pr-10 bg-white text-gray-800 border-gray-400"
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
          className="input w-full appearance-none pr-10 bg-white text-gray-800 border-gray-400"
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

      {/* Status */}
      <div className="relative">
        <select
          className="input w-full appearance-none pr-10 bg-white text-gray-800 border-gray-400"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-800 w-4 h-4" />
      </div>

      {/* Start Date */}
      <input
        type="date"
        placeholder="Start Date"
        className="input w-full bg-white text-gray-800 border-gray-400"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      {/* End Date */}
      <input
        type="date"
        placeholder="End Date"
        className="input w-full bg-white text-gray-800 border-gray-400"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      {/* Registration Fee */}
      <CurrencyInput
        placeholder="Registration Fee"
        value={registrationFee}
        onValueChange={(value) => setRegistrationFee(value || "")}
        className="bg-white text-gray-800 border-gray-400"
      />

      {/* Prize Pool */}
      <div className="space-y-3 border border-yellow-400 rounded-md p-3 bg-white">
        <h3 className="text-gray-900 font-semibold">Prize Pool</h3>
        {prizes.map((prize, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              className="input text-gray-800 w-40 bg-white border-gray-400"
              value={prize.place}
              onChange={(e) =>
                setPrizes((prev) =>
                  prev.map((p, i) =>
                    i === index ? { ...p, place: e.target.value } : p
                  )
                )
              }
            />
            <CurrencyInput
              placeholder="₦0.00"
              value={prize.amount}
              onValueChange={(value) =>
                setPrizes((prev) =>
                  prev.map((p, i) =>
                    i === index ? { ...p, amount: value || "" } : p
                  )
                )
              }
              className="bg-white text-gray-800 border-gray-400"
            />
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

      {/* Buttons */}
      <div className="flex items-center justify-center flex-col gap-4 mt-4">
        <button
          onClick={handleSave}
          className="border rounded-sm border-red-500 bg-white text-gray-800 py-1.5 px-2.5 hover:bg-red-500 hover:text-white transition"
        >
          Save Changes
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-gray-800 border border-gray-400 rounded-sm py-1.5 px-2.5 bg-white hover:bg-red-500 hover:text-white transition"
        >
          Delete Competition
        </button>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border border-yellow-400 rounded-md p-6 space-y-4 w-80 text-center">
              <p className="text-gray-900 font-semibold">
                Are you sure you want to delete this competition?
              </p>
              <div className="flex justify-around gap-4">
                <button
                  onClick={() => {
                    handleDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="bg-red-500 py-1.5 px-4 rounded text-white hover:opacity-90 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-1.5 px-4 border border-gray-400 rounded bg-white text-gray-800 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
