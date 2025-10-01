"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Search,
  Star,
  CalendarDays,
} from "lucide-react";
import { garnet, poppins } from "../../fonts";

type EventItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  scheduledAt: string;
  location: string;
  prize?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/events`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setEvents(data.events);
      } catch {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Auto status helpers
  const isEventCompleted = (scheduledAt: string) => {
    const now = Date.now();
    return new Date(scheduledAt).getTime() < now;
  };
  const getStatusLabel = (scheduledAt: string) =>
    isEventCompleted(scheduledAt) ? "COMPLETED" : "UPCOMING";
  const getStatusClass = (scheduledAt: string) =>
    isEventCompleted(scheduledAt) ? "bg-gray-500" : "bg-blue-500";

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const completed = isEventCompleted(e.scheduledAt);
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "completed" && completed) ||
      (selectedStatus === "upcoming" && !completed);
    return matchesSearch && matchesStatus;
  });
  const featuredEvents = filteredEvents.slice(0, 2);
  const regularEvents = filteredEvents; // show all in All Events

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className={`min-h-screen bg-[#131314] text-white ${poppins.className}`}>
      <main className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1
            className={`text-5xl md:text-6xl font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent mb-4 ${garnet.className}`}>
            EVENTS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover upcoming tournaments, workshops, and competitions. Join the
            action and showcase your skills!
          </p>
        </div>

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
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 p-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2
              className={`text-3xl font-bold text-white mb-6 flex items-center gap-2 ${garnet.className}`}>
              <Star className="w-8 h-8 text-yellow-500" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-4 left-8">
                      <Badge
                        className={`${getStatusClass(
                          event.scheduledAt
                        )} text-white`}>
                        {getStatusLabel(event.scheduledAt)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-10">
                      <Badge className="bg-gradient-to-r from-[#809bc8] to-[#a76fb8] text-white">
                        Event
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    {event.subtitle && (
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {event.subtitle}
                      </p>
                    )}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CalendarDays className="w-4 h-4 text-[#809bc8]" />
                        <span>{formatDate(event.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 text-[#809bc8]" />
                        <span>{formatTime(event.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-[#809bc8]" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Trophy className="w-4 h-4 text-[#809bc8]" />
                        <span>Prize: {event.prize ?? "-"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <div>
            <h2
              className={`text-3xl font-bold text-white mb-6 ${garnet.className}`}>
              All Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        className={`${getStatusClass(
                          event.scheduledAt
                        )} text-white`}>
                        {getStatusLabel(event.scheduledAt)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[#809bc8] text-[#809bc8]">
                        Event
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-white">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {event.subtitle && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {event.subtitle}
                      </p>
                    )}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(event.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(event.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Trophy className="w-3 h-3" />
                        <span>Prize: {event.prize ?? "-"}</span>
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
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3
              className={`text-xl font-semibold text-gray-300 mb-2 ${garnet.className}`}>
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
