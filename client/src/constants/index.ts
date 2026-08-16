export const APP_NAME = "Ascend OS";

const getApiBaseUrl = () => {
  // If explicitly overridden in environment to an external host
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  // If running in browser on Vercel deployment without custom env var
  if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return "https://ai-habit-omega-backend.onrender.com";
  }
  // In the browser locally, an empty string routes through Next.js proxy rewrites
  if (typeof window !== "undefined") {
    return "";
  }
  // Server-side default
  return "http://127.0.0.1:8000";
};

export const API_BASE_URL = getApiBaseUrl();

export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
