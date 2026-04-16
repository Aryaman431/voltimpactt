import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHours(hours: number): string {
  if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k`;
  return hours.toString();
}

export function getTierFromHours(hours: number): {
  tier: "bronze" | "silver" | "gold" | "platinum";
  label: string;
  nextTier: number | null;
  progress: number;
} {
  if (hours >= 500) {
    return { tier: "platinum", label: "Platinum", nextTier: null, progress: 100 };
  } else if (hours >= 200) {
    return { tier: "gold", label: "Gold", nextTier: 500, progress: ((hours - 200) / 300) * 100 };
  } else if (hours >= 50) {
    return { tier: "silver", label: "Silver", nextTier: 200, progress: ((hours - 50) / 150) * 100 };
  } else {
    return { tier: "bronze", label: "Bronze", nextTier: 50, progress: (hours / 50) * 100 };
  }
}

export function generateCheckInHash(eventId: string, userId: string): string {
  const raw = `${eventId}:${userId}:${Date.now()}`;
  return btoa(raw).replace(/=/g, "").slice(0, 12).toUpperCase();
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
