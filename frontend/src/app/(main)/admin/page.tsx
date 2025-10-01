"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { garnet, poppins } from "../../fonts";

type Hub = {
  id: string;
  name: string;
  type: "ESPORTS" | "OUTDOOR";
  location: string;
  capacity: number;
};
type Match = {
  id: string;
  homeHubId: string;
  awayHubId: string;
  scheduledAt: string;
  status: string;
  homeScore?: number | null;
  awayScore?: number | null;
  resultNote?: string | null;
  homeHub?: Hub;
  awayHub?: Hub;
};
type User = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  hubId?: string | null;
  hub?: Hub | null;
  totalGoals: number;
  totalAssists: number;
  totalAppearances: number;
  yellowCards: number;
  redCards: number;
  verified: boolean;
};

type Event = {
  id: string;
  title: string;
  subtitle?: string | null;
  scheduledAt: string;
  location: string;
  prize?: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [summary, setSummary] = useState<{
    users: number;
    hubs: number;
    matches: number;
  } | null>(null);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [originalMatches, setOriginalMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    subtitle?: string;
    date: string;
    time: string;
    location: string;
    prize?: string;
  }>({ title: "", subtitle: "", date: "", time: "", location: "", prize: "" });
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);

  // Forms
  const [newHub, setNewHub] = useState<{
    name: string;
    type: "ESPORTS" | "OUTDOOR";
    location: string;
    capacity?: number;
  }>({ name: "", type: "OUTDOOR", location: "", capacity: 30 });
  const [newMatch, setNewMatch] = useState<{
    homeHubId: string;
    awayHubId: string;
    scheduledAt: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    homeScore?: number;
    awayScore?: number;
    resultNote?: string;
  }>({ homeHubId: "", awayHubId: "", scheduledAt: "", status: "SCHEDULED" });

  const hubMap = useMemo(
    () => Object.fromEntries(hubs.map((h) => [h.id, h])),
    [hubs]
  );

  async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
    if (res.status === 401 || res.status === 403) {
      setAuthorized(false);
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [
        { users: uCount, hubs: hCount, matches: mCount },
        hubRes,
        matchRes,
        userRes,
        eventRes,
      ] = await Promise.all([
        api<{ users: number; hubs: number; matches: number }>(
          "/api/v1/admin/summary"
        ),
        api<{ hubs: Hub[] }>("/api/v1/admin/hubs"),
        api<{ matches: Match[] }>("/api/v1/admin/matches"),
        api<{ users: (User & { hub: Hub | null })[] }>("/api/v1/admin/users"),
        api<{ events: Event[] }>("/api/v1/admin/events"),
      ]);
      setSummary({ users: uCount, hubs: hCount, matches: mCount });
      setHubs(hubRes.hubs);
      setMatches(matchRes.matches);
      setOriginalMatches(matchRes.matches);
      setUsers(userRes.users);
      setOriginalUsers(userRes.users);
      setEvents(eventRes.events);
      setAuthorized(true);
    } catch (err: unknown) {
      if (!(err instanceof Error) || err.message !== "Unauthorized")
        setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  // Helpers
  function toDateTimeLocal(value: string) {
    const d = new Date(value);
    // Format as YYYY-MM-DDTHH:MM for input[type=datetime-local]
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  function isSameMinute(a: string, b: string) {
    const da = new Date(a);
    const db = new Date(b);
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate() &&
      da.getHours() === db.getHours() &&
      da.getMinutes() === db.getMinutes()
    );
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createHub() {
    try {
      await api(`/api/v1/admin/hubs`, {
        method: "POST",
        body: JSON.stringify(newHub),
      });
      setNewHub({ name: "", type: "OUTDOOR", location: "", capacity: 30 });
      await loadAll();
    } catch {
      setError("Failed to create hub");
    }
  }

  async function createMatch() {
    try {
      await api(`/api/v1/admin/matches`, {
        method: "POST",
        body: JSON.stringify(newMatch),
      });
      setNewMatch({
        homeHubId: "",
        awayHubId: "",
        scheduledAt: "",
        status: "SCHEDULED",
      });
      await loadAll();
    } catch {
      setError("Failed to create match");
    }
  }

  async function saveUser(u: User) {
    try {
      await api(`/api/v1/admin/users/${u.id}`, {
        method: "PUT",
        body: JSON.stringify({
          fullName: u.fullName,
          email: u.email,
          phoneNumber: u.phoneNumber,
          hubId: u.hubId || null,
          totalGoals: u.totalGoals,
          totalAssists: u.totalAssists,
          totalAppearances: u.totalAppearances,
          yellowCards: u.yellowCards,
          redCards: u.redCards,
          verified: !!u.verified,
        }),
      });
      await loadAll();
    } catch {
      setError("Failed to save user");
    }
  }

  function isDirty(u: User, orig?: User | undefined) {
    if (!orig) return true;
    return (
      (u.hubId || "") !== (orig.hubId || "") ||
      u.totalGoals !== orig.totalGoals ||
      u.totalAssists !== orig.totalAssists ||
      u.yellowCards !== orig.yellowCards ||
      u.redCards !== orig.redCards ||
      u.totalAppearances !== orig.totalAppearances ||
      u.verified !== orig.verified
    );
  }

  if (!authorized) {
    return (
      <div
        className={`min-h-screen bg-[#131314] text-white flex items-center justify-center p-8 ${poppins.className}`}>
        <div className="max-w-lg text-center space-y-4">
          <h1 className={`text-3xl font-bold ${garnet.className}`}>
            Admin Access Required
          </h1>
          <p className="text-white">
            You are not authorized to view this page. Log in with an admin
            account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#131314] text-white ${poppins.className}`}>
      <main className="container mx-auto px-6 py-8 space-y-8">
        <h1
          className={`text-4xl font-black bg-gradient-to-r from-[#809bc8] to-[#a76fb8] bg-clip-text text-transparent ${garnet.className}`}>
          Admin Panel
        </h1>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 p-3 rounded">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0">
            <CardHeader>
              <CardTitle className={`text-white ${garnet.className}`}>
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {summary?.users ?? (loading ? "…" : 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0">
            <CardHeader>
              <CardTitle className={`text-white ${garnet.className}`}>
                Hubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {summary?.hubs ?? (loading ? "…" : 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0">
            <CardHeader>
              <CardTitle className={`text-white ${garnet.className}`}>
                Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {summary?.matches ?? (loading ? "…" : 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hubs */}
        <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0">
          <CardHeader>
            <CardTitle className={`text-left text-white ${garnet.className}`}>
              Manage Hubs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Hub name"
                value={newHub.name}
                onChange={(e) => setNewHub({ ...newHub, name: e.target.value })}
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <Select
                value={newHub.type}
                onValueChange={(v: "ESPORTS" | "OUTDOOR") =>
                  setNewHub({ ...newHub, type: v })
                }>
                <SelectTrigger className="bg-[#1c1d22] text-white border-white/10">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c1d22] text-white border-white/10">
                  <SelectItem className="text-white" value="OUTDOOR">
                    OUTDOOR
                  </SelectItem>
                  <SelectItem className="text-white" value="ESPORTS">
                    ESPORTS
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Location"
                value={newHub.location}
                onChange={(e) =>
                  setNewHub({ ...newHub, location: e.target.value })
                }
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Capacity"
                  value={newHub.capacity ?? 30}
                  onChange={(e) =>
                    setNewHub({ ...newHub, capacity: Number(e.target.value) })
                  }
                  className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
                />
                <Button onClick={createHub} className="whitespace-nowrap">
                  Add Hub
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead className="text-left text-white">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {hubs.map((h) => (
                    <tr key={h.id} className="border-t border-white/10">
                      <td className="p-2">{h.name}</td>
                      <td className="p-2">{h.type}</td>
                      <td className="p-2">{h.location}</td>
                      <td className="p-2">{h.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Matches */}
        <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0">
          <CardHeader>
            <CardTitle className={`text-left text-white ${garnet.className}`}>
              Manage Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Select
                value={newMatch.homeHubId}
                onValueChange={(v) =>
                  setNewMatch({ ...newMatch, homeHubId: v })
                }>
                <SelectTrigger className="bg-[#1c1d22] text-white border-white/10">
                  <SelectValue placeholder="Home Hub" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c1d22] text-white border-white/10">
                  {hubs.map((h) => (
                    <SelectItem className="text-white" value={h.id} key={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newMatch.awayHubId}
                onValueChange={(v) =>
                  setNewMatch({ ...newMatch, awayHubId: v })
                }>
                <SelectTrigger className="bg-[#1c1d22] text-white border-white/10">
                  <SelectValue placeholder="Away Hub" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c1d22] text-white border-white/10">
                  {hubs.map((h) => (
                    <SelectItem className="text-white" value={h.id} key={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="datetime-local"
                value={newMatch.scheduledAt}
                onChange={(e) =>
                  setNewMatch({ ...newMatch, scheduledAt: e.target.value })
                }
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <Select
                value={newMatch.status}
                onValueChange={(v: "SCHEDULED" | "COMPLETED" | "CANCELLED") =>
                  setNewMatch({ ...newMatch, status: v })
                }>
                <SelectTrigger className="bg-[#1c1d22] text-white border-white/10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c1d22] text-white border-white/10">
                  <SelectItem className="text-white" value="SCHEDULED">
                    SCHEDULED
                  </SelectItem>
                  <SelectItem className="text-white" value="COMPLETED">
                    COMPLETED
                  </SelectItem>
                  <SelectItem className="text-white" value="CANCELLED">
                    CANCELLED
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={createMatch}>Add Match</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead className="text-left text-white">
                  <tr>
                    <th className="p-2">Teams</th>
                    <th className="p-2">When</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Score</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, idx) => {
                    const orig = originalMatches.find((x) => x.id === m.id);
                    const dirty = !orig
                      ? true
                      : !isSameMinute(m.scheduledAt, orig.scheduledAt) ||
                        m.status !== orig.status ||
                        (m.homeScore ?? null) !== (orig.homeScore ?? null) ||
                        (m.awayScore ?? null) !== (orig.awayScore ?? null);
                    return (
                      <tr key={m.id} className="border-t border-white/10">
                        <td className="p-2">
                          {hubMap[m.homeHubId]?.name} vs{" "}
                          {hubMap[m.awayHubId]?.name}
                        </td>
                        <td className="p-2 w-56">
                          <Input
                            type="datetime-local"
                            value={toDateTimeLocal(m.scheduledAt)}
                            onChange={(e) =>
                              setMatches((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { ...x, scheduledAt: e.target.value }
                                    : x
                                )
                              )
                            }
                            className="bg-[#1c1d22] text-white border-white/10"
                          />
                        </td>
                        <td className="p-2 w-44">
                          <Select
                            value={m.status}
                            onValueChange={(v) =>
                              setMatches((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, status: v } : x
                                )
                              )
                            }>
                            <SelectTrigger className="bg-[#1c1d22] text-white border-white/10">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1c1d22] text-white border-white/10">
                              <SelectItem
                                className="text-white"
                                value="SCHEDULED">
                                SCHEDULED
                              </SelectItem>
                              <SelectItem
                                className="text-white"
                                value="COMPLETED">
                                COMPLETED
                              </SelectItem>
                              <SelectItem
                                className="text-white"
                                value="CANCELLED">
                                CANCELLED
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 w-40">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Home"
                              value={m.homeScore ?? ""}
                              onChange={(e) =>
                                setMatches((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? {
                                          ...x,
                                          homeScore:
                                            e.target.value === ""
                                              ? null
                                              : Number(e.target.value),
                                        }
                                      : x
                                  )
                                )
                              }
                              className="bg-[#1c1d22] text-white border-white/10 w-20"
                            />
                            <span>-</span>
                            <Input
                              type="number"
                              placeholder="Away"
                              value={m.awayScore ?? ""}
                              onChange={(e) =>
                                setMatches((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? {
                                          ...x,
                                          awayScore:
                                            e.target.value === ""
                                              ? null
                                              : Number(e.target.value),
                                        }
                                      : x
                                  )
                                )
                              }
                              className="bg-[#1c1d22] text-white border-white/10 w-20"
                            />
                          </div>
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            size="sm"
                            disabled={!dirty}
                            onClick={async () => {
                              try {
                                await api(`/api/v1/admin/matches/${m.id}`, {
                                  method: "PUT",
                                  body: JSON.stringify({
                                    homeHubId: m.homeHubId,
                                    awayHubId: m.awayHubId,
                                    scheduledAt: toDateTimeLocal(m.scheduledAt),
                                    status: m.status,
                                    homeScore: m.homeScore,
                                    awayScore: m.awayScore,
                                  }),
                                });
                                await loadAll();
                              } catch {
                                setError("Failed to save match");
                              }
                            }}
                            className={
                              !dirty
                                ? "opacity-50 pointer-events-none"
                                : undefined
                            }>
                            Save
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0">
          <CardHeader>
            <CardTitle className={`text-left text-white ${garnet.className}`}>
              Manage Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm align-middle text-white">
                <thead className="text-left text-white">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Verified</th>
                    <th className="p-2">Hub</th>
                    <th className="p-2">Goals</th>
                    <th className="p-2">Assists</th>
                    <th className="p-2">Yellow</th>
                    <th className="p-2">Red</th>
                    <th className="p-2">Apps</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u.id} className="border-t border-white/10">
                      <td className="p-2">{u.fullName}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={!!u.verified}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? { ...x, verified: e.target.checked }
                                  : x
                              )
                            )
                          }
                          className="h-4 w-4 accent-[#809bc8] cursor-pointer"
                          aria-label={`Toggle verified for ${u.fullName}`}
                        />
                      </td>
                      <td className="p-2">
                        <Select
                          value={u.hubId || ""}
                          onValueChange={(v) =>
                            setUsers((prev) =>
                              prev.map((x, i) =>
                                i === idx ? { ...x, hubId: v } : x
                              )
                            )
                          }>
                          <SelectTrigger className="bg-[#1c1d22] text-white border-white/10">
                            <SelectValue placeholder="Assign hub" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1c1d22] text-white border-white/10">
                            <SelectItem className="text-white" value="">
                              Unassigned
                            </SelectItem>
                            {hubs.map((h) => (
                              <SelectItem
                                className="text-white"
                                key={h.id}
                                value={h.id}>
                                {h.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 w-20">
                        <Input
                          type="number"
                          value={u.totalGoals}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? { ...x, totalGoals: Number(e.target.value) }
                                  : x
                              )
                            )
                          }
                          className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <Input
                          type="number"
                          value={u.totalAssists}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      totalAssists: Number(e.target.value),
                                    }
                                  : x
                              )
                            )
                          }
                          className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <Input
                          type="number"
                          value={u.yellowCards}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      yellowCards: Number(e.target.value),
                                    }
                                  : x
                              )
                            )
                          }
                          className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <Input
                          type="number"
                          value={u.redCards}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? { ...x, redCards: Number(e.target.value) }
                                  : x
                              )
                            )
                          }
                          className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <Input
                          type="number"
                          value={u.totalAppearances}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x, i) =>
                                i === idx
                                  ? {
                                      ...x,
                                      totalAppearances: Number(e.target.value),
                                    }
                                  : x
                              )
                            )
                          }
                          className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <Button
                          size="sm"
                          disabled={
                            !isDirty(
                              u,
                              originalUsers.find((o) => o.id === u.id)
                            )
                          }
                          onClick={() => saveUser(users[idx])}
                          className={
                            !isDirty(
                              u,
                              originalUsers.find((o) => o.id === u.id)
                            )
                              ? "opacity-50 pointer-events-none"
                              : undefined
                          }>
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Events */}
        <Card className="bg-gradient-to-br from-[#23243a] to-[#18191f] border-0">
          <CardHeader>
            <CardTitle className={`text-left text-white ${garnet.className}`}>
              Manage Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <Input
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <Input
                placeholder="Subtitle"
                value={newEvent.subtitle}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, subtitle: e.target.value })
                }
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <Input
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Prize"
                  value={newEvent.prize}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, prize: e.target.value })
                  }
                  className="bg-[#1c1d22] text-white placeholder:text-gray-400 border-white/10"
                />
                <Button
                  onClick={async () => {
                    try {
                      await api(`/api/v1/admin/events`, {
                        method: "POST",
                        body: JSON.stringify(newEvent),
                      });
                      setNewEvent({
                        title: "",
                        subtitle: "",
                        date: "",
                        time: "",
                        location: "",
                        prize: "",
                      });
                      await loadAll();
                    } catch {
                      setError("Failed to create event");
                    }
                  }}>
                  Add Event
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead className="text-left text-white">
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2">When</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.id} className="border-t border-white/10">
                      <td className="p-2">{e.title}</td>
                      <td className="p-2">
                        {new Date(e.scheduledAt).toLocaleString()}
                      </td>
                      <td className="p-2">{e.location}</td>
                      <td className="p-2">{e.prize ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
