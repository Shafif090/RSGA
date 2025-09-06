"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { garnet, poppins } from "../fonts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5500";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/leaderboard`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch {
        setLeaderboard([]);
      }
    }
    fetchLeaderboard();
  }, []);
  // Helper for safe access
  const getPlayer = (idx: number) => leaderboard[idx] || null;
  return (
    <div
      className={`min-h-screen bg-[#131314] text-white overflow-x-hidden ${poppins.className}`}>
      {/* Hero Section */}
      <div className="w-full flex flex-col justify-center items-center relative">
        {/* Enhanced Background Elements */}
        <div className="absolute top-30 left-20 w-64 h-64 bg-gradient-to-r from-[#809BC8] to-[#A76FB8] rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-16 right-20 w-80 h-80 bg-gradient-to-r from-[#A76FB8] to-[#809BC8] rounded-full blur-3xl opacity-8 animate-pulse delay-1000" />

        {/* Hero Content */}
        <div className="h-[60vh] mt-[15vh] flex flex-col justify-center items-center gap-6 text-center text-white max-w-6xl mx-auto px-3 sm:px-6 relative z-10">
          <h1
            className={`font-display font-black leading-tight ${garnet.className} text-[2.2rem] xs:text-[2.5rem] sm:text-[2.8rem] md:text-[3.5rem] lg:text-[70px]`}
            style={{ wordBreak: "break-word" }}>
            <span className="text-[#A76FB8] text-[3.5rem] xs:text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[140px] block leading-none">
              ❝
            </span>
            <span className="block mt-2">
              {" Redefining Sports and Gaming — Where Tradition Meets Tomorrow"}
            </span>
          </h1>

          {/* Sign In Button */}
          <Link
            href="/login"
            className="bg-[#303030] text-white hover:bg-[#303030] hover:w-[190px] hover:rounded-[22px] shadow-[0px_0px_7px_#809BC8] rounded-[12px] w-[135px] xs:w-[145px] sm:w-[155px] h-[44px] xs:h-[48px] sm:h-[50px] text-[18px] xs:text-[20px] sm:text-[25px] transition-all duration-300 hover:gap-[30px] flex items-center justify-center gap-1 no-underline mt-2">
            <span className={`pr-2 ${poppins.className}`}>Sign In</span>
            <svg
              className="w-[24px] h-[24px] xs:w-[28px] xs:h-[28px] sm:w-[30px] sm:h-[30px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </Link>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute pt-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60">
        <span className="text-white/60 text-sm">Explore More</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
      {/* Leaderboard Section */}
      <section className="py-20 relative mt-[10vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#131314] to-[#1F1F23]" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-4">
              TOP PERFORMERS
            </h2>
            <p className="text-xl text-gray-300">Champions leading the way</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Top 3 Podium (Dynamic) */}
            <div className="flex justify-center items-end mb-12 gap-8">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full mb-3 mx-auto overflow-hidden flex items-center justify-center">
                  {getPlayer(1) && getPlayer(1).avatar ? (
                    <Image
                      src={getPlayer(1).avatar}
                      alt={getPlayer(1).name || "-"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {getPlayer(1)?.name?.[0] || "-"}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white">
                  {getPlayer(1)?.name || "-"}
                </h3>
                <p className="text-sm text-gray-400">
                  {getPlayer(1)?.school || "-"}
                </p>
                <p className="text-lg font-bold text-[#a76fb8]">
                  {getPlayer(1)?.points ? `${getPlayer(1).points} pts` : "-"}
                </p>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="w-28 h-28 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">🏆</span>
                </div>
                <div className="w-24 h-24 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full mb-3 mx-auto overflow-hidden border-4 border-yellow-500 flex items-center justify-center">
                  {getPlayer(0) && getPlayer(0).avatar ? (
                    <Image
                      src={getPlayer(0).avatar}
                      alt={getPlayer(0).name || "-"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {getPlayer(0)?.name?.[0] || "-"}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg">
                  {getPlayer(0)?.name || "-"}
                </h3>
                <p className="text-sm text-gray-400">
                  {getPlayer(0)?.school || "-"}
                </p>
                <p className="text-xl font-bold text-[#a76fb8]">
                  {getPlayer(0)?.points ? `${getPlayer(0).points} pts` : "-"}
                </p>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full mb-3 mx-auto overflow-hidden flex items-center justify-center">
                  {getPlayer(2) && getPlayer(2).avatar ? (
                    <Image
                      src={getPlayer(2).avatar}
                      alt={getPlayer(2).name || "-"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-white">
                      {getPlayer(2)?.name?.[0] || "-"}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white">
                  {getPlayer(2)?.name || "-"}
                </h3>
                <p className="text-sm text-gray-400">
                  {getPlayer(2)?.school || "-"}
                </p>
                <p className="text-lg font-bold text-[#a76fb8]">
                  {getPlayer(2)?.points ? `${getPlayer(2).points} pts` : "-"}
                </p>
              </div>
            </div>

            {/* Extended Leaderboard (Dynamic) */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="space-y-4">
                {[3, 4, 5].map((idx) => {
                  const player = getPlayer(idx);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-[#809bc8] w-8">
                          #{player?.rank || idx + 1}
                        </span>
                        <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full overflow-hidden flex items-center justify-center">
                          {player && player.avatar ? (
                            <Image
                              src={player.avatar}
                              alt={player.name || "-"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-white">
                              {player?.name?.[0] || "-"}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {player?.name || "-"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {player?.school || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-white">
                          {player?.points || "-"}
                        </p>
                        <p className="text-sm text-gray-400">points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F1F23] to-[#131314]" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-4">
              VOICES OF EXCELLENCE
            </h2>
            <p className="text-xl text-gray-300">
              What our community leaders say
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-20">
            {/* Moderator Testimonial */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-80 h-96 bg-gradient-to-br from-[#809bc8] to-[#a76fb8] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/placeholder.svg"
                      alt="Dracula moderator"
                      width={320}
                      height={384}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#EC4899] to-[#F97316] rounded-full p-4">
                    <span className="text-2xl">👑</span>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-white">
                    Dracula bhai
                  </h3>
                  <p className="text-[#809bc8] font-medium">Moderator, RSGA</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative">
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full flex items-center justify-center text-3xl text-white font-bold">
                    {'"'}
                  </div>
                  <blockquote className="text-xl text-gray-200 leading-relaxed pl-8">
                    {
                      "RSGA has revolutionized how we approach sports analytics in our region. The platform brings together talented athletes from diverse backgrounds, creating a competitive yet supportive environment. Watching students grow through data-driven insights and healthy competition has been incredibly rewarding. This platform doesn't just track performance—it builds character and community."
                    }
                  </blockquote>
                </div>
              </div>
            </div>

            {/* President Testimonial */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-80 h-96 bg-gradient-to-br from-[#a76fb8] to-[#809bc8] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/placeholder.svg"
                      alt="Mona Lisa president"
                      width={320}
                      height={384}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-[#10B981] to-[#3B82F6] rounded-full p-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-white">
                    Mona Lisa bhai
                  </h3>
                  <p className="text-[#a76fb8] font-medium">President, RSGA</p>
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[#a76fb8] to-[#809bc8] rounded-full flex items-center justify-center text-3xl text-white font-bold">
                    {'"'}
                  </div>
                  <blockquote className="text-xl text-gray-200 leading-relaxed pr-8">
                    {
                      "Leading RSGA has been an incredible journey of innovation and community building. We've created more than just a sports platform—we've built a ecosystem where young athletes can discover their potential, compete fairly, and learn valuable life skills. The impact on schools and students across our region has exceeded our wildest expectations. This is just the beginning of something truly special."
                    }
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
