"use client";

import Link from "next/link";
import Image from "next/image";
import { garnet, poppins } from "../fonts";

export default function Home() {
  return (
    <div
      className={`min-h-screen bg-[#131314] text-white overflow-x-hidden ${poppins.className}`}>
      {/* Hero Section */}
      <div className="w-full flex flex-col justify-center items-center relative">
        {/* Enhanced Background Elements */}
        <div className="absolute top-30 left-20 w-64 h-64 bg-gradient-to-r from-[#809BC8] to-[#A76FB8] rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-16 right-20 w-80 h-80 bg-gradient-to-r from-[#A76FB8] to-[#809BC8] rounded-full blur-3xl opacity-8 animate-pulse delay-1000" />

        {/* Hero Content */}
        <div className="h-[60vh] mt-[15vh] flex flex-col justify-center items-center gap-6 text-center text-white max-w-6xl mx-auto px-6 relative z-10">
          <h1
            className={`font-display text-[70px] md:text-[70px] sm:text-[50px] font-black leading-tight ${garnet.className}`}>
            <span className="text-[#A76FB8] text-[140px] md:text-[140px] sm:text-[60px]">
              ❝
            </span>
            {" Redefining Sports and Gaming — Where Tradition Meets Tomorrow"}
          </h1>

          {/* Sign In Button */}
          <Link
            href="/login"
            className="bg-[#303030] text-white hover:bg-[#303030] hover:w-[190px] hover:rounded-[22px] shadow-[0px_0px_7px_#809BC8] rounded-[12px] w-[155px] h-[50px] text-[25px] transition-all duration-300 hover:gap-[30px] flex items-center justify-center gap-1 no-underline">
            <span className={`pr-2 ${poppins.className}`}>Sign In</span>
            <svg
              className="w-[30px] h-[30px]"
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
            {/* Top 3 Podium */}
            <div className="flex justify-center items-end mb-12 gap-8">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full mb-3 mx-auto overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="Player 2"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-white">Pong bhai</h3>
                <p className="text-sm text-gray-400">Pong Ultra High School</p>
                <p className="text-lg font-bold text-[#a76fb8]">2380 pts</p>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="w-28 h-28 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">🏆</span>
                </div>
                <div className="w-24 h-24 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full mb-3 mx-auto overflow-hidden border-4 border-yellow-500">
                  <Image
                    src="/placeholder.svg"
                    alt="Player 1"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-white text-lg">
                  Ching chong bhai
                </h3>
                <p className="text-sm text-gray-400">Ching Low School</p>
                <p className="text-xl font-bold text-[#a76fb8]">2450 pts</p>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full mb-3 mx-auto overflow-hidden">
                  <Image
                    src="/placeholder.svg"
                    alt="Player 3"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-white">Ping bhai</h3>
                <p className="text-sm text-gray-400">Channghua High School</p>
                <p className="text-lg font-bold text-[#a76fb8]">2290 pts</p>
              </div>
            </div>

            {/* Extended Leaderboard */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="space-y-4">
                {[
                  {
                    rank: 4,
                    name: "Alex Rahman",
                    school: "Dhaka International School",
                    points: 2180,
                  },
                  {
                    rank: 5,
                    name: "Sarah Khan",
                    school: "Chittagong Grammar School",
                    points: 2150,
                  },
                  {
                    rank: 6,
                    name: "Mohammad Ali",
                    school: "Sylhet Cadet College",
                    points: 2090,
                  },
                ].map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-[#809bc8] w-8">
                        #{player.rank}
                      </span>
                      <div className="w-12 h-12 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=48&width=48"
                          alt={player.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {player.name}
                        </h3>
                        <p className="text-sm text-gray-400">{player.school}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-white">
                        {player.points}
                      </p>
                      <p className="text-sm text-gray-400">points</p>
                    </div>
                  </div>
                ))}
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

      {/* Analytics Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#131314] to-[#1F1F23]" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-4">
              PERFORMANCE ANALYTICS
            </h2>
            <p className="text-xl text-gray-300">
              Data-driven insights for athletic excellence
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              {/* Goals Chart */}
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#303030"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#goalGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${40 * 2 * Math.PI}`}
                      strokeDashoffset={`${40 * 2 * Math.PI * (1 - 0.4)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="goalGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%">
                        <stop offset="0%" stopColor="#809bc8" />
                        <stop offset="100%" stopColor="#a76fb8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-[#a76fb8]">40</div>
                    <div className="text-sm font-medium uppercase tracking-wider text-white">
                      GOALS
                    </div>
                  </div>
                </div>
              </div>

              {/* Assists Chart */}
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#303030"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#assistGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${40 * 2 * Math.PI}`}
                      strokeDashoffset={`${40 * 2 * Math.PI * (1 - 0.7)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="assistGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-[#3B82F6]">70</div>
                    <div className="text-sm font-medium uppercase tracking-wider text-white">
                      ASSISTS
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="group relative px-12 py-4 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-full text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                <Link href="/dashboard">
                  <span className="relative z-10 flex items-center gap-3">
                    CHECK DASHBOARD
                    <span className="text-2xl">📊</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#a76fb8] to-[#809bc8] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-t from-[#0F0F0F] to-[#131314] border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-2">
              RSGA
            </h3>
            <p className="text-gray-400">Regional Sports & Gaming Analytics</p>
          </div>

          <p className="text-gray-500 text-sm">
            © 2025 RSGA. All rights reserved. Empowering athletes through
            data-driven insights.
          </p>
        </div>
      </footer>
    </div>
  );
}
