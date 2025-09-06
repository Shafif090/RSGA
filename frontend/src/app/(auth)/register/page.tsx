"use client";

import type React from "react";
import { blanka } from "../../fonts";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  school: string;
  grade: number | null;
  section: string;
  shift: string;
  facebook: string;
  instagram: string;
  discord: string;
  password: string;
  confirmPassword: string;

  // NEW fields for communities / games (auto-assign hubs server-side)
  joinESports: boolean;
  joinOutdoor: boolean;
  esportsGames: string[]; // "Minecraft", "FC Mobile", "Valorant"
  outdoorGames: string[]; // currently ["Futsal"]
}

const grades = [6, 7, 8, 9, 10, 11, 12];
const shifts = ["Morning", "Day"];
const ES_GAMES = ["Minecraft", "FC Mobile", "Valorant"];
const OUTDOOR_GAMES = ["Futsal"]; // single outdoor option for now

// API base URL (set NEXT_PUBLIC_API_BASE_URL in .env.local)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5500";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    school: "",
    grade: null,
    section: "",
    shift: "",
    facebook: "",
    instagram: "",
    discord: "",
    password: "",
    confirmPassword: "",

    joinESports: false,
    joinOutdoor: false,
    esportsGames: [],
    outdoorGames: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim())
          newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Email is invalid";
        }
        if (!formData.phoneNumber.trim()) {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!/^01[3-9][0-9]{8}$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = "Phone number must match format 01XXXXXXXXX";
        }
        break;
      case 2:
        if (!formData.school.trim()) newErrors.school = "School is required";
        if (formData.grade === null) newErrors.grade = "Grade is required";
        if (!formData.section.trim()) newErrors.section = "Section is required";
        if (!formData.shift) newErrors.shift = "Shift is required";
        break;
      case 3:
        // Community selection validations (NEW)
        if (!formData.joinESports && !formData.joinOutdoor) {
          newErrors.community = "Select at least one community";
        }

        // If esports selected, at least one game must be selected
        if (formData.joinESports) {
          if (!formData.esportsGames || formData.esportsGames.length === 0) {
            newErrors.esportsGames = "Select at least one esports game";
          }
        }

        // If outdoor selected, at least one outdoor game must be selected
        if (formData.joinOutdoor) {
          if (!formData.outdoorGames || formData.outdoorGames.length === 0) {
            newErrors.outdoorGames = "Select at least one outdoor option";
          }
        }
        break;
      case 4:
        // Social step is optional — no validation here
        break;
      case 5:
        if (!formData.password.trim()) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        }
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = "Confirm password is required";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // total steps now 5
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    // Build payload expected by backend
    const communities = [
      formData.joinESports ? "ESPORTS" : null,
      formData.joinOutdoor ? "OUTDOOR" : null,
    ].filter(Boolean);

    const games = [
      ...(formData.joinESports ? formData.esportsGames : []),
      ...(formData.joinOutdoor ? formData.outdoorGames : []),
    ];

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      school: formData.school,
      grade: formData.grade,
      section: formData.section,
      shift: formData.shift,
      facebook: formData.facebook || null,
      instagram: formData.instagram || null,
      discord: formData.discord || null,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      communities,
      games,
      // hubId: undefined // (if you want to support hub selection later)
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Redirect to login (verification email expected)
        router.push("/login?verify=1");
        return;
      }

      // Surface field errors if provided by API
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        // conflict: email/phone already exists
        const field = data?.field as string | undefined;
        if (field === "email") {
          setErrors((prev) => ({ ...prev, email: "Email already in use" }));
        } else if (field === "phoneNumber" || field === "phone") {
          setErrors((prev) => ({
            ...prev,
            phoneNumber: "Phone number already in use",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            form: data?.message || "Account already exists",
          }));
        }
      } else if (res.status === 400) {
        // validation errors map
        const issues: Record<string, string> =
          data?.errors || data?.fieldErrors || {};
        if (issues && typeof issues === "object") {
          setErrors((prev) => ({ ...prev, ...issues }));
        } else {
          setErrors((prev) => ({
            ...prev,
            form: data?.message || "Invalid input",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          form: data?.message || "Registration failed. Try again.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Network error. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | null | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value } as FormData));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  // Handlers for community toggles
  const toggleJoinESports = () => {
    setFormData((prev) => {
      const next = { ...prev, joinESports: !prev.joinESports };
      if (!next.joinESports) {
        next.esportsGames = [];
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, esportsGames: "", community: "" }));
  };

  const toggleJoinOutdoor = () => {
    setFormData((prev) => {
      const next = { ...prev, joinOutdoor: !prev.joinOutdoor };
      if (!next.joinOutdoor) {
        next.outdoorGames = [];
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, outdoorGames: "", community: "" }));
  };

  // Toggle a game in esportsGames array
  const toggleEsportsGame = (game: string) => {
    setFormData((prev) => {
      const exists = prev.esportsGames.includes(game);
      const newGames = exists
        ? prev.esportsGames.filter((g) => g !== game)
        : [...prev.esportsGames, game];
      return { ...prev, esportsGames: newGames };
    });
    setErrors((prev) => ({ ...prev, esportsGames: "" }));
  };

  // Toggle a game in outdoorGames array (currently just Futsal)
  const toggleOutdoorGame = (game: string) => {
    setFormData((prev) => {
      const exists = prev.outdoorGames.includes(game);
      const newGames = exists
        ? prev.outdoorGames.filter((g) => g !== game)
        : [...prev.outdoorGames, game];
      return { ...prev, outdoorGames: newGames };
    });
    setErrors((prev) => ({ ...prev, outdoorGames: "" }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Personal Information
            </h2>

            <div>
              <label
                htmlFor="fullName"
                className="block text-lg opacity-85 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
                autoFocus
              />
              {errors.fullName && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.fullName}</div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg opacity-85 mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
              {errors.email && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.email}</div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-lg opacity-85 mb-2 font-medium">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white placeholder:text-gray-400 focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
              {errors.phoneNumber && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">
                    {errors.phoneNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Institution Details
            </h2>

            <div>
              <label
                htmlFor="school"
                className="block text-lg opacity-85 mb-2 font-medium">
                School
              </label>
              <input
                id="school"
                type="text"
                value={formData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
              {errors.school && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.school}</div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="grade"
                className="block text-lg opacity-85 mb-2 font-medium">
                Grade
              </label>
              <select
                id="grade"
                value={formData.grade ?? ""} // Use nullish coalescing to show empty for null
                onChange={(e) =>
                  handleInputChange(
                    "grade",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  backgroundSize: "16px",
                }}>
                <option
                  value=""
                  disabled
                  className="bg-[#303030] text-gray-300">
                  Select Grade
                </option>
                {grades.map((grade) => (
                  <option
                    key={grade}
                    value={grade}
                    className="bg-[#303030] text-white">
                    Grade {grade}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.grade}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="section"
                  className="block text-lg opacity-85 mb-2 font-medium">
                  Section
                </label>
                <input
                  id="section"
                  type="text"
                  value={formData.section}
                  onChange={(e) => handleInputChange("section", e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                  autoComplete="off"
                />
                {errors.section && (
                  <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                    <div className="text-red-400 text-sm">{errors.section}</div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="shift"
                  className="block text-lg opacity-85 mb-2 font-medium">
                  Shift
                </label>
                <select
                  id="shift"
                  value={formData.shift}
                  onChange={(e) => handleInputChange("shift", e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none appearance-none cursor-pointer"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    backgroundSize: "16px",
                  }}>
                  <option
                    value=""
                    disabled
                    className="bg-[#303030] text-gray-300">
                    Select Shift
                  </option>
                  {shifts.map((shift) => (
                    <option
                      key={shift}
                      value={shift}
                      className="bg-[#303030] text-white">
                      {shift}
                    </option>
                  ))}
                </select>
                {errors.shift && (
                  <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                    <div className="text-red-400 text-sm">{errors.shift}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Community Selection
            </h2>

            {/* Community choices */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  id="joinESports"
                  type="checkbox"
                  checked={formData.joinESports}
                  onChange={toggleJoinESports}
                  className="w-5 h-5 accent-[#809bc8] cursor-pointer"
                />
                <label htmlFor="joinESports" className="text-lg font-medium">
                  E-Sports Community
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="joinOutdoor"
                  type="checkbox"
                  checked={formData.joinOutdoor}
                  onChange={toggleJoinOutdoor}
                  className="w-5 h-5 accent-[#809bc8] cursor-pointer"
                />
                <label htmlFor="joinOutdoor" className="text-lg font-medium">
                  Outdoor Sports Community
                </label>
              </div>

              {errors.community && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.community}</div>
                </div>
              )}
            </div>

            {/* If esports selected, show game checkboxes */}
            {formData.joinESports && (
              <div className="mt-4 space-y-4">
                <h3 className="text-xl font-semibold">E-Sports Games</h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {ES_GAMES.map((game) => {
                    const isChecked = formData.esportsGames.includes(game);
                    return (
                      <label
                        key={game}
                        className={`flex items-center gap-2 p-3 rounded-[10px] border-[2px] transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "border-[#a76fb8] bg-white/5"
                            : "border-white/5"
                        }`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleEsportsGame(game)}
                          className="w-5 h-5 accent-[#a76fb8] cursor-pointer"
                        />
                        <div>
                          <div className="font-medium text-white">{game}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {errors.esportsGames && (
                  <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                    <div className="text-red-400 text-sm">
                      {errors.esportsGames}
                    </div>
                  </div>
                )}
              </div>
            )}

            {formData.joinOutdoor && (
              <div className="mt-4 space-y-4">
                <h3 className="text-xl font-semibold">Outdoor Games</h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {OUTDOOR_GAMES.map((game) => {
                    const isChecked = formData.outdoorGames.includes(game);
                    return (
                      <label
                        key={game}
                        className={`flex items-center gap-2 p-3 rounded-[10px] border-[2px] transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "border-[#a76fb8] bg-white/5"
                            : "border-white/5"
                        }`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleOutdoorGame(game)}
                          className="w-5 h-5 accent-[#a76fb8] cursor-pointer"
                        />
                        <div>
                          <div className="font-medium text-white">{game}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {errors.outdoorGames && (
                  <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                    <div className="text-red-400 text-sm">
                      {errors.outdoorGames}
                    </div>
                  </div>
                )}
              </div>
            )}
            <p className="text-sm py-2 opacity-80">
              Hubs will be auto-assigned after registration.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white mb-6">Social</h2>
            <div>
              <label
                htmlFor="facebook"
                className="block text-lg opacity-85 mb-2 font-medium">
                Facebook URL
              </label>
              <input
                id="facebook"
                type="url"
                value={formData.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="instagram"
                className="block text-lg opacity-85 mb-2 font-medium">
                Instagram URL
              </label>
              <input
                id="instagram"
                type="url"
                value={formData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="discord"
                className="block text-lg opacity-85 mb-2 font-medium">
                Discord Username
              </label>
              <input
                id="discord"
                type="text"
                value={formData.discord}
                onChange={(e) => handleInputChange("discord", e.target.value)}
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Almost done!
            </h2>

            <div>
              <label
                htmlFor="password"
                className="block text-lg opacity-85 mb-2 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
              {errors.password && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.password}</div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-lg opacity-85 mb-2 font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full px-4 py-3 text-lg bg-transparent border-[3px] border-white/80 rounded-[12px] text-white focus:border-[#809bc8] transition-all duration-300 h-12 focus:outline-none"
                autoComplete="off"
              />
              {errors.confirmPassword && (
                <div className="mt-2 border border-red-500/50 bg-red-500/10 backdrop-blur-sm rounded-md p-3">
                  <div className="text-red-400 text-sm">
                    {errors.confirmPassword}
                  </div>
                </div>
              )}
            </div>

            {/* Note about verification */}
            <div className="mt-2 border border-yellow-500/30 bg-yellow-500/5 rounded-md p-3">
              <div className="text-yellow-200 text-sm">
                Note: After registering you will receive a verification email.
                You must verify your account before accessing the dashboard.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Chevron SVG components (unchanged)
  const ChevronLeft = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ChevronRight = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#131314] text-white overflow-hidden relative">
      {/* Shadow Effect - hide on small screens */}
      <div className="hidden md:block fixed h-full right-5 w-900px shadow-[-50px_0px_100px_50px_rgba(0,0,0,0.8)] z-5" />
      {/* RSGA Text - hide on small screens to preserve layout */}
      <div className="hidden md:flex fixed right-10 top-0 h-screen w-[130px] items-center justify-center z-10">
        <h1
          className={`font-display font-light text-[200px] opacity-40 text-gray-400 whitespace-nowrap ${blanka.className}`}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center center",
          }}>
          RSGA
        </h1>
      </div>

      {/* Animated Rectangle - hide on very small screens */}
      <div
        className="hidden sm:block fixed w-[180px] h-[180px] bg-[#29313f] rounded-[20px] animate-rect-spin z-0"
        style={{
          left: "calc(50% + 50px)",
          top: "calc(55% + 50px)",
        }}
      />

      {/* Form Container */}
      <div className="relative h-screen flex items-center justify-center md:justify-start px-4 md:pl-16 py-8">
        <div className="w-full max-w-[550px] h-auto max-h-[85vh] bg-white/5 backdrop-blur-[6.5px] border-2 border-[#303030] rounded-[10px] flex flex-col items-center justify-center overflow-y-auto">
          <div className="w-full px-6 md:px-8 py-8 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent uppercase font-bold text-center leading-tight mb-6">
              Time to begin!
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-[450px]">
              {renderStep()}

              {/* Top-level form error */}
              {errors.form && (
                <div className="mt-4 border border-red-500/50 bg-red-500/10 rounded-md p-3">
                  <div className="text-red-400 text-sm">{errors.form}</div>
                </div>
              )}

              <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="bg-[#303030] hover:bg-[#404040] text-white px-6 py-3 text-base font-medium border-none rounded-[10px] shadow-[0px_0px_7px_#809bc8] transition-all duration-300 hover:shadow-[0px_0px_15px_#809bc8] flex items-center gap-2 h-12 cursor-pointer">
                    <ChevronLeft />
                    Previous
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#303030] hover:bg-[#404040] text-white px-6 py-3 text-base font-medium border-none rounded-[10px] shadow-[0px_0px_7px_#809bc8] transition-all duration-300 hover:shadow-[0px_0px_15px_#809bc8] flex items-center gap-2 h-12 cursor-pointer">
                    Next
                    <ChevronRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#303030] hover:bg-[#404040] text-white px-8 py-3 text-base font-medium border-none rounded-[10px] shadow-[0px_0px_7px_#809bc8] transition-all duration-300 hover:shadow-[0px_0px_15px_#809bc8] disabled:opacity-50 disabled:cursor-not-allowed h-12 cursor-pointer">
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>

              <div className="text-center mt-6">
                <Link
                  href="/login"
                  className="text-[#809bc8] hover:text-[#a76fb8] transition-colors duration-300 text-base">
                  Already have an account? Login here
                </Link>
              </div>
            </form>

            {/* Step Indicator */}
            <div className="flex justify-center mt-6 space-x-3">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === currentStep
                      ? "bg-[#a76fb8] shadow-[0px_0px_10px_#a76fb8]"
                      : step < currentStep
                      ? "bg-[#809bc8]"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rect-spin {
          0% {
            transform: rotate(70deg);
            border-radius: 20px;
            background-color: #29313f;
          }
          25% {
            transform: rotate(140deg);
            border-radius: 5px;
            background-color: #809bc8;
          }
          50% {
            transform: rotate(-15deg);
            border-radius: 10px;
            background-color: #a76fb8;
          }
          75% {
            transform: rotate(35deg);
            border-radius: 70px;
            background-color: #809bc8;
          }
          100% {
            transform: rotate(70deg);
            border-radius: 20px;
            background-color: #29313f;
          }
        }
        .animate-rect-spin {
          animation: rect-spin 20s infinite;
        }
      `}</style>
    </div>
  );
}
