import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { evaluateRank } from "../utils/rankEngine";

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
  const rankInfo = evaluateRank(e1rm, exerciseName);

  return (
    <Card className="bg-[#0B1020]/90 backdrop-blur-md border border-slate-800 flex flex-col justify-between shadow-xl overflow-hidden group hover:border-slate-700 transition-all">
      <CardHeader className="pb-2 border-b border-slate-800/60 bg-slate-900/40">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-bold text-slate-200 truncate max-w-[160px]">
            {exerciseName}
          </CardTitle>
          <Badge className={`${rankInfo.badgeBg} ${rankInfo.badgeBorder} border font-mono font-extrabold text-xs uppercase px-2 py-0.5 shadow-sm`}>
            {currentRank || rankInfo.rank} RANK
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 font-mono">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Est. 1RM</div>
            <div className="text-lg font-bold text-cyan-400">{e1rm} kg</div>
          </div>
          {nextRank !== "MAX" && (
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Next Target ({nextRank})</div>
              <div className="text-sm font-semibold text-slate-300">{nextThreshold} kg</div>
            </div>
          )}
        </div>
        
        {nextRank !== "MAX" ? (
          <div className="space-y-1">
            <Progress value={progress} className="h-1.5 bg-slate-900" />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Current Progress</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <Progress value={100} className="h-1.5 bg-slate-900" />
            <div className="text-right text-[9px] text-amber-400 font-bold uppercase tracking-wider">
              MAX RANK ACHIEVED
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
