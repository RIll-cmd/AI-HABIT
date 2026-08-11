import random
from typing import List, Dict, Any

# Rarity stock ranges: 1 - 5 max based on rarity
RARITY_STOCK_RANGES = {
    "COMMON": (4, 5),
    "RARE": (3, 4),
    "EPIC": (2, 3),
    "LEGENDARY": (1, 2),
    "MYTHIC": (1, 2),
}

# Weighted probabilities for shop refresh (higher rarity = lower appearance chance)
RARITY_REFRESH_WEIGHTS = {
    "COMMON": 50,
    "RARE": 30,
    "EPIC": 15,
    "LEGENDARY": 4,
    "MYTHIC": 1,
}

def get_stock_for_rarity(rarity: str) -> int:
    """Returns dynamic stock between 1 and 5 based on item rarity."""
    r_upper = (rarity or "COMMON").upper()
    min_s, max_s = RARITY_STOCK_RANGES.get(r_upper, (4, 5))
    return random.randint(min_s, max_s)

def weighted_select_items(item_defs: List[Any], count: int) -> List[Any]:
    """
    Selects `count` unique items from `item_defs` weighted by rarity.
    Rarer items have significantly lower probability of being selected.
    """
    if not item_defs:
        return []
    
    selected = []
    pool = list(item_defs)
    
    while len(selected) < count and pool:
        weights = [
            RARITY_REFRESH_WEIGHTS.get((d.rarity or "COMMON").upper(), 50)
            for d in pool
        ]
        chosen = random.choices(pool, weights=weights, k=1)[0]
        selected.append(chosen)
        pool.remove(chosen)
        
    return selected
