"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  MuscleGroupKey,
  MuscleData,
  MuscleRecoveryStatusResponse,
} from "@/features/workouts/types/muscleRecovery";
import {
  MUSCLE_TRAINING_GUIDE,
  MuscleTrainingInfo,
} from "@/features/workouts/data/muscleTrainingGuide";
import {
  Activity,
  Flame,
  Zap,
  Info,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Layers,
  Dumbbell,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BodyHeatmapProps {
  recoveryStatus?: MuscleRecoveryStatusResponse | null;
  onSelectMuscle?: (muscleKey: MuscleGroupKey) => void;
  selectedMuscleKey?: MuscleGroupKey | null;
  variant?: "full" | "compact" | "card";
  className?: string;
  allowToggleView?: boolean;
  defaultView?: "front" | "back" | "dual";
}

export const BodyHeatmap: React.FC<BodyHeatmapProps> = ({
  recoveryStatus,
  onSelectMuscle,
  selectedMuscleKey = null,
  variant = "full",
  className = "",
  allowToggleView = true,
  defaultView = "dual",
}) => {
  const [activeView, setActiveView] = useState<"front" | "back" | "dual">(
    variant === "compact" ? "front" : defaultView
  );
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroupKey | null>(null);
  const [activeModalMuscle, setActiveModalMuscle] = useState<MuscleGroupKey | null>(
    selectedMuscleKey
  );
  const [inspectorTab, setInspectorTab] = useState<"telemetry" | "exercises" | "cues">("telemetry");

  // 1-Second Hover Tooltip State & Positioning
  const [mounted, setMounted] = useState(false);
  const [tooltipMuscle, setTooltipMuscle] = useState<MuscleGroupKey | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleMuscleMouseEnter = (key: MuscleGroupKey, e: React.MouseEvent) => {
    setHoveredMuscle(key);
    const x = e.clientX;
    const y = e.clientY;
    setCursorPos({ x, y });

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setTooltipMuscle(key);
    }, 1000); // 1-Second Hover Requirement
  };

  const handleMuscleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleMuscleMouseLeave = () => {
    setHoveredMuscle(null);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setTooltipMuscle(null);
  };

  const muscles: Partial<Record<MuscleGroupKey, MuscleData>> = recoveryStatus?.muscles || {};

  const getMuscleData = (key: MuscleGroupKey): MuscleData => {
    return (
      muscles[key] || {
        id: key,
        name: key.replace("_", " "),
        view: "both",
        category: "UPPER_PUSH",
        freshness: 100,
        fatigue: 0,
        hoursRemaining: 0,
        status: "FRESH",
        lastTrainedAt: null,
        fullRecoveryHours: 48,
      }
    );
  };

  // Color mapper based on dynamic freshness
  const getMuscleFill = (key: MuscleGroupKey, isHovered: boolean, isSelected: boolean) => {
    const data = getMuscleData(key);
    const f = data.freshness;

    let baseColor = "#06b6d4"; // 100% fresh default cyan
    let glowColor = "rgba(6,182,212,0.4)";

    if (f < 40) {
      baseColor = "#ef4444"; // Fatigued Red
      glowColor = "rgba(239,68,68,0.6)";
    } else if (f < 80) {
      baseColor = "#f59e0b"; // Recovering Amber
      glowColor = "rgba(245,158,11,0.5)";
    } else {
      baseColor = "#06b6d4"; // Fresh Cyan
      glowColor = "rgba(6,182,212,0.5)";
    }

    if (isSelected) {
      return {
        fill: baseColor,
        stroke: "#ffffff",
        strokeWidth: 2.5,
        filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))",
      };
    }

    if (isHovered) {
      return {
        fill: baseColor,
        stroke: "#38bdf8",
        strokeWidth: 2.0,
        filter: `drop-shadow(0 0 10px ${glowColor})`,
      };
    }

    return {
      fill: baseColor,
      fillOpacity: 0.85,
      stroke: "#0f172a",
      strokeWidth: 1.2,
      filter: f < 40 ? `drop-shadow(0 0 6px ${glowColor})` : undefined,
    };
  };

  const handleMuscleClick = (key: MuscleGroupKey) => {
    setActiveModalMuscle(key);
    if (onSelectMuscle) onSelectMuscle(key);
  };

  const currentFocusedKey = hoveredMuscle || activeModalMuscle || "CHEST";
  const focusedData = getMuscleData(currentFocusedKey);
  const focusedGuide = MUSCLE_TRAINING_GUIDE[currentFocusedKey] || MUSCLE_TRAINING_GUIDE.CHEST;

  // Quick formatter for hours remaining
  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0.1) return "100% Recovered (Prime Condition)";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m > 0 ? `${m}m` : ""} until fully fresh`;
  };

  const getPathProps = (key: MuscleGroupKey) => ({
    className: "cursor-pointer transition-all duration-200 hover:opacity-100",
    ...getMuscleFill(key, hoveredMuscle === key, activeModalMuscle === key),
    onMouseEnter: (e: React.MouseEvent) => handleMuscleMouseEnter(key, e),
    onMouseMove: handleMuscleMouseMove,
    onMouseLeave: handleMuscleMouseLeave,
    onClick: () => handleMuscleClick(key),
  });

  const renderFrontSilhouette = () => (
    <svg
      viewBox="0 0 240 400"
      className="w-full h-auto max-h-[390px] select-none transition-all duration-300 drop-shadow-2xl"
    >
      <defs>
        <filter id="neon-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.8" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-glow-amber" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.8" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neon-glow-red" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.8" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Organic Anatomical Background Silhouette Layer */}
      <g className="fill-[#090e1d] stroke-[#1e293b] stroke-[1.2]">
        {/* Head & Cranium */}
        <path d="M120 14 C110 14 104 22 104 34 C104 46 111 54 120 54 C129 54 136 46 136 34 C136 22 130 14 120 14 Z" />
        {/* Neck, Torso & Athletic Body Outer Outline */}
        <path d="M112 52 C104 60 92 68 76 74 C62 80 52 94 50 110 C48 126 50 146 44 162 C38 178 34 204 36 222 C37 232 45 236 52 234 C58 226 62 208 66 188 C70 172 74 154 78 136 C80 152 82 180 84 200 C86 210 92 216 98 218 C88 228 80 248 78 270 C76 290 80 306 86 312 C82 322 80 340 82 358 C84 374 90 384 98 386 C104 386 108 376 108 360 C108 340 106 322 104 314 C108 306 112 290 114 274 C116 256 118 238 120 226 C122 238 124 256 126 274 C128 290 132 306 136 314 C134 322 132 340 132 360 C132 376 136 386 142 386 C150 384 156 374 158 358 C160 340 158 322 154 312 C160 306 164 290 162 270 C160 248 152 228 142 218 C148 216 154 210 156 200 C158 180 160 152 162 136 C166 154 170 172 174 188 C178 208 182 226 188 234 C195 236 203 232 204 222 C206 204 202 178 196 162 C190 146 192 126 190 110 C188 94 178 80 164 74 C148 68 136 60 128 52 Z" />
      </g>

      {/* Discrete Organic Anatomical Muscle Paths (Front View) */}
      <g id="muscles_front">
        {/* CHEST (Pectoralis Major & Minor) */}
        <path
          id="chest_left"
          d="M118 76 C108 76 96 79 86 86 C80 92 79 106 80 116 C86 123 104 125 118 123 C118 108 118 92 118 76 Z"
          {...getPathProps("CHEST")}
        />
        <path
          id="chest_right"
          d="M122 76 C132 76 144 79 154 86 C160 92 161 106 160 116 C154 123 136 125 122 123 C122 108 122 92 122 76 Z"
          {...getPathProps("CHEST")}
        />

        {/* FRONT DELTS (Anterior Deltoids) */}
        <path
          id="front_delts_left"
          d="M84 76 C78 80 72 87 70 95 C70 103 74 108 80 108 C83 103 84 93 84 76 Z"
          {...getPathProps("FRONT_DELTS")}
        />
        <path
          id="front_delts_right"
          d="M156 76 C162 80 168 87 170 95 C170 103 166 108 160 108 C157 103 156 93 156 76 Z"
          {...getPathProps("FRONT_DELTS")}
        />

        {/* SHOULDERS (Lateral Deltoid Sweep) */}
        <path
          id="shoulders_left"
          d="M70 82 C62 88 56 98 56 108 C56 116 62 120 68 114 C70 105 70 94 70 82 Z"
          {...getPathProps("SHOULDERS")}
        />
        <path
          id="shoulders_right"
          d="M170 82 C178 88 184 98 184 108 C184 116 178 120 172 114 C170 105 170 94 170 82 Z"
          {...getPathProps("SHOULDERS")}
        />

        {/* BICEPS (Biceps Brachii Peak & Inner Sweep) */}
        <path
          id="biceps_left"
          d="M66 114 C58 118 52 128 52 142 C52 152 60 156 66 150 C72 142 72 126 66 114 Z"
          {...getPathProps("BICEPS")}
        />
        <path
          id="biceps_right"
          d="M174 114 C182 118 188 128 188 142 C188 152 180 156 174 150 C168 142 168 126 174 114 Z"
          {...getPathProps("BICEPS")}
        />

        {/* FOREARMS (Brachioradialis & Forearm Flexors) */}
        <path
          id="forearms_left"
          d="M50 156 C42 166 38 186 40 206 C42 214 48 214 52 204 C56 190 62 172 62 156 Z"
          {...getPathProps("FOREARMS")}
        />
        <path
          id="forearms_right"
          d="M190 156 C198 166 202 186 200 206 C198 214 192 214 188 204 C184 190 178 172 178 156 Z"
          {...getPathProps("FOREARMS")}
        />

        {/* ABDOMINALS (6-Pack Rectus Abdominis Segments) */}
        {/* Upper Abs */}
        <path
          id="abs_upper_left"
          d="M106 126 C103 126 100 128 100 136 C100 143 103 146 106 146 C112 146 117 146 117 146 C117 139 117 132 117 126 Z"
          {...getPathProps("ABS")}
        />
        <path
          id="abs_upper_right"
          d="M134 126 C137 126 140 128 140 136 C140 143 137 146 134 146 C128 146 123 146 123 146 C123 139 123 132 123 126 Z"
          {...getPathProps("ABS")}
        />
        {/* Mid Abs */}
        <path
          id="abs_mid_left"
          d="M106 149 C103 149 100 152 100 160 C100 168 103 171 106 171 C112 171 117 171 117 171 C117 164 117 156 117 149 Z"
          {...getPathProps("ABS")}
        />
        <path
          id="abs_mid_right"
          d="M134 149 C137 149 140 152 140 160 C140 168 137 171 134 171 C128 171 123 171 123 171 C123 164 123 156 123 149 Z"
          {...getPathProps("ABS")}
        />
        {/* Lower Abs / V-Taper */}
        <path
          id="abs_lower_left"
          d="M107 174 C104 174 102 177 102 187 C102 197 107 205 111 207 C114 207 117 199 117 189 C117 181 117 174 117 174 Z"
          {...getPathProps("ABS")}
        />
        <path
          id="abs_lower_right"
          d="M133 174 C136 174 138 177 138 187 C138 197 133 205 129 207 C126 207 123 199 123 189 C123 181 123 174 123 174 Z"
          {...getPathProps("ABS")}
        />

        {/* OBLIQUES (External Obliques & Serratus) */}
        <path
          id="obliques_left"
          d="M80 126 C76 138 74 158 76 178 C78 192 82 204 92 207 C96 207 96 198 95 188 C94 168 94 148 96 128 Z"
          {...getPathProps("OBLIQUES")}
        />
        <path
          id="obliques_right"
          d="M160 126 C164 138 166 158 164 178 C162 192 158 204 148 207 C144 207 144 198 145 188 C146 168 146 148 144 128 Z"
          {...getPathProps("OBLIQUES")}
        />

        {/* QUADRICEPS (Vastus Lateralis, Rectus Femoris, Vastus Medialis Teardrop) */}
        <path
          id="quads_left"
          d="M90 216 C82 226 77 246 76 266 C75 284 80 298 87 302 C93 304 98 296 99 285 C101 270 108 248 113 226 C105 220 96 217 90 216 Z"
          {...getPathProps("QUADS")}
        />
        <path
          id="quads_teardrop_left"
          d="M100 274 C98 286 98 298 104 302 C110 304 114 296 114 286 C114 276 108 270 100 274 Z"
          {...getPathProps("QUADS")}
        />
        <path
          id="quads_right"
          d="M150 216 C158 226 163 246 164 266 C165 284 160 298 153 302 C147 304 142 296 141 285 C139 270 132 248 127 226 C135 220 144 217 150 216 Z"
          {...getPathProps("QUADS")}
        />
        <path
          id="quads_teardrop_right"
          d="M140 274 C142 286 142 298 136 302 C130 304 126 296 126 286 C126 276 132 270 140 274 Z"
          {...getPathProps("QUADS")}
        />

        {/* CALVES (Tibialis Anterior & Anterior Gastrocnemius Sweep) */}
        <path
          id="calves_front_left"
          d="M82 314 C76 324 74 340 76 354 C78 368 84 378 92 378 C96 378 98 366 98 350 C98 334 94 320 88 314 Z"
          {...getPathProps("CALVES")}
        />
        <path
          id="calves_front_right"
          d="M158 314 C164 324 166 340 164 354 C162 368 156 378 148 378 C144 378 142 366 142 350 C142 334 146 320 152 314 Z"
          {...getPathProps("CALVES")}
        />
      </g>
    </svg>
  );

  const renderBackSilhouette = () => (
    <svg
      viewBox="0 0 240 400"
      className="w-full h-auto max-h-[390px] select-none transition-all duration-300 drop-shadow-2xl"
    >
      <defs>
        <filter id="neon-glow-cyan-back" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.8" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Organic Anatomical Background Silhouette Layer (Posterior) */}
      <g className="fill-[#090e1d] stroke-[#1e293b] stroke-[1.2]">
        {/* Head & Occipital Bone */}
        <path d="M120 14 C110 14 104 22 104 34 C104 46 111 54 120 54 C129 54 136 46 136 34 C136 22 130 14 120 14 Z" />
        {/* Posterior Athletic Body Outer Outline */}
        <path d="M112 52 C104 60 92 68 76 74 C62 80 52 94 50 110 C48 126 50 146 44 162 C38 178 34 204 36 222 C37 232 45 236 52 234 C58 226 62 208 66 188 C70 172 74 154 78 136 C80 152 82 180 84 200 C86 210 92 216 98 218 C88 228 80 248 78 270 C76 290 80 306 86 312 C82 322 80 340 82 358 C84 374 90 384 98 386 C104 386 108 376 108 360 C108 340 106 322 104 314 C108 306 112 290 114 274 C116 256 118 238 120 226 C122 238 124 256 126 274 C128 290 132 306 136 314 C134 322 132 340 132 360 C132 376 136 386 142 386 C150 384 156 374 158 358 C160 340 158 322 154 312 C160 306 164 290 162 270 C160 248 152 228 142 218 C148 216 154 210 156 200 C158 180 160 152 162 136 C166 154 170 172 174 188 C178 208 182 226 188 234 C195 236 203 232 204 222 C206 204 202 178 196 162 C190 146 192 126 190 110 C188 94 178 80 164 74 C148 68 136 60 128 52 Z" />
      </g>

      {/* Discrete Interactive Muscle Paths (Back View) */}
      <g id="muscles_back">
        {/* TRAPS (Upper & Mid Back Kite Diamond) */}
        <path
          id="traps_back"
          d="M120 54 C112 58 98 64 88 74 C88 84 94 98 102 110 C110 124 118 136 120 140 C122 136 130 124 138 110 C146 98 152 84 152 74 C142 64 128 58 120 54 Z"
          {...getPathProps("TRAPS")}
        />

        {/* REAR DELTS (Posterior Deltoid Caps) */}
        <path
          id="rear_delts_left"
          d="M86 76 C78 80 70 88 68 98 C68 106 74 110 82 106 C86 98 87 88 86 76 Z"
          {...getPathProps("REAR_DELTS")}
        />
        <path
          id="rear_delts_right"
          d="M154 76 C162 80 170 88 172 98 C172 106 166 110 158 106 C154 98 153 88 154 76 Z"
          {...getPathProps("REAR_DELTS")}
        />

        {/* LATS (Latissimus Dorsi V-Taper Wings) */}
        <path
          id="lats_left"
          d="M86 114 C74 124 68 144 70 166 C72 178 84 182 94 176 C98 166 102 148 104 128 C96 120 90 116 86 114 Z"
          {...getPathProps("LATS")}
        />
        <path
          id="lats_right"
          d="M154 114 C166 124 172 144 170 166 C168 178 156 182 146 176 C142 166 138 148 136 128 C144 120 150 116 154 114 Z"
          {...getPathProps("LATS")}
        />

        {/* TRICEPS (Posterior Arm Horseshoe) */}
        <path
          id="triceps_left"
          d="M66 114 C56 118 50 130 50 144 C50 156 58 160 64 154 C72 144 72 128 66 114 Z"
          {...getPathProps("TRICEPS")}
        />
        <path
          id="triceps_right"
          d="M174 114 C184 118 190 130 190 144 C190 156 182 160 176 154 C168 144 168 128 174 114 Z"
          {...getPathProps("TRICEPS")}
        />

        {/* LOWER BACK (Erector Spinae) */}
        <path
          id="lower_back_left"
          d="M106 174 C104 184 104 198 106 210 C112 210 116 206 116 196 C116 184 114 174 106 174 Z"
          {...getPathProps("LOWER_BACK")}
        />
        <path
          id="lower_back_right"
          d="M134 174 C136 184 136 198 134 210 C128 210 124 206 124 196 C124 184 126 174 134 174 Z"
          {...getPathProps("LOWER_BACK")}
        />

        {/* GLUTES (Gluteus Maximus Curvature) */}
        <path
          id="glutes_left"
          d="M88 214 C78 220 74 234 76 248 C78 258 92 262 106 258 C114 254 118 244 118 228 C108 220 98 216 88 214 Z"
          {...getPathProps("GLUTES")}
        />
        <path
          id="glutes_right"
          d="M152 214 C162 220 166 234 164 248 C162 258 148 262 134 258 C126 254 122 244 122 228 C132 220 142 216 152 214 Z"
          {...getPathProps("GLUTES")}
        />

        {/* HAMSTRINGS (Biceps Femoris & Semitendinosus) */}
        <path
          id="hamstrings_left"
          d="M84 262 C78 274 76 292 78 304 C84 308 96 308 104 304 C108 294 110 278 112 264 C100 262 90 262 84 262 Z"
          {...getPathProps("HAMSTRINGS")}
        />
        <path
          id="hamstrings_right"
          d="M156 262 C162 274 164 292 162 304 C156 308 144 308 136 304 C132 294 130 278 128 264 C140 262 150 262 156 262 Z"
          {...getPathProps("HAMSTRINGS")}
        />

        {/* CALVES (Posterior Gastrocnemius Diamond Head) */}
        <path
          id="calves_back_left"
          d="M82 312 C74 322 72 338 74 354 C78 368 86 376 94 376 C98 376 102 364 102 348 C102 334 96 320 88 312 Z"
          {...getPathProps("CALVES")}
        />
        <path
          id="calves_back_right"
          d="M158 312 C166 322 168 338 166 354 C162 368 154 376 146 376 C142 376 138 364 138 348 C138 334 144 320 152 312 Z"
          {...getPathProps("CALVES")}
        />
      </g>
    </svg>
  );

  // Position calculation for 1-Second Hover Tooltip (Safe Viewport Bounds Clamped)
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const tooltipWidth = 360;
  const tooltipHeight = 320;
  const padding = 16;

  let leftPos = cursorPos.x + 20;
  if (leftPos + tooltipWidth > windowWidth - padding) {
    leftPos = cursorPos.x - tooltipWidth - 20;
  }
  if (leftPos < padding) leftPos = padding;

  let topPos = cursorPos.y - tooltipHeight / 2;
  if (topPos + tooltipHeight > windowHeight - padding) {
    topPos = windowHeight - tooltipHeight - padding;
  }
  if (topPos < padding) topPos = padding;

  const hoverGuide = tooltipMuscle ? MUSCLE_TRAINING_GUIDE[tooltipMuscle] : null;
  const hoverData = tooltipMuscle ? getMuscleData(tooltipMuscle) : null;

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-br from-[#0B1020]/95 via-[#070C18]/95 to-[#040710]/98 border-2 border-cyan-500/30 p-5 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* Background Cyber Ambient Radiance */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              BIO-METRIC SCANNER
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              SYSTEM FRESHNESS:{" "}
              <span className="text-cyan-300 font-black">
                {recoveryStatus?.summary.overallFreshness ?? 100}%
              </span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black font-heading text-white tracking-tight mt-1">
            Anatomical Muscle Heatmap & Workout Recommender
          </h3>
        </div>

        {/* View Switcher Controls */}
        {allowToggleView && variant !== "compact" && (
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-cyan-500/30">
            <button
              onClick={() => setActiveView("dual")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "dual"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              DUAL VIEW
            </button>
            <button
              onClick={() => setActiveView("front")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "front"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              FRONT
            </button>
            <button
              onClick={() => setActiveView("back")}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeView === "back"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              BACK
            </button>
          </div>
        )}
      </div>

      {/* Main Heatmap Stage & Interactive Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-4 relative z-10">
        {/* Heatmap Visual Area */}
        <div
          className={`flex items-center justify-center gap-4 ${
            variant === "compact"
              ? "lg:col-span-12"
              : activeView === "dual"
              ? "lg:col-span-7"
              : "lg:col-span-6"
          }`}
        >
          {(activeView === "front" || activeView === "dual") && (
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                ANTERIOR (FRONT)
              </span>
              <div className="w-full max-w-[220px]">{renderFrontSilhouette()}</div>
            </div>
          )}

          {(activeView === "back" || activeView === "dual") && (
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                POSTERIOR (BACK)
              </span>
              <div className="w-full max-w-[220px]">{renderBackSilhouette()}</div>
            </div>
          )}
        </div>

        {/* Live Muscle Inspector HUD Card (Desktop / Full View) */}
        {variant !== "compact" && (
          <div
            className={`flex flex-col space-y-4 rounded-2xl bg-black/40 border border-cyan-500/25 p-5 shadow-xl ${
              activeView === "dual" ? "lg:col-span-5" : "lg:col-span-6"
            }`}
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Info className="w-3 h-3 text-cyan-400" />
                  TARGET GROUP INSPECTOR
                </span>
                <Badge
                  className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 ${
                    focusedData.status === "FATIGUED"
                      ? "bg-red-950 text-red-300 border-red-500/40"
                      : focusedData.status === "RECOVERING"
                      ? "bg-amber-950 text-amber-300 border-amber-500/40"
                      : "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                  }`}
                >
                  {focusedData.status} ({Math.round(focusedData.freshness)}%)
                </Badge>
              </div>

              <h4 className="text-xl font-black font-heading text-white tracking-wide mt-1">
                {focusedGuide.name}
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {focusedGuide.anatomicalName} • {focusedGuide.category}
              </span>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setInspectorTab("telemetry")}
                className={`flex-1 py-1 px-2 rounded-lg text-center font-bold transition-all ${
                  inspectorTab === "telemetry"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => setInspectorTab("exercises")}
                className={`flex-1 py-1 px-2 rounded-lg text-center font-bold transition-all ${
                  inspectorTab === "exercises"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Exercises
              </button>
              <button
                onClick={() => setInspectorTab("cues")}
                className={`flex-1 py-1 px-2 rounded-lg text-center font-bold transition-all ${
                  inspectorTab === "cues"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Form Cues
              </button>
            </div>

            {/* Dynamic Inspector Tab Contents */}
            {inspectorTab === "telemetry" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Freshness Rating:</span>
                  <span className="text-cyan-300 font-black text-sm">
                    {Math.round(focusedData.freshness)}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      focusedData.freshness < 40
                        ? "bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                        : focusedData.freshness < 80
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                        : "bg-gradient-to-r from-cyan-500 to-teal-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    }`}
                    style={{ width: `${Math.max(5, focusedData.freshness)}%` }}
                  />
                </div>

                {/* Recovery Countdown Box */}
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Recovery ETA:
                    </span>
                    <span className="text-white font-bold">
                      {formatTimeRemaining(focusedData.hoursRemaining)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Full Recovery Cycle:</span>
                    <span className="text-cyan-300 font-bold">
                      {focusedData.fullRecoveryHours} Hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-white/5">
                    <span>RPG Stat Growth:</span>
                    <span className="text-emerald-400 font-bold">
                      {focusedGuide.statBonus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {inspectorTab === "exercises" && (
              <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1 text-xs">
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block font-bold">
                  Recommended Exercises to Train & Improve:
                </span>
                {focusedGuide.recommendedExercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-sans flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                        {ex.name}
                      </span>
                      <span className="text-[9.5px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                        {ex.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{ex.setsReps}</span>
                      <span className="text-slate-500 text-[10px] truncate max-w-[140px]">
                        {ex.benefit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {inspectorTab === "cues" && (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block font-bold">
                  Actionable Biomechanical Cues:
                </span>
                <ul className="space-y-1.5">
                  {focusedGuide.actionableCues.map((cue, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11.5px] text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-purple-300 italic pt-1 border-t border-white/5">
                  &ldquo;{focusedGuide.recoveryLore}&rdquo;
                </p>
              </div>
            )}

            {/* Quick Muscle Selector Pills */}
            <div className="pt-2 border-t border-cyan-500/20">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Select Muscle to Analyze:
              </span>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                {(Object.keys(CANONICAL_MUSCLES_LIST) as MuscleGroupKey[]).map((key) => {
                  const m = getMuscleData(key);
                  const isCur = currentFocusedKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleMuscleClick(key)}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-mono transition-all cursor-pointer ${
                        isCur
                          ? "bg-cyan-500 text-slate-950 font-black shadow-md scale-105"
                          : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {m.name.split(" ")[0]} ({Math.round(m.freshness)}%)
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Heatmap Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-cyan-500/20 text-xs font-mono relative z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span className="text-slate-300">80% - 100% Fresh (Prime Condition)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-slate-300">40% - 79% Recovering</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span className="text-slate-300">0% - 39% Fatigued (Rest)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-sans italic">
          *Hover over any muscle for 1 second to view recommended workouts & recovery.
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. 1-SECOND HOVER FLOATING PORTAL TOOLTIP (NO CUTS) */}
      {/* ========================================================= */}
      {mounted && tooltipMuscle && hoverGuide && hoverData && typeof document !== "undefined" && createPortal(
        <div
          className="fixed z-[999999] pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            left: `${leftPos}px`,
            top: `${topPos}px`,
            width: `${tooltipWidth}px`,
          }}
        >
          <div className="p-4 rounded-2xl bg-[#080E20]/98 border border-cyan-500/50 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.95)] backdrop-blur-3xl font-sans text-left space-y-2.5">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-cyan-500/20 pb-2">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded">
                  {hoverGuide.category}
                </span>
                <h5 className="font-extrabold text-sm text-white font-heading mt-0.5">
                  {hoverGuide.name}
                </h5>
                <span className="text-[10px] text-slate-400 font-mono">
                  {hoverGuide.anatomicalName}
                </span>
              </div>
              <Badge
                className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 ${
                  hoverData.status === "FATIGUED"
                    ? "bg-red-950 text-red-300 border-red-500/40"
                    : hoverData.status === "RECOVERING"
                    ? "bg-amber-950 text-amber-300 border-amber-500/40"
                    : "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                }`}
              >
                {Math.round(hoverData.freshness)}% Fresh
              </Badge>
            </div>

            {/* Recommended Exercises to Improve */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <Dumbbell className="w-3 h-3 text-cyan-400" />
                Recommended Workouts to Improve:
              </span>
              <div className="space-y-1">
                {hoverGuide.recommendedExercises.slice(0, 3).map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 px-2 rounded-lg bg-slate-900/90 border border-white/5 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-bold text-white font-sans truncate max-w-[180px]">
                      {ex.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">
                      {ex.setsReps}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RPG Stat Growth & Recovery */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10.5px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Stat Yield:
              </span>
              <span className="text-emerald-400 font-bold">
                {hoverGuide.statBonus}
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const CANONICAL_MUSCLES_LIST: Record<MuscleGroupKey, boolean> = {
  CHEST: true,
  FRONT_DELTS: true,
  SHOULDERS: true,
  REAR_DELTS: true,
  TRAPS: true,
  LATS: true,
  LOWER_BACK: true,
  BICEPS: true,
  TRICEPS: true,
  FOREARMS: true,
  ABS: true,
  OBLIQUES: true,
  QUADS: true,
  HAMSTRINGS: true,
  GLUTES: true,
  CALVES: true,
};
