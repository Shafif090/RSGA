"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
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
import { garnet, poppins } from "../../fonts";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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

type Upcoming = { teamA: string; teamB: string; date: string; time: string };
type Recent = {
  teamA: string;
  teamB: string;
  result: string;
  status: "won" | "lost" | "draw";
};
type MeResponse = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  school?: string;
  bio?: string;
  avatar?: string;
  facebook?: string;
  hubs?: { name: string }[];
  rank?: number;
  points?: { total: number };
  badges?: string[];
  totalGoals?: number;
  totalAssists?: number;
  totalAppearances?: number;
  yellowCards?: number;
  redCards?: number;
};

type FrontendUser = {
  name: string;
  school: string;
  id: string;
  rank: number;
  hub: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  facebook: string;
  totalPoints: number;
  badges: string[];
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
};

export default function DashboardPage() {
  const [userData, setUserData] = useState<FrontendUser>(defaultUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upcomingMatches, setUpcomingMatches] = useState<Upcoming[]>([]);
  const [recentMatches, setRecentMatches] = useState<Recent[]>([]);
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
        const data: MeResponse | null = await res.json().catch(() => null);
        if (!data) {
          setError("No user data returned.");
          setLoading(false);
          return;
        }
        // Normalize API shape to UI model
        const hasUser = (val: unknown): val is { user: Partial<MeResponse> } =>
          typeof val === "object" &&
          val !== null &&
          "user" in (val as Record<string, unknown>);
        const u = (hasUser(data) ? data.user : data) as Partial<MeResponse> & {
          fullName?: string;
          avatarUrl?: string;
        };
        const mapped: FrontendUser = {
          name: u.fullName || "",
          school: u.school || "",
          id: u.id || "",
          rank: data.rank ?? 0,
          hub: (Array.isArray(data.hubs) && data.hubs[0]?.name) || "Unassigned",
          bio: u.bio || "",
          avatar: u.avatarUrl || "",
          email: u.email || "",
          phone: u.phoneNumber || "",
          facebook: u.facebook || "",
          totalPoints: data.points?.total ?? 0,
          badges: Array.isArray(data.badges) ? (data.badges as string[]) : [],
          goals: Number(data.totalGoals ?? 0),
          assists: Number(data.totalAssists ?? 0),
          yellowCards: Number(data.yellowCards ?? 0),
          redCards: Number(data.redCards ?? 0),
          appearances: Number(data.totalAppearances ?? 0),
        };
        if (isMounted) setUserData((prev) => ({ ...prev, ...mapped }));

        // Load schedule (upcoming + recent)
        const sched = await fetch(`${API_BASE_URL}/api/v1/dashboard/schedule`, {
          credentials: "include",
        });
        if (sched.ok) {
          const json = await sched.json();
          if (isMounted) {
            setUpcomingMatches(
              Array.isArray(json.upcoming) ? json.upcoming : []
            );
            setRecentMatches(Array.isArray(json.recent) ? json.recent : []);
          }
        }
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
      <div
        className={`min-h-screen bg-[#131314] text-white ${poppins.className}`}>
        <main className="container mx-auto px-6 py-8 animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="space-y-3">
              <div className="h-10 md:h-12 w-56 md:w-72 bg-white/10 rounded" />
              <div className="h-4 w-40 bg-white/5 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column skeleton */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information card skeleton */}
              <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-24 h-24 bg-white/10 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-white/10 rounded" />
                      <div className="h-4 w-32 bg-white/5 rounded" />
                      <div className="h-3 w-40 bg-white/5 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 w-36 bg-white/10 rounded" />
                          <div className="h-4 w-44 bg-white/5 rounded" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-20 bg-white/10 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* My Stats skeleton */}
              <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-xl p-6">
                <div className="mb-4 h-6 w-40 bg-white/10 rounded" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center bg-white/5 rounded-xl p-5">
                      <div className="w-10 h-10 bg-white/10 rounded-full mb-2" />
                      <div className="h-6 w-10 bg-white/10 rounded mb-1" />
                      <div className="h-3 w-16 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent results skeleton */}
              <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-xl p-6">
                <div className="mb-4 h-5 w-40 bg-white/10 rounded" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 w-56 bg-white/10 rounded" />
                        <div className="h-3 w-24 bg-white/5 rounded" />
                      </div>
                      <div className="h-6 w-20 bg-white/10 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column skeleton */}
            <div className="space-y-8">
              {/* Upcoming matches skeleton */}
              <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-xl p-6">
                <div className="mb-4 h-5 w-48 bg-white/10 rounded" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 w-56 bg-white/10 rounded" />
                        <div className="h-3 w-24 bg-white/5 rounded" />
                      </div>
                      <div className="h-6 w-20 bg-white/10 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions skeleton */}
              <div className="bg-white/5 backdrop-blur-md border-white/10 rounded-xl p-6 space-y-3">
                <div className="h-5 w-40 bg-white/10 rounded" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-white/10 rounded" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-[#131314] text-white ${poppins.className}`}>
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#131314] text-white ${poppins.className}`}>
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1
              className={`text-4xl md:text-5xl font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-2 ${garnet.className}`}>
              DASHBOARD
            </h1>
            <p className="text-gray-300 text-[18px]">
              Welcome back, {userData.name}!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0 shadow-xl">
              <CardHeader>
                <CardTitle
                  className={`text-xl font-bold text-white flex items-center gap-2 ${garnet.className}`}>
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
                <CardTitle
                  className={`text-2xl font-black text-white flex items-center gap-3 tracking-wide ${garnet.className}`}>
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
                <CardTitle
                  className={`text-lg font-bold text-white ${garnet.className}`}>
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
                        <div className="font-medium text-white text-[18px]">
                          {match.teamA} vs {match.teamB}
                        </div>
                        <div className="text-gray-400 text-[14px]">
                          {match.result}
                        </div>
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
                <CardTitle
                  className={`text-lg font-bold text-white ${garnet.className}`}>
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
                        <div className="font-bold text-center text-[18px] text-white">
                          {match.teamA} vs {match.teamB}
                        </div>
                        <div className="text-gray-400 text-[14px]">
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
