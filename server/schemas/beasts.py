from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class EggResponse(BaseModel):
    id: str
    name: str
    eggType: str = "ELEMENTAL"
    sprite: str = "/eggs/egg_1.png"
    rarity: str = "COMMON"
    targetSteps: int = 5000
    currentSteps: int = 0
    targetEnergy: int = 5000
    currentEnergy: int = 0
    target_steps: Optional[int] = None
    current_steps: Optional[int] = None
    status: str
    characterId: str
    user_id: Optional[str] = None
    hatchedBeastId: Optional[str] = None
    hatchedAt: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime

class BeastResponse(BaseModel):
    id: str
    name: str
    species: str
    element: str = "FIRE"
    rarity: str = "COMMON"
    spritePath: str = "/beasts/beast_1.png"
    sprite_path: Optional[str] = None
    statBonusType: str = "EXP_BOOST"
    statBonusValue: float = 5.0
    passiveBuffType: str = "EXP_BOOST"
    passiveBuffValue: float = 5.0
    passive_buff_type: Optional[str] = None
    passive_buff_value: Optional[float] = None
    description: Optional[str] = None
    lore: Optional[str] = None
    isEquipped: bool = False
    is_equipped: Optional[bool] = None
    characterId: str
    user_id: Optional[str] = None
    unlockedAt: datetime

class BestiarySpeciesSummary(BaseModel):
    speciesId: int
    name: str
    species: str
    element: str
    rarity: str
    spritePath: str
    statBonusType: str
    statBonusValue: float
    description: str
    lore: str
    isUnlocked: bool
    unlockedCount: int
    beastInstanceId: Optional[str] = None
    isEquipped: bool = False

class BeastCollectionResponse(BaseModel):
    characterId: str
    user_id: Optional[str] = None
    activeEgg: Optional[EggResponse] = None
    ownedEggs: List[EggResponse] = []
    unlockedBeasts: List[BeastResponse] = []
    equippedBeast: Optional[BeastResponse] = None
    totalDiscovered: int
    totalSpecies: int
    bestiary: List[BestiarySpeciesSummary]
    passiveBuffs: Dict[str, float]

class IncubateEggRequest(BaseModel):
    characterId: Optional[str] = None
    user_id: Optional[str] = None
    eggId: Optional[str] = None
    egg_id: Optional[str] = None

class StepSyncRequest(BaseModel):
    characterId: Optional[str] = None
    user_id: Optional[str] = None
    stepCount: Optional[int] = None
    step_count: Optional[int] = None
    source: Optional[str] = "PEDOMETER_SYNC"

class StepSyncResponse(BaseModel):
    characterId: str
    stepsAdded: int
    currentSteps: int
    targetSteps: int
    isReadyToHatch: bool
    status: str
    progressPercent: int
    egg: Optional[EggResponse] = None
    message: str

class FeedEnergyRequest(BaseModel):
    characterId: Optional[str] = None
    user_id: Optional[str] = None
    energyAmount: Optional[int] = None
    stepCount: Optional[int] = None
    step_count: Optional[int] = None
    source: Optional[str] = "MANUAL_STEPS"

class HatchEggRequest(BaseModel):
    characterId: Optional[str] = None
    user_id: Optional[str] = None
    eggId: Optional[str] = None
    egg_id: Optional[str] = None

class EquipBeastRequest(BaseModel):
    characterId: Optional[str] = None
    user_id: Optional[str] = None
    beastId: Optional[str] = None
    beast_id: Optional[str] = None

class BuyEggRequest(BaseModel):
    characterId: Optional[str] = None
    user_id: Optional[str] = None
    eggType: Optional[str] = None
    egg_type: Optional[str] = None
    currencyType: str = "GOLD"
