"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Edit,
  Settings,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock user data
const userData = {
  name: "Ping Ling Zong",
  school: "Shinghwa High School",
  id: "UP-210-001",
  rank: 6,
  hub: "RUB-AXIS",
  bio: "A Clumsy Guy myself",
  avatar: "/placeholder.svg?height=120&width=120",
  email: "ping@gmail.com",
  phone: "+880-0000-00-0000",
  facebook: "@Ping4",
  totalPoints: 2090,
  badges: ["Strategist", "Team Player", "Rising Star"],
};

// Mock stats data
const performanceData = [
  { month: "Jan", goals: 2, assists: 1, matches: 4 },
  { month: "Feb", goals: 1, assists: 2, matches: 3 },
  { month: "Mar", goals: 3, assists: 1, matches: 5 },
  { month: "Apr", goals: 2, assists: 3, matches: 4 },
  { month: "May", goals: 4, assists: 2, matches: 6 },
  { month: "Jun", goals: 3, assists: 4, matches: 5 },
];

const individualStats = {
  goals: 15,
  assists: 13,
  yellowCards: 2,
  redCards: 0,
  appearances: 27,
  matchesWon: 18,
  matchesLost: 9,
};

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
  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    progress?: number;
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    progress,
  }: StatCardProps) => (
    <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-full bg-gradient-to-r ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-white">{value}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
        {progress && <Progress value={progress} className="h-2 bg-white/10" />}
      </CardContent>
    </Card>
  );

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
          <Button className="mt-4 md:mt-0 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] hover:from-[#7088b5] hover:to-[#9660a5] text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
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
                      <AvatarFallback>PZ</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#809bc8] text-white hover:bg-[#809bc8] bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
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
                          <span>{userData.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-[#809bc8]" />
                          <span>{userData.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-[#809bc8]" />
                          <span>Rank #{userData.rank}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-[#809bc8]" />
                          <span>Hub: {userData.hub}</span>
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

            {/* Performance Analytics */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  PERFORMANCE ANALYTICS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#303030" />
                      <XAxis dataKey="month" stroke="#809bc8" />
                      <YAxis stroke="#809bc8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#303030",
                          border: "1px solid #809bc8",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="goals"
                        stroke="#a76fb8"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="assists"
                        stroke="#809bc8"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="matches"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Individual Stats */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  MY STATS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <StatCard
                    title="GOALS"
                    value={individualStats.goals}
                    icon={Target}
                    color="from-green-500 to-green-600"
                    progress={75}
                  />
                  <StatCard
                    title="ASSISTS"
                    value={individualStats.assists}
                    icon={Users}
                    color="from-blue-500 to-blue-600"
                    progress={65}
                  />
                  <StatCard
                    title="CARDS"
                    value={`${individualStats.yellowCards}Y ${individualStats.redCards}R`}
                    icon={Award}
                    color="from-yellow-500 to-red-500"
                  />
                  <StatCard
                    title="APPEARANCES"
                    value={individualStats.appearances}
                    icon={Calendar}
                    color="from-purple-500 to-purple-600"
                    progress={90}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Matches & Quick Actions */}
          <div className="space-y-8">
            {/* Upcoming Matches */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
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
                        <div className="font-medium text-white">
                          {match.teamA} vs {match.teamB}
                        </div>
                        <div className="text-gray-400">
                          {match.date} • {match.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
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
        </div>
      </main>
    </div>
  );
}
