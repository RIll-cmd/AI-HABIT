export const APP_NAME = "Ascend OS";

const getApiBaseUrl = () => {
  // In the browser (both local dev Next.js rewrite proxy and production),
  // an empty string routes through relative /api paths on the current origin
  if (typeof window !== "undefined") {
    return "";
  }
  // Server-side default during SSR/build or explicit env override
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return "http://127.0.0.1:8000";
};

export const API_BASE_URL = getApiBaseUrl();

export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
