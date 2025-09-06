"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { blanka, poppins } from "../fonts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(
    null
  );
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        const u = data.user || data;
        setUser({
          name: u.fullName || u.name || "",
          avatar: u.avatarUrl || "",
        });
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // Dropdown state for profile
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  return (
    <nav
      className={`px-5 h-[75px] flex justify-end items-center bg-transparent ${poppins.className}`}>
      {/* Logo */}
      <Link
        href="/"
        className={`mr-auto text-3xl tracking-wider ${blanka.className} hover:text-[#006AFF] duration-300 cursor-pointer`}>
        RSGA
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-center flex-1 text-lg">
        <div className="flex items-center bg-[#303030] px-4 py-3 rounded-[22px] mr-32">
          <Link
            href="/dashboard"
            className="mx-2.5 text-[#F0F0F0] hover:text-[#006AFF] transition-colors duration-300 no-underline">
            Dashboard
          </Link>
          <Link
            href="/leaderboard"
            className="mx-2.5 text-[#F0F0F0] hover:text-[#006AFF] transition-colors duration-300 no-underline">
            LeaderBoard
          </Link>
          <Link
            href="/events"
            className="mx-2.5 text-[#F0F0F0] hover:text-[#006AFF] transition-colors duration-300 no-underline">
            Events
          </Link>
          <Link
            href="/about"
            className="mx-2.5 text-[#F0F0F0] hover:text-[#006AFF] transition-colors duration-300 no-underline">
            About Us
          </Link>
        </div>
      </div>

      {/* Desktop Auth/Profile */}
      <div className="hidden md:flex items-center absolute gap-3">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center px-4 py-2 border border-[#006AFF] text-[#F0F0F0] bg-[#0F1016] hover:bg-[#006AFF] hover:text-[#F0F0F0] rounded-xl transition-colors no-underline gap-2 focus:outline-none">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <span className="text-black text-xl md:text-xl font-bold">
                    {user.name?.[0] || "U"}
                  </span>
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.name}</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-[#18191f] border border-[#303030] rounded-lg shadow-lg z-50">
                <button
                  className="block w-full px-4 py-2 text-sm text-[#F0F0F0] hover:bg-[#23243a] rounded-lg transition-colors duration-200 text-center"
                  onClick={async () => {
                    setShowDropdown(false);
                    try {
                      await fetch(
                        (process.env.NEXT_PUBLIC_API_BASE_URL ?? "") +
                          "/api/v1/auth/logout",
                        {
                          method: "POST",
                          credentials: "include",
                        }
                      );
                    } catch {}
                    window.location.href = "/";
                  }}>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 border border-[#006AFF] text-[#F0F0F0] bg-[#0F1016] hover:bg-[#006AFF] hover:text-[#F0F0F0] rounded-xl transition-colors no-underline">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 border border-[#006AFF] text-[#F0F0F0] bg-[#0F1016] hover:bg-[#006AFF] hover:text-[#F0F0F0] rounded-xl transition-colors duration-300 no-underline">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/2.svg">
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-[300px] h-full bg-[#0F1016] z-20 flex flex-col p-5 transition-transform duration-500">
            <button
              className="self-end mb-5"
              onClick={() => setIsMenuOpen(false)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="p-4 text-[#F0F0F0] hover:text-[#006AFF] transition-colors duration-300 no-underline">
                Dashboard
              </Link>
              <Link
                href="/leaderboard"
                className="p-4 text-[#F0F0F0] hover:text-[#006AFF] transition-colors duration-300 no-underline">
                LeaderBoard
              </Link>
              <Link
                href="/events"
                className="p-4 text-[# color-5000] hover:text-[#006AFF] transition-colors duration-300 no-underline">
                Events
              </Link>
              <Link
                href="/about"
                className="p-4 text-[#F0F0F0] hover:text-[#006AFF] transition-colors duration-300 no-underline">
                About Us
              </Link>

              <div className="flex flex-col space-y-3 mt-8">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown((v) => !v)}
                      className="mx-10 flex items-center justify-center gap-2 px-4 py-2 border border-[#006AFF] text-[#F0F0F0] bg-[#0F1016] hover:bg-[#006AFF] hover:text-[#F0F0F0] rounded-md transition-colors duration-300 no-underline text-center focus:outline-none">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <span className="text-black text-xl md:text-xl font-bold">
                            {user.name?.[0] || "U"}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-32 bg-[#18191f] border border-[#303030] rounded-lg shadow-lg z-50">
                        <button
                          className="block w-full px-4 py-2 text-sm text-[#F0F0F0] hover:bg-[#23243a] rounded-lg transition-colors duration-200 text-center"
                          onClick={async () => {
                            setShowDropdown(false);
                            try {
                              await fetch(
                                (process.env.NEXT_PUBLIC_API_BASE_URL ||
                                  "http://localhost:5500") +
                                  "/api/v1/auth/logout",
                                {
                                  method: "POST",
                                  credentials: "include",
                                }
                              );
                            } catch {}
                            window.location.href = "/";
                          }}>
                          Log out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="mx-10 px-4 py-2 border border-[#006AFF] text-[#F0F0F0] bg-[#0F1016] hover:bg-[#006AFF] rounded-md transition-colors duration-300 no-underline text-center">
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="mx-10 px-4 py-2 border border-[#006AFF] text-[#F0F0F0] bg-[#0F1016] hover:bg-[#006AFF] rounded-md transition-colors duration-300 no-underline text-center">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
