"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Trophy,
  Target,
  Users,
  Calendar,
  Award,
  Mail,
  Phone,
  MapPin,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// API base URL (set NEXT_PUBLIC_API_BASE_URL in .env.local)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5500";

// Mock user data (renamed to defaultUser)
const defaultUser = {
  name: "",
  school: "",
  id: "",
  rank: 0,
  hub: "",
  bio: "",
  avatar: "",
  email: "",
  phone: "",
  facebook: "",
  totalPoints: 0,
  badges: [],
  goals: 0,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
  appearances: 0,
};

// ...existing code...

const upcomingMatches = [
  { teamA: "TEAM A", teamB: "TEAM D", date: "Dec 15", time: "3:00 PM" },
  { teamA: "TEAM D", teamB: "TEAM C", date: "Dec 18", time: "4:30 PM" },
  { teamA: "TEAM G", teamB: "TEAM E", date: "Dec 22", time: "2:00 PM" },
  { teamA: "TEAM C", teamB: "TEAM G", date: "Dec 25", time: "5:00 PM" },
  { teamA: "TEAM E", teamB: "TEAM B", date: "Dec 28", time: "3:30 PM" },
];

const recentMatches = [
  { teamA: "TEAM A", teamB: "TEAM D", result: "2-1", status: "won" },
  { teamA: "TEAM D", teamB: "TEAM C", result: "0-2", status: "lost" },
  { teamA: "TEAM G", teamB: "TEAM E", result: "1-1", status: "draw" },
];

export default function DashboardPage() {
  const [userData, setUserData] = useState(defaultUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Use userData for stats, fallback to 0 if missing
  const individualStats = {
    goals: userData.goals ?? 0,
    assists: userData.assists ?? 0,
    yellowCards: userData.yellowCards ?? 0,
    redCards: userData.redCards ?? 0,
    appearances: userData.appearances ?? 0,
  };

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          credentials: "include",
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) {
          setError("Failed to load user profile.");
          setLoading(false);
          return;
        }
        const data = await res.json().catch(() => null);
        if (!data) {
          setError("No user data returned.");
          setLoading(false);
          return;
        }
        // Normalize API shape to UI model
        const u = data.user || data;
        const mapped = {
          name: u.fullName || u.name || "",
          school: u.school || "",
          id: u.id || "",
          rank: data.rank ?? 0,
          hub:
            (Array.isArray(data.hubs) && data.hubs[0]?.name) ||
            data.primaryHub?.name ||
            "Unassigned",
          bio: u.bio || "",
          avatar: u.avatarUrl || "",
          email: u.email || "",
          phone: u.phoneNumber || u.phone || "",
          facebook: u.facebook || "",
          totalPoints: data.points?.total ?? 0,
          badges:
            (Array.isArray(data.games) &&
              data.games.map((g: { name: string }) => g.name)) ||
            [],
        };
        if (isMounted) setUserData((prev) => ({ ...prev, ...mapped }));
      } catch {
        setError("Network error. Could not load user profile.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131314] text-white">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#131314] text-white">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131314] text-white">
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-2">
              DASHBOARD
            </h1>
            <p className="text-gray-300">Welcome back, {userData.name}!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  PERSONAL INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <Avatar className="w-24 h-24 mb-4 border-4 border-[#809bc8]">
                      <AvatarImage
                        src={userData.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        <span className="text-3xl md:text-4xl font-bold">
                          {userData.name?.[0]}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {userData.name}
                      </h2>
                      <p className="text-gray-300">{userData.school}</p>
                      <p className="text-sm text-[#809bc8]">
                        ID: {userData.id}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-[#809bc8]" />
                          <span className="text-white">{userData.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-[#809bc8]" />
                          <span className="text-white">{userData.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-[#809bc8]" />
                          <span className="text-white">
                            Rank #{userData.rank}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-[#809bc8]" />
                          <span className="text-white">
                            Hub: {userData.hub}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {userData.badges.map((badge, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-[#809bc8] to-[#a76fb8] text-white">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* My Stats */}
            <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-white flex items-center gap-3 tracking-wide">
                  <Activity className="w-6 h-6 text-[#a76fb8]" />
                  MY STATS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center bg-[#23243a] rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-full mb-2">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-green-400">
                      {individualStats.goals}
                    </span>
                    <span className="text-sm text-gray-300 mt-1">Goals</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#23243a] rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-full mb-2">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-blue-400">
                      {individualStats.assists}
                    </span>
                    <span className="text-sm text-gray-300 mt-1">Assists</span>
                  </div>
                  {/* Yellow Cards */}
                  <div className="flex flex-col items-center bg-[#23243a] rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-3 rounded-full mb-2">
                      <Award className="w-7 h-7 text-yellow-100" />
                    </div>
                    <span className="text-3xl font-bold text-yellow-400">
                      {individualStats.yellowCards}
                    </span>
                    <span className="text-sm text-gray-300 mt-1">
                      Yellow Cards
                    </span>
                  </div>
                  {/* Red Cards */}
                  <div className="flex flex-col items-center bg-[#23243a] rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                    <div className="bg-gradient-to-br from-red-400 to-red-600 p-3 rounded-full mb-2">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-red-400">
                      {individualStats.redCards}
                    </span>
                    <span className="text-sm text-gray-300 mt-1">
                      Red Cards
                    </span>
                  </div>
                  <div className="flex flex-col items-center bg-[#23243a] rounded-xl p-5 shadow-md hover:scale-105 transition-transform">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-full mb-2">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-purple-400">
                      {individualStats.appearances}
                    </span>
                    <span className="text-sm text-gray-300 mt-1">
                      Appearances
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RECENT RESULTS */}
            <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">
                  RECENT RESULTS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMatches.map((match, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium text-white">
                          {match.teamA} vs {match.teamB}
                        </div>
                        <div className="text-gray-400">{match.result}</div>
                      </div>
                      <Badge
                        className={
                          match.status === "won"
                            ? "bg-green-500"
                            : match.status === "lost"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }>
                        {match.status.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Matches & Quick Actions */}
          <div className="space-y-8">
            {/* Upcoming Matches */}
            <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">
                  UPCOMING MATCHES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingMatches.slice(0, 5).map((match, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="text-sm">
                        <div className="font-bold text-center text-2xl text-white">
                          {match.teamA} vs {match.teamB}
                        </div>
                        <div className="text-gray-400 text-lg">
                          {match.date} • {match.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
