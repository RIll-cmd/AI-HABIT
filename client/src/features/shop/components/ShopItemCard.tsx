import { ShopItem } from "../types/shop";
import { useShopStore } from "../store/useShopStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { CurrencyIcon } from "@/components/CurrencyDisplay";
import { useState } from "react";
import { rarityColors } from "@/features/inventory/utils/rarityColors";
import { PurchaseModal } from "./PurchaseModal";
import { playUISound } from "@/utils/audio";
import { getItemIconPath } from "@/utils/itemIcons";
import { ItemTooltip } from "./ItemTooltip";

interface ShopItemCardProps {
  item: ShopItem;
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const { buyItem } = useShopStore();
  const { character } = useCharacterStore();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBuy = async () => {
    if (!character) return;
    setIsPurchasing(true);
    const success = await buyItem(character.id, item.id);
    setIsPurchasing(false);
    if (success) {
      playUISound("/sounds/General/10_UI_Menu_SFX/079_Buy_sell_01.wav");
      setIsModalOpen(false);
    }
  };

  const CurrencyIconBadge = () => (
    <CurrencyIcon type={item.currencyType} size="sm" />
  );

  const rarityColor = rarityColors[item.rarity as keyof typeof rarityColors] || rarityColors.COMMON;

  return (
    <ItemTooltip item={item}>
      <Card suppressHydrationWarning className={`relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-500/30 ${
        !item.meetsRequirements ? "grayscale" : ""
      }`}>
        {/* Rarity Gradient Background */}
        <div 
          suppressHydrationWarning
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ background: `linear-gradient(to bottom right, ${rarityColor}40, transparent)` }}
        />
        
        <div suppressHydrationWarning className="p-4 relative z-10 flex flex-col h-full">
          {/* Header with Title Truncation Fix */}
          <div suppressHydrationWarning className="flex items-start justify-between mb-3">
            <div suppressHydrationWarning className="flex items-center gap-3 min-w-0 w-full">
              <div suppressHydrationWarning className="relative w-12 h-12 rounded-lg bg-muted/50 border flex-shrink-0 p-1 flex items-center justify-center" style={{ borderColor: `${rarityColor}40` }}>
                <img 
                  src={(item.icon && item.icon.includes('/icons/Icon')) ? item.icon : getItemIconPath(item.name, item.type)} 
                  onError={(e) => { e.currentTarget.src = getItemIconPath(item.name, item.type); }}
                  className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                  style={{ imageRendering: "pixelated" }}
                  alt={item.name} 
                />
              </div>
              {/* Title Container: min-w-0 & flex-1 ensures truncate works cleanly without border overflow */}
              <div suppressHydrationWarning className="flex-1 min-w-0">
                <h3 className="font-bold text-base leading-tight truncate text-white group-hover:text-cyan-200 transition-colors" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-xs font-mono font-bold uppercase tracking-wider mt-0.5" style={{ color: rarityColor }}>
                  {item.rarity} {item.type}
                </p>
              </div>
            </div>
          </div>
          
          {/* Description / World Lore Preview (Click to toggle expansion or hover for tooltip) */}
          <p 
            suppressHydrationWarning 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-xs text-slate-400 leading-relaxed italic mb-3 flex-grow cursor-pointer hover:text-slate-200 transition-colors ${
              isExpanded ? "" : "line-clamp-2"
            }`}
            title="Click to toggle full text preview"
          >
            &quot;{item.description || "A mysterious item of unknown origin."}&quot;
          </p>

          {/* Stock Display */}
          {item.stock !== null && (
            <div suppressHydrationWarning className="text-xs font-mono font-semibold mb-2 text-slate-400 flex items-center justify-between">
              <span>Stock Remaining:</span>
              <span className={`font-bold ${item.inStock ? "text-cyan-400" : "text-red-400"}`}>
                {item.stock}
              </span>
            </div>
          )}

          {/* Action Area */}
          <div suppressHydrationWarning className="mt-auto pt-3 border-t border-border/50">
            <Button 
              className="w-full flex justify-between items-center font-bold"
              variant={item.canAfford && item.inStock && item.meetsRequirements ? "default" : "secondary"}
              disabled={!item.canAfford || !item.inStock || !item.meetsRequirements}
              onClick={() => setIsModalOpen(true)}
              style={
                  item.canAfford && item.inStock && item.meetsRequirements ? { backgroundColor: rarityColor, color: '#fff' } : {}
              }
            >
              <span>Purchase</span>
              <div suppressHydrationWarning className="flex items-center gap-1.5">
                <span className={item.canAfford ? "" : "text-destructive"}>{item.price.toLocaleString()}</span>
                <CurrencyIconBadge />
              </div>
            </Button>
          </div>
        </div>

        {/* Locked Overlay */}
        {!item.meetsRequirements && (
          <div suppressHydrationWarning className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center">
            <div suppressHydrationWarning className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold text-lg mb-1">Locked</h4>
            <p className="text-xs text-muted-foreground">
              {item.requiredLevel && character && character.level < item.requiredLevel 
                ? `Requires Level ${item.requiredLevel}` 
                : item.requiredPower && character && character.power < item.requiredPower 
                  ? `Requires Power ${item.requiredPower}` 
                  : "Requirements not met"}
            </p>
          </div>
        )}
        
        <PurchaseModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBuy}
          item={item}
          isPurchasing={isPurchasing}
        />
      </Card>
    </ItemTooltip>
  );
}
