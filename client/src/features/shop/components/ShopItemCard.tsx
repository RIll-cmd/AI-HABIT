import { ShopItem } from "../types/shop";
import { useShopStore } from "../store/useShopStore";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Diamond, Shield, Swords, Activity, Lock } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { rarityColors } from "@/features/inventory/utils/rarityColors";
import { PurchaseModal } from "./PurchaseModal";
import { playUISound } from "@/utils/audio";
import { getItemIconPath } from "@/utils/itemIcons";

interface ShopItemCardProps {
  item: ShopItem;
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const { buyItem } = useShopStore();
  const { character } = useCharacterStore();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const CurrencyIcon = () => {
    switch (item.currencyType) {
      case "GEMS":
        return <Diamond className="w-4 h-4 text-cyan-400" />;
      case "TOWER_TOKENS":
        return <Shield className="w-4 h-4 text-purple-400" />;
      case "GOLD":
      default:
        return <Coins className="w-4 h-4 text-yellow-400" />;
    }
  };

  const rarityColor = rarityColors[item.rarity as keyof typeof rarityColors] || rarityColors.COMMON;

  return (
    <Card className={`relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
      !item.meetsRequirements ? "grayscale" : ""
    }`}>
      {/* Rarity Gradient Background */}
      <div 
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: `linear-gradient(to bottom right, ${rarityColor}40, transparent)` }}
      />
      
      <div className="p-4 relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg bg-muted/50 border flex-shrink-0 p-1 flex items-center justify-center" style={{ borderColor: `${rarityColor}40` }}>
              <img 
                src={(item.icon && item.icon.includes('/icons/Icon')) ? item.icon : getItemIconPath(item.name, item.type)} 
                onError={(e) => { e.currentTarget.src = getItemIconPath(item.name, item.type); }}
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                style={{ imageRendering: "pixelated" }}
                alt={item.name} 
              />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight truncate">{item.name}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider" style={{ color: rarityColor }}>
                {item.rarity} {item.type}
              </p>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
          {item.description || "A mysterious item."}
        </p>

        {/* Stock */}
        {item.stock !== null && (
          <div className="text-xs font-semibold mb-2 text-muted-foreground">
            Stock: <span className={item.inStock ? "text-primary" : "text-destructive"}>{item.stock}</span>
          </div>
        )}

        {/* Action Area */}
        <div className="mt-auto pt-4 border-t border-border/50">
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
            <div className="flex items-center gap-1.5">
              <span className={item.canAfford ? "" : "text-destructive"}>{item.price.toLocaleString()}</span>
              <CurrencyIcon />
            </div>
          </Button>
        </div>
      </div>

      {/* Locked Overlay */}
      {!item.meetsRequirements && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
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
  );
}
