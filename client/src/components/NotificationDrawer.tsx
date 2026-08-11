import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dumbbell, Target, Shield, CheckCheck, Trash2, Bell, Bot } from "lucide-react";
import { useNotificationStore, NotificationCategory, AppNotification } from "@/store/useNotificationStore";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES: { label: string; value: NotificationCategory; icon?: React.ElementType }[] = [
  { label: "ALL", value: "ALL" },
  { label: "AIRA BRIEFINGS", value: "AIRA BRIEFINGS", icon: Bot },
  { label: "WORKOUTS", value: "WORKOUTS", icon: Dumbbell },
  { label: "HABITS", value: "HABITS", icon: Target },
  { label: "TOWER", value: "TOWER / SYSTEM", icon: Shield },
];

export function NotificationDrawer({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("ALL");
  const { notifications, markAllAsRead, clearLogs, markAsRead } = useNotificationStore();

  const filteredNotifications = notifications.filter(
    (n) => activeCategory === "ALL" || n.category === activeCategory
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-[#0B1020]/95 backdrop-blur-xl border-l border-white/10 p-0 text-slate-200 shadow-2xl flex flex-col font-sans h-full">
        <SheetHeader className="p-4 sm:p-6 border-b border-white/10 shrink-0">
          <SheetTitle className="text-xl font-bold font-heading text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Notification Center
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50 uppercase tracking-wider h-7 px-2"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                Mark Read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearLogs}
                className="text-[10px] text-red-400 hover:text-red-300 hover:bg-red-950/50 uppercase tracking-wider h-7 px-2"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </SheetTitle>
          
          {/* Categories Scrollable Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.value
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                      : "bg-white/5 text-slate-400 border border-transparent hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
              <Bell className="w-12 h-12 opacity-20" />
              <p className="text-sm font-mono">No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationCard key={notif.id} notification={notif} onRead={() => markAsRead(notif.id)} />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NotificationCard({ notification, onRead }: { notification: AppNotification; onRead: () => void }) {
  const isAira = notification.category === "AIRA BRIEFINGS";
  
  const renderIcon = () => {
    switch (notification.category) {
      case "AIRA BRIEFINGS":
        return (
          <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-500/40 bg-slate-900 flex-shrink-0 relative flex items-center justify-center">
            <img
              src="/AIRA ICON/cropped/aira-neutral.png"
              alt="AIRA"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "WORKOUTS":
        return (
          <div className="w-9 h-9 rounded-full bg-[#0B1020] border border-amber-500/30 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
            <Dumbbell className="w-4 h-4 text-amber-400" />
          </div>
        );
      case "HABITS":
        return (
          <div className="w-9 h-9 rounded-full bg-[#0B1020] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
        );
      case "TOWER / SYSTEM":
        return (
          <div className="w-9 h-9 rounded-full bg-[#0B1020] border border-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full bg-[#0B1020] border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
            <Bell className="w-4 h-4 text-slate-400" />
          </div>
        );
    }
  };

  return (
    <div
      onClick={onRead}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
        !notification.isRead
          ? "bg-cyan-950/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          : "bg-white/5 border-white/5 hover:bg-white/10"
      }`}
    >
      {!notification.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      )}
      <div className="flex gap-3 items-start">
        {renderIcon()}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold tracking-wider uppercase font-mono ${isAira ? "text-cyan-400" : "text-slate-400"}`}>
              {notification.category}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${!notification.isRead ? "text-slate-200" : "text-slate-400"}`}>
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
