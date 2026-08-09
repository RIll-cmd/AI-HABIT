"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useBossStore, CreateBossPayload } from "../store/useBossStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useHabitStore } from "@/features/habits/store/useHabitStore";
import { CalendarIcon, Target, Crosshair } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BossCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BossCreationModal({ isOpen, onClose }: BossCreationModalProps) {
  const { createBoss, isLoading } = useBossStore();
  const { character } = useCharacterStore();
  const { habits, loadHabits } = useHabitStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("ACADEMIC");
  const [difficulty, setDifficulty] = useState("NORMAL");
  const [deadline, setDeadline] = useState<Date>();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && character) {
      loadHabits(character.id);
    }
  }, [isOpen, character, loadHabits]);

  const toggleHabit = (habitId: string) => {
    setSelectedHabits(prev => 
      prev.includes(habitId) ? prev.filter(id => id !== habitId) : [...prev, habitId]
    );
  };

  const handleCreate = async () => {
    if (!character || !name.trim()) return;

    const payload: CreateBossPayload = {
      name,
      description,
      category,
      difficulty,
      deadline: deadline ? deadline.toISOString() : undefined,
      activities: selectedHabits.map(habitId => ({
        activityType: "HABIT",
        referenceId: habitId,
        damageValue: difficulty === "LEGENDARY" ? 1500 : difficulty === "ELITE" ? 1000 : 500,
      }))
    };

    try {
      await createBoss(character.id, payload);
      onClose();
      // Reset form
      setName("");
      setDescription("");
      setCategory("ACADEMIC");
      setDifficulty("NORMAL");
      setDeadline(undefined);
      setSelectedHabits([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2 text-red-500">
            <Target className="w-6 h-6" /> CREATE NEW BOSS
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Boss Name (The Goal)</Label>
            <Input 
              placeholder="e.g., Capstone Project, Final Exam" 
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              >
                <option value="ACADEMIC">🎓 Academic</option>
                <option value="PROJECT">💻 Project</option>
                <option value="FITNESS">💪 Fitness</option>
                <option value="CAREER">💼 Career</option>
                <option value="PERSONAL">🧠 Personal Dev</option>
                <option value="LIFE">🏠 Life</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-bold"
                value={difficulty}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value)}
              >
                <option value="EASY" className="text-green-500">EASY (5,000 HP)</option>
                <option value="NORMAL" className="text-blue-500">NORMAL (10,000 HP)</option>
                <option value="HARD" className="text-orange-500">HARD (25,000 HP)</option>
                <option value="ELITE" className="text-red-500">ELITE (50,000 HP)</option>
                <option value="LEGENDARY" className="text-purple-500">LEGENDARY (100,000 HP)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="What exactly are you trying to accomplish?"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Deadline (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[240px] justify-start text-left font-normal", !deadline && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Pick a deadline</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-orange-500" />
              <Label className="text-lg font-bold">Linked Damage Sources</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Select the existing habits that will deal damage to this boss when completed.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 max-h-60 overflow-y-auto p-1">
              {habits.map(habit => (
                <div 
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`cursor-pointer border rounded-lg p-3 flex items-center justify-between transition-colors ${selectedHabits.includes(habit.id) ? 'border-red-500 bg-red-500/10' : 'border-border hover:border-red-500/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{habit.icon}</div>
                    <div className="font-semibold text-sm">{habit.name}</div>
                  </div>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedHabits.includes(habit.id) ? 'bg-red-500 border-red-500' : 'border-muted-foreground'}`}>
                    {selectedHabits.includes(habit.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                </div>
              ))}
              {habits.length === 0 && (
                <div className="col-span-2 text-center p-4 border rounded-lg border-dashed text-muted-foreground">
                  No habits found. Create some habits first to link them as damage sources.
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleCreate} 
            disabled={!name.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {isLoading ? "Summoning Boss..." : "SUMMON BOSS"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
