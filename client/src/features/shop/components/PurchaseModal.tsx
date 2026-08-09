import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShopItem } from "../types/shop";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Coins, Diamond, Shield } from "lucide-react";
import { rarityColors } from "@/features/inventory/utils/rarityColors";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: ShopItem | null;
  isPurchasing: boolean;
}

export function PurchaseModal({ isOpen, onClose, onConfirm, item, isPurchasing }: PurchaseModalProps) {
  const { character } = useCharacterStore();

  if (!item || !character) return null;

  let currentBalance = 0;
  if (item.currencyType === "GOLD") currentBalance = character.gold;
  if (item.currencyType === "GEMS") currentBalance = character.gems || 0;
  if (item.currencyType === "TOWER_TOKENS") currentBalance = character.towerTokens || 0;

  const remainingBalance = currentBalance - item.price;
  const canAfford = remainingBalance >= 0;

  const CurrencyIcon = () => {
    switch (item.currencyType) {
      case "GEMS": return <Diamond className="w-4 h-4 text-cyan-400" />;
      case "TOWER_TOKENS": return <Shield className="w-4 h-4 text-purple-400" />;
      case "GOLD":
      default: return <Coins className="w-4 h-4 text-yellow-400" />;
    }
  };

  const rarityColor = (rarityColors as any)[item.rarity] || rarityColors.COMMON;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Confirm Purchase
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to purchase this item?
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-muted/50 border border-muted"
            style={{ borderColor: `${rarityColor}40`, color: rarityColor }}
          >
            {item.icon || "📦"}
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl">{item.name}</h3>
            <p className="text-sm text-muted-foreground uppercase tracking-wider" style={{ color: rarityColor }}>
              {item.rarity} {item.type}
            </p>
          </div>
          
          <div className="w-full bg-muted/30 rounded-lg p-4 space-y-3 mt-4 border border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Balance:</span>
              <div className="flex items-center gap-1.5 font-medium">
                {currentBalance.toLocaleString()} <CurrencyIcon />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cost:</span>
              <div className="flex items-center gap-1.5 font-bold text-destructive">
                - {item.price.toLocaleString()} <CurrencyIcon />
              </div>
            </div>
            <div className="w-full h-px bg-border/50" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining Balance:</span>
              <div className={`flex items-center gap-1.5 font-bold ${canAfford ? 'text-primary' : 'text-destructive'}`}>
                {remainingBalance.toLocaleString()} <CurrencyIcon />
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
