/**
 * Exercise Rank Evaluation Engine (Epley Formula)
 * e1RM = weight * (1 + reps / 30)
 */

export function calculateE1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1.0 + reps / 30.0) * 10) / 10;
}

export interface RankInfo {
  rank: "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS";
  color: string;
  badgeBg: string;
  badgeBorder: string;
  glow: string;
}

/**
 * Standard thresholds by exercise category / exercise name (for ~70kg bodyweight)
 */
const DEFAULT_THRESHOLDS: Record<string, number[]> = {
  // [D, C, B, A, S, SS, SSS]
  bench: [50, 70, 95, 120, 145, 165, 185],
  squat: [65, 95, 130, 165, 200, 230, 260],
  deadlift: [75, 110, 150, 190, 230, 260, 290],
  ohp: [35, 50, 68, 88, 108, 125, 140],
  curl: [10, 15, 20, 25, 30, 38, 45],
  row: [45, 65, 88, 115, 140, 160, 180],
  pulldown: [45, 65, 85, 105, 130, 150, 170],
  dip: [10, 20, 35, 55, 75, 95, 115],
  pushup: [5, 15, 30, 45, 65, 85, 105],
  lateral: [8, 14, 20, 28, 36, 44, 52],
  legpress: [110, 170, 240, 320, 410, 470, 530],
  generic: [15, 30, 50, 75, 100, 125, 150],
};

export function evaluateRank(e1rm: number, exerciseName: string = ""): RankInfo {
  const nameLower = exerciseName.toLowerCase();
  let key = "generic";

  if (nameLower.includes("bench")) key = "bench";
  else if (nameLower.includes("squat")) key = "squat";
  else if (nameLower.includes("deadlift")) key = "deadlift";
  else if (nameLower.includes("overhead") || nameLower.includes("press")) key = "ohp";
  else if (nameLower.includes("curl")) key = "curl";
  else if (nameLower.includes("row")) key = "row";
  else if (nameLower.includes("pulldown") || nameLower.includes("pull-up")) key = "pulldown";
  else if (nameLower.includes("dip")) key = "dip";
  else if (nameLower.includes("push-up") || nameLower.includes("pushup")) key = "pushup";
  else if (nameLower.includes("lateral") || nameLower.includes("raise")) key = "lateral";
  else if (nameLower.includes("leg press")) key = "legpress";

  const t = DEFAULT_THRESHOLDS[key] || DEFAULT_THRESHOLDS.generic;

  let rank: RankInfo["rank"] = "E";

  if (e1rm >= t[6]) rank = "SSS";
  else if (e1rm >= t[5]) rank = "SS";
  else if (e1rm >= t[4]) rank = "S";
  else if (e1rm >= t[3]) rank = "A";
  else if (e1rm >= t[2]) rank = "B";
  else if (e1rm >= t[1]) rank = "C";
  else if (e1rm >= t[0]) rank = "D";
  else rank = "E";

  switch (rank) {
    case "SSS":
    case "SS":
    case "S":
      return {
        rank,
        color: "text-amber-400 font-extrabold",
        badgeBg: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300",
        badgeBorder: "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]",
      };
    case "A":
      return {
        rank,
        color: "text-purple-400 font-extrabold",
        badgeBg: "bg-purple-950/40 text-purple-300",
        badgeBorder: "border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.4)]",
        glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
      };
    case "B":
      return {
        rank,
        color: "text-cyan-400 font-extrabold",
        badgeBg: "bg-cyan-950/40 text-cyan-300",
        badgeBorder: "border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
        glow: "shadow-[0_0_12px_rgba(6,182,212,0.4)]",
      };
    case "C":
      return {
        rank,
        color: "text-blue-400 font-bold",
        badgeBg: "bg-blue-950/40 text-blue-300",
        badgeBorder: "border-blue-500/30",
        glow: "shadow-sm",
      };
    case "D":
      return {
        rank,
        color: "text-slate-300 font-medium",
        badgeBg: "bg-slate-800/60 text-slate-300",
        badgeBorder: "border-slate-700",
        glow: "shadow-none",
      };
    default:
      return {
        rank: "E",
        color: "text-slate-500 font-normal",
        badgeBg: "bg-slate-900/60 text-slate-400",
        badgeBorder: "border-slate-800",
        glow: "shadow-none",
      };
  }
}
