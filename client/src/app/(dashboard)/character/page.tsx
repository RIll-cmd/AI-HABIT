"use client";

import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("../profile/page"), { ssr: false });

export default function CharacterPage() {
  return <ProfilePage />;
}
