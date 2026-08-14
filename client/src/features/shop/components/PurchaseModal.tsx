import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShopItem } from "../types/shop";
import { useCharacterStore } from "@/store/useCharacterStore";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { rarityColors } from "@/features/inventory/utils/rarityColors";
import { useEffect } from "react";
import Image from "next/image";
import { playUISound } from "@/utils/audio";
import { getItemIconPath } from "@/utils/itemIcons";
import { getItemUsageDetails } from "@/utils/itemUsageUtils";
import { Sparkles, BookOpen, ShieldCheck } from "lucide-react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: ShopItem | null;
  isPurchasing: boolean;
}

export function PurchaseModal({ isOpen, onClose, onConfirm, item, isPurchasing }: PurchaseModalProps) {
  const { character } = useCharacterStore();

  useEffect(() => {
    if (isOpen) {
      playUISound("/sounds/System UI & Navigation/SYSTEM--OPEN.mp3");
    }
  }, [isOpen]);

  if (!item || !character) return null;

  let currentBalance = 0;
  if (item.currencyType === "GOLD") currentBalance = character.gold;
  if (item.currencyType === "GEMS") currentBalance = character.gems || 0;
  if (item.currencyType === "TOWER_TOKENS") currentBalance = character.towerTokens || 0;

  const remainingBalance = currentBalance - item.price;
  const canAfford = remainingBalance >= 0;

  const CurrencyIconBadge = () => (
    <CurrencyIcon type={item.currencyType} size="sm" />
  );

  const rarityColor = (rarityColors as any)[item.rarity] || rarityColors.COMMON;
  const usageDetails = getItemUsageDetails(item);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-cyan-500/30 bg-[#0A1024]/98 backdrop-blur-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white font-heading">
            Confirm Purchase
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Review equipment stats, usage instructions, and account balance.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-16 h-16 rounded-xl bg-black/60 border flex items-center justify-center" style={{ borderColor: `${rarityColor}60` }}>
            <Image 
              src={getItemIconPath(item.name)} 
              alt={item.name} 
              fill 
              className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] p-2" 
            />
          </div>
          <div className="text-center w-full">
            <h3 className="font-bold text-lg text-white font-heading">{item.name}</h3>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border text-cyan-300" style={{ borderColor: `${rarityColor}60`, background: `${rarityColor}20` }}>
                {item.rarity}
              </span>
              <span className="text-xs font-mono text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 uppercase">
                {item.type}
              </span>
              {usageDetails.isEquipment && (
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Equippable
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-slate-300 leading-relaxed italic mt-2.5 px-3 bg-black/40 py-2 rounded-lg border border-white/5">
                &quot;{item.description}&quot;
              </p>
            )}
          </div>

          {/* Equipment Stat Attributes Grid */}
          {usageDetails.hasBonuses && (
            <div className="w-full p-2.5 rounded-xl bg-[#0B1428] border border-cyan-500/30">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Equipment Stat Attributes
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {usageDetails.statBonuses.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`flex justify-between items-center px-2.5 py-1 rounded-lg ${s.bg} border ${s.borderColor} text-xs font-mono`}>
                      <span className="flex items-center gap-1 text-[11px] text-slate-300">
                        <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                        {s.shortLabel}
                      </span>
                      <span className="font-bold text-white">+{s.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How to Use / Slot Guide */}
          <div className="w-full p-2.5 rounded-xl bg-gradient-to-br from-[#101830] to-[#080d1e] border border-indigo-500/30 text-xs leading-relaxed text-left">
            <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              How to Use & Function:
            </span>
            <p className="text-slate-200 font-sans text-xs">{usageDetails.usageGuide}</p>
            <div className="mt-1 text-[10px] font-mono text-indigo-300">
              Slot: <strong className="text-white">{usageDetails.slotLabel}</strong>
            </div>
          </div>
          
          <div className="w-full bg-muted/30 rounded-lg p-4 space-y-3 mt-4 border border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Balance:</span>
              <div className="flex items-center gap-1.5 font-medium">
                {currentBalance.toLocaleString()} <CurrencyIconBadge />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cost:</span>
              <div className="flex items-center gap-1.5 font-bold text-destructive">
                - {item.price.toLocaleString()} <CurrencyIconBadge />
              </div>
            </div>
            <div className="w-full h-px bg-border/50" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining Balance:</span>
              <div className={`flex items-center gap-1.5 font-bold ${canAfford ? 'text-primary' : 'text-destructive'}`}>
                {remainingBalance.toLocaleString()} <CurrencyIconBadge />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPurchasing} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={!canAfford || isPurchasing}
            className="w-full sm:w-auto font-bold"
            style={canAfford ? { backgroundColor: rarityColor, color: '#fff' } : {}}
          >
            {isPurchasing ? "Purchasing..." : "Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
