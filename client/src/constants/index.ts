export const APP_NAME = "Ascend OS";

const getApiBaseUrl = () => {
  // If explicitly overridden in environment to an external host (not local)
  if (
    process.env.NEXT_PUBLIC_API_URL &&
    !process.env.NEXT_PUBLIC_API_URL.includes("127.0.0.1") &&
    !process.env.NEXT_PUBLIC_API_URL.includes("localhost")
  ) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // If running in browser on Vercel deployment
  if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
    return "https://ai-habit-omega-backend.onrender.com";
  }
  // In the browser, an empty string routes through Next.js proxy rewrites to avoid CORS and port mismatches
  if (typeof window !== "undefined") {
    return "";
  }
  // Server-side default
  return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
};

export const API_BASE_URL = getApiBaseUrl();

export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
