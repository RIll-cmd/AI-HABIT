import React from "react";
import { MissionWizard } from "@/features/habits/components/MissionWizard";

export const metadata = {
  title: "Forge Mission | Ascend OS",
  description: "Create a new permanent habit template routine",
};

export default function CreateMissionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] py-8 px-4">
      <MissionWizard />
    </div>
  );
}
