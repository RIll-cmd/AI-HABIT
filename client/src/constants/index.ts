export const APP_NAME = "Ascend OS";

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return "https://ai-habit-omega-backend.onrender.com";
  }
  return "http://127.0.0.1:8000";
};

export const API_BASE_URL = getApiBaseUrl();

export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
