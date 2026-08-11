"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface StatData {
  id?: string;
  userId?: string;
  strength: number;
  endurance: number;
  discipline: number;
  knowledge: number;
  recovery: number;
  focus: number;
  consistency: number;
}

export interface MissionData {
  id: string;
  userId?: string;
  title: string;
  type: string;
  expReward: number;
  goldReward: number;
  completed: boolean;
}

export interface UserData {
  id: string;
  username: string;
  level: number;
  exp: number;
  gold: number;
  crystals: number;
  power: number;
  rank: string;
  title: string;
  guild: string;
  stats: StatData | null;
  missions: MissionData[];
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  toggleMission: (missionId: string) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  refetch: async () => {},
  toggleMission: () => {},
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const DEFAULT_USER: UserData = {
  id: "char-1",
  username: "Shadow Monarch",
  level: 1,
  exp: 0,
  gold: 500,
  crystals: 50,
  power: 97,
  rank: "F",
  title: "Hydration Monarch",
  guild: "Lone Ascendants",
  stats: {
    strength: 1,
    endurance: 1,
    discipline: 1,
    knowledge: 1,
    recovery: 1,
    focus: 1,
    consistency: 1,
  },
  missions: [],
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(DEFAULT_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/user/Shadow%20Monarch`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Backend returned HTTP status ${res.status}`);
      }
      const data: UserData = await res.json();
      setUser(data);
    } catch (err: unknown) {
      console.warn("Could not fetch user data from FastAPI backend, using fallback user profile:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to FastAPI backend server";
      setError(message);
      setUser((prev) => prev || DEFAULT_USER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, []);

  const toggleMission = (missionId: string) => {
    if (!user) return;
    setUser({
      ...user,
      missions: user.missions.map((m) =>
        m.id === missionId ? { ...m, completed: !m.completed } : m
      ),
    });
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, refetch: fetchUser, toggleMission }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
