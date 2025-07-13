"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  Search,
  Star,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

const events = [
  {
    id: 1,
    title: "Inter-School Football Championship",
    description:
      "Annual championship featuring top schools from across the region competing for the ultimate trophy.",
    date: "2024-01-15",
    time: "09:00 AM",
    location: "Central Sports Complex",
    category: "Football",
    status: "upcoming",
    participants: 16,
    maxParticipants: 16,
    prize: "$5,000",
    image: "/placeholder.svg?height=200&width=400",
    featured: true,
  },
  {
    id: 2,
    title: "Basketball Skills Workshop",
    description:
      "Learn advanced basketball techniques from professional coaches and improve your game.",
    date: "2024-01-20",
    time: "02:00 PM",
    location: "Indoor Basketball Court",
    category: "Basketball",
    status: "upcoming",
    participants: 8,
    maxParticipants: 20,
    prize: "Certificates",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
  {
    id: 3,
    title: "Cricket Tournament Finals",
    description:
      "The ultimate showdown between the top 4 teams in our regional cricket league.",
    date: "2024-01-25",
    time: "10:00 AM",
    location: "Main Cricket Ground",
    category: "Cricket",
    status: "upcoming",
    participants: 4,
    maxParticipants: 4,
    prize: "$3,000",
    image: "/placeholder.svg?height=200&width=400",
    featured: true,
  },
  {
    id: 4,
    title: "Sports Analytics Seminar",
    description:
      "Discover how data analytics is revolutionizing modern sports performance and strategy.",
    date: "2024-01-30",
    time: "11:00 AM",
    location: "Conference Hall A",
    category: "Seminar",
    status: "upcoming",
    participants: 45,
    maxParticipants: 100,
    prize: "Knowledge",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
  {
    id: 5,
    title: "Winter Sports Festival",
    description:
      "Multi-sport festival celebrating winter athletics with various competitions and activities.",
    date: "2024-02-05",
    time: "08:00 AM",
    location: "Sports Campus",
    category: "Multi-Sport",
    status: "upcoming",
    participants: 120,
    maxParticipants: 200,
    prize: "$10,000",
    image: "/placeholder.svg?height=200&width=400",
    featured: true,
  },
  {
    id: 6,
    title: "Football League Season Opener",
    description:
      "Kick off the new season with exciting matches and team presentations.",
    date: "2023-12-10",
    time: "03:00 PM",
    location: "Stadium A",
    category: "Football",
    status: "completed",
    participants: 12,
    maxParticipants: 12,
    prize: "$2,000",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || event.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const featuredEvents = filteredEvents.filter((event) => event.featured);
  const regularEvents = filteredEvents.filter((event) => !event.featured);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#131314] text-white">
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-4">
            EVENTS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover upcoming tournaments, workshops, and competitions. Join the
            action and showcase your skills!
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search events..."
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
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Football">Football</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                    <SelectItem value="Cricket">Cricket</SelectItem>
                    <SelectItem value="Multi-Sport">Multi-Sport</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#303030] border-white/20">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-8 h-8 text-yellow-500" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${getStatusColor(
                          event.status
                        )} text-white`}>
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-[#809bc8] to-[#a76fb8] text-white">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CalendarDays className="w-4 h-4 text-[#809bc8]" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 text-[#809bc8]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-[#809bc8]" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users className="w-4 h-4 text-[#809bc8]" />
                        <span>
                          {event.participants}/{event.maxParticipants}{" "}
                          participants
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Trophy className="w-4 h-4 text-[#809bc8]" />
                        <span>Prize: {event.prize}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-[#809bc8] to-[#a76fb8] hover:from-[#7088b5] hover:to-[#9660a5] text-white">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents.map((event) => (
              <Card
                key={event.id}
                className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      className={`${getStatusColor(event.status)} text-white`}>
                      {event.status.toUpperCase()}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-[#809bc8] text-[#809bc8]">
                      {event.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-white">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>
                        {event.participants}/{event.maxParticipants}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-[#809bc8] text-[#809bc8] hover:bg-[#809bc8] hover:text-white bg-transparent">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No events found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search criteria or check back later for new
              events.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
