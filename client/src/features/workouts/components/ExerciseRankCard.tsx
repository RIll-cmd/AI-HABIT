import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ExerciseRankCardProps {
  exerciseName: string;
  e1rm: number;
  currentRank: string;
  nextRank: string;
  nextThreshold: number;
  progress: number;
}

export function ExerciseRankCard({
  exerciseName,
  e1rm,
  currentRank,
  nextRank,
  nextThreshold,
  progress
}: ExerciseRankCardProps) {
  // Determine color based on rank for some visual flair
  let rankColor = "text-slate-400";
  if (currentRank === "S" || currentRank === "SS" || currentRank === "SSS") rankColor = "text-emerald-400";
  else if (currentRank === "A") rankColor = "text-amber-400";
  else if (currentRank === "B") rankColor = "text-indigo-400";
  else if (currentRank === "C") rankColor = "text-blue-400";

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800 flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-slate-300">{exerciseName}</CardTitle>
          <div className={`font-black text-xl ${rankColor}`}>{currentRank}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs text-muted-foreground">Est. 1RM</div>
            <div className="font-mono text-lg text-white">{e1rm} kg</div>
          </div>
          {nextRank !== "MAX" && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Next: {nextRank}</div>
              <div className="font-mono text-sm text-slate-400">{nextThreshold} kg</div>
            </div>
          )}
        </div>
        
        {nextRank !== "MAX" ? (
          <Progress value={progress} className="h-1.5 bg-slate-800" indicatorClassName={rankColor.replace('text-', 'bg-')} />
        ) : (
          <Progress value={100} className="h-1.5 bg-slate-800" indicatorClassName="bg-emerald-400" />
        )}
      </CardContent>
    </Card>
  );
}
