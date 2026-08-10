export const APP_NAME = "Ascend OS";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Profile", href: "/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];
