import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Contacted: "bg-blue-100 text-blue-800 border-blue-200",
  Confirmed: "bg-purple-100 text-purple-800 border-purple-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
};

export const STATUSES = ["Pending", "Contacted", "Confirmed", "Completed"] as const;
export type Status = (typeof STATUSES)[number];
