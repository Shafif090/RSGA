"use client";

import { useState } from "react";
import Link from "next/link";
import { blanka, poppins } from "../fonts";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center absolute gap-3">
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
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
