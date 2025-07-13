"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Medal,
  Award,
  Search,
  Filter,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";

// Mock data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    name: "Ching chong bhai",
    school: "Ching Low School",
    points: 2450,
    rank: 1,

    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
  {
    id: 2,
    name: "Pong bhai",
    school: "Pong Ultra High School",
    points: 2380,
    rank: 2,
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
  {
    id: 3,
    name: "Ping bhai",
    school: "Channghua High School",
    points: 2290,
    rank: 3,

    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
  {
    id: 4,
    name: "Alex Rahman",
    school: "Dhaka International School",
    points: 2180,
    rank: 4,

    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
  {
    id: 5,
    name: "Sarah Khan",
    school: "Chittagong Grammar School",
    points: 2150,
    rank: 5,

    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
  {
    id: 6,
    name: "Mohammad Ali",
    school: "Sylhet Cadet College",
    points: 2090,
    rank: 6,

    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
  {
    id: 7,
    name: "Fatima Ahmed",
    school: "Rajshahi College",
    points: 2020,
    rank: 7,

    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
  {
    id: 8,
    name: "Karim Hassan",
    school: "Barisal Zilla School",
    points: 1980,
    rank: 8,
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Football",
  },
];

const stats = [
  { label: "Total Players", value: "1,247", icon: Users },
  { label: "Active This Week", value: "892", icon: TrendingUp },
  { label: "Total Points Awarded", value: "45,230", icon: Target },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all-time");

  const filteredData = leaderboardData.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-[#809bc8]">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-white">
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-4">
            LEADERBOARD
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Compete with the best players and climb your way to the top of the
            rankings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-[#809bc8] to-[#a76fb8] rounded-lg">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top 3 Podium */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">
              🏆 Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-end space-x-8 py-8">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <Avatar className="w-16 h-16 mb-3 border-4 border-gray-400">
                  <AvatarImage
                    src={leaderboardData[1].avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>PB</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-white text-center">
                  {leaderboardData[1].name}
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  {leaderboardData[1].school}
                </p>
                <p className="text-lg font-bold text-[#a76fb8]">
                  {leaderboardData[1].points} pts
                </p>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <Avatar className="w-20 h-20 mb-3 border-4 border-yellow-500">
                  <AvatarImage
                    src={leaderboardData[0].avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-white text-center">
                  {leaderboardData[0].name}
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  {leaderboardData[0].school}
                </p>
                <p className="text-xl font-bold text-[#a76fb8]">
                  {leaderboardData[0].points} pts
                </p>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <Avatar className="w-16 h-16 mb-3 border-4 border-amber-600">
                  <AvatarImage
                    src={leaderboardData[2].avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>PB</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-white text-center">
                  {leaderboardData[2].name}
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  {leaderboardData[2].school}
                </p>
                <p className="text-lg font-bold text-[#a76fb8]">
                  {leaderboardData[2].points} pts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search players or schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#303030] border-white/20">
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#303030] border-white/20">
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Filter className="w-6 h-6" />
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {filteredData.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-all duration-300 border-b border-white/5 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(player.rank)}
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={player.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {player.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">
                        {player.name}
                      </h3>
                      <p className="text-sm text-gray-400">{player.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-bold text-lg text-white">
                        {player.points}
                      </p>
                      <p className="text-sm text-gray-400">points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <Button className="bg-gradient-to-r from-[#809bc8] to-[#a76fb8] hover:from-[#7088b5] hover:to-[#9660a5] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300">
            Load More Players
          </Button>
        </div>
      </main>
    </div>
  );
}
