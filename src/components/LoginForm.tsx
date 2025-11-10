"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      router.push("/admin/dashboard");
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    if (modalStep === 1) {
      if (!forgotEmail.trim()) {
        setModalError("Please enter your email");
        setModalLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://backend.5starsteams.com/api/auth/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: forgotEmail }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to send verification pin");
        }

        setModalStep(2);
      } catch (err: any) {
        setModalError(err.message || "Failed to send verification pin");
      } finally {
        setModalLoading(false);
      }
    } else if (modalStep === 2) {
      if (!pin.trim()) {
        setModalError("Please enter the verification pin");
        setModalLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://backend.5starsteams.com/api/auth/verify-pin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: forgotEmail, pin }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Invalid verification pin");
        }

        setModalStep(3);
      } catch (err: any) {
        setModalError(err.message || "Invalid verification pin");
      } finally {
        setModalLoading(false);
      }
    } else if (modalStep === 3) {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        setModalError("Please enter both new password and confirm password");
        setModalLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setModalError("Passwords do not match");
        setModalLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://backend.5starsteams.com/api/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: forgotEmail,
              pin,
              password: newPassword,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to reset password");
        }

        setModalOpen(false);
        setModalStep(1);
        setForgotEmail("");
        setPin("");
        setNewPassword("");
        setConfirmPassword("");
        alert(
          "Password reset successfully. Please log in with your new password."
        );
      } catch (err: any) {
        setModalError(err.message || "Failed to reset password");
      } finally {
        setModalLoading(false);
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalStep(1);
    setForgotEmail("");
    setPin("");
    setNewPassword("");
    setConfirmPassword("");
    setModalError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      <div className="relative w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex justify-center mb-6">
          <img
            src="/5starslogo.svg"
            alt="Premier League Logo"
            className="h-16 w-auto"
          />
        </div>
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 tracking-tight">
          Premier League Admin Portal
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm animate-pulse">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={credentials.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Forgot your password?{" "}
          <button
            onClick={() => setModalOpen(true)}
            className="text-blue-600 hover:underline font-medium"
          >
            Reset it here
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {modalStep === 1
                ? "Reset Password"
                : modalStep === 2
                ? "Enter Verification Pin"
                : "Set New Password"}
            </h3>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {modalStep === 1 && (
                <div>
                  <label
                    htmlFor="forgotEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="admin@example.com"
                    disabled={modalLoading}
                  />
                </div>
              )}
              {modalStep === 2 && (
                <div>
                  <label
                    htmlFor="pin"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Verification Pin
                  </label>
                  <input
                    id="pin"
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter 6-digit pin"
                    disabled={modalLoading}
                  />
                </div>
              )}
              {modalStep === 3 && (
                <>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="••••••••"
                      disabled={modalLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="••••••••"
                      disabled={modalLoading}
                    />
                  </div>
                </>
              )}
              {modalError && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {modalError}
                </div>
              )}
              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-3 px-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modalLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : modalStep === 1 ? (
                  "Send Pin"
                ) : modalStep === 2 ? (
                  "Verify Pin"
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
