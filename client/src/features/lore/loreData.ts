import { Dumbbell, Target, Shield, BookOpen, Zap, HeartPulse, Activity, Flame, Coins, Gem, Circle, Award, Crown, CheckCircle2, Clock, Crosshair } from "lucide-react";

export interface CurrencyLoreEntry {
  name: string;
  category: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  description: string;
  lore: string;
  mechanics: string;
  tags: string[];
}

export const CURRENCY_LORE: Record<string, CurrencyLoreEntry> = {
  gold: {
    name: "Imperial System Gold",
    category: "System Currency",
    rarity: "UNCOMMON",
    description: "Standard sovereign medium of exchange forged from crystallized mana veins.",
    lore: "Forged in the Imperial Mint of the Zenith Capital. System Gold is infused with physical mana, allowing it to hold stable monetary value across dimensional rifts and shop networks.",
    mechanics: "Used for purchasing weapons, armor, elixirs, Streak Freeze shields, stat respecs, and forging crafted artifacts.",
    tags: ["Currency", "Economy", "Forging", "Trade"],
  },
  exp: {
    name: "Ascension Experience Essence",
    category: "Progression Fuel",
    rarity: "RARE",
    description: "Pure condensed kinetic and cognitive energy harvested from vanquished gates and completed habits.",
    lore: "When an Ascendant executes daily discipline or slays floor monstrosities, the System crystallizes the expended neural strain into iridescent EXP particles that reconstruct the hunter's soul matrix.",
    mechanics: "Fills the Ascension Gauge to increase Hunter Level, granting +5 Stat Points (SP) per level and advancing Hunter Rank.",
    tags: ["EXP", "Progression", "Leveling", "StatPoints"],
  },
  gems: {
    name: "Astral Rift Prisms",
    category: "Premium Relic",
    rarity: "LEGENDARY",
    description: "Ultra-dense multi-faceted astral prisms harvested from rare dimensional anomalies.",
    lore: "Formed at the exact geometric epicenter of collapsed S-Rank gate rifts where spatial coordinates fracture into crystalline perfection.",
    mechanics: "Used to acquire exclusive title auras, avatar themes, custom UI palettes, and high-tier mastery cosmetics.",
    tags: ["Gems", "Cosmetics", "Auras", "Prestige"],
  },
  towerTokens: {
    name: "Abyssal Floor Tokens",
    category: "Tower Conquest",
    rarity: "EPIC",
    description: "Ancient inscribed conquest tokens extracted from the deep monoliths of the Tower.",
    lore: "Carried only by the guardian monoliths on higher floors of the Tower of Ascension. Each token bears the runic seal of ancient monarchs who once challenged the summit.",
    mechanics: "Redeemable at the Tower Emporium for rare recipe blueprints, high-tier armor ingots, and sovereign elixirs.",
    tags: ["Tower", "Combat", "Conquest", "Blueprints"],
  },
  sp: {
    name: "Unallocated Stat Points (SP)",
    category: "Attribute Matrix",
    rarity: "RARE",
    description: "Raw neuro-biological capacity waiting to be permanently channeled into your core stats.",
    lore: "Every level ascension unchains latent neural synapses and muscle fiber potential. Distributing SP permanently rewrites your physical and mental baselines.",
    mechanics: "Freely allocate into Strength, Knowledge, Discipline, Focus, Endurance, Recovery, and Consistency to unlock Class requirements and scale Power Score.",
    tags: ["Attributes", "Build", "PowerScore", "Ascension"],
  },
  loggedDays: {
    name: "Active Logged Days",
    category: "System Attendance",
    rarity: "UNCOMMON",
    description: "Total cumulative days you have checked in and synced physical activity with Ascend OS.",
    lore: "The System records every single sunrise in which an Ascendant steps into the arena. Cumulative attendance fortifies circadian neuro-adaptation and long-term momentum.",
    mechanics: "Tracks lifetime platform engagement and unlocks milestone attendance titles like 'Disciplined Pioneer'.",
    tags: ["Attendance", "Consistency", "Activity", "Milestones"],
  },
  activeStreak: {
    name: "Active Habit Streak",
    category: "Momentum Resonance",
    rarity: "EPIC",
    description: "Consecutive uninterrupted days of completing all scheduled daily habit protocols.",
    lore: "Momentum is the hunter's sharpest blade. Each consecutive day creates cognitive resonance, drastically lowering the neurological friction required to initiate hard tasks.",
    mechanics: "Multiplies EXP and Gold yields by up to +50%, speeds up rank advancement, and bolsters total Character Power.",
    tags: ["Streak", "Momentum", "Habits", "Multipliers"],
  },
  bestStreak: {
    name: "Best Habit Streak Record",
    category: "Historical Sovereign Peak",
    rarity: "LEGENDARY",
    description: "Your all-time highest unbroken daily execution record preserved in the System archives.",
    lore: "A testament to unbreakable willpower etched into the permanent memory banks of Ascend OS. Serves as your personal benchmark for greatness.",
    mechanics: "Unlocks tier-exclusive achievements and proves long-term neuroplastic transformation.",
    tags: ["Record", "Peak", "Achievements", "Prestige"],
  },
  protectionShields: {
    name: "Aegis Streak Freeze Shield",
    category: "Cryo-Containment Barrier",
    rarity: "RARE",
    description: "An automated dimensional safety barrier that preserves your active habit streak during emergencies or rest days.",
    lore: "Constructed from stasis cryo-crystals that activate automatically the moment a midnight daily reset threatens an incomplete streak, preventing momentum loss without penalty.",
    mechanics: "Automatically consumes 1 shield when a day is missed to keep your habit streak intact. Can hold up to 3 shields simultaneously.",
    tags: ["Shield", "Protection", "StreakFreeze", "Safety"],
  },
};

export interface StatLoreEntry {
  name: string;
  abbreviation: string;
  category: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  description: string;
  realWorldImpact: string;
  combatScaling: string;
  lore: string;
  associatedSkills: string[];
}

export const STAT_LORE: Record<string, StatLoreEntry> = {
  strength: {
    name: "Strength",
    abbreviation: "STR",
    category: "Physical Power",
    rarity: "RARE",
    description: "Neuromuscular motor unit recruitment, heavy compound lifting output, and physical force production.",
    realWorldImpact: "Drives myofibrillar hypertrophy, increases skeletal bone mineral density, optimizes testosterone production, and scales 1RM bench/squat/deadlift strength.",
    combatScaling: "Directly increases physical strike damage in Tower battles, allows wielding heavy colosseum weaponry, and breaks enemy armor barriers.",
    lore: "The foundation of all physical monarchs. True strength is not merely mass—it is the neural coordination of billions of myofibrils firing in unison to overcome resistance.",
    associatedSkills: ["Crushing Strike", "Titan Slam", "Heavy Armor Mastery"],
  },
  knowledge: {
    name: "Knowledge",
    abbreviation: "KNW",
    category: "Cognitive Mastery",
    rarity: "RARE",
    description: "Intellectual depth, analytical logic, skill learning velocity, and mental model synthesis.",
    realWorldImpact: "Enhances synaptic neuroplasticity, accelerates comprehension of technical concepts, strengthens long-term memory consolidation, and refines problem-solving.",
    combatScaling: "Scales elemental spell amplification, speeds up Mana regeneration, and unlocks arcane mastery passives.",
    lore: "Knowledge is the blueprint through which mana is woven. Sages who master the mathematical laws of dimensional rifts reshape entropy at command.",
    associatedSkills: ["Aether Mastery", "Mana Weaving", "Dimensional Insight"],
  },
  discipline: {
    name: "Discipline",
    abbreviation: "DIS",
    category: "Willpower Fortress",
    rarity: "EPIC",
    description: "Executive function, friction overcoming capacity, and resistance to instant-gratification dopamine traps.",
    realWorldImpact: "Strengthens prefrontal cortex volume, diminishes procrastination, enforces circadian sleep timing, and guarantees task execution under emotional stress.",
    combatScaling: "Provides status ailment resistance, shields against cognitive debuffs, and reduces habit friction damage.",
    lore: "Motivation is a fleeting spark; discipline is the eternal thermonuclear engine. The warrior who commands their own mind commands the battlefield.",
    associatedSkills: ["Iron Will", "Friction Ward", "Unshakable Focus"],
  },
  focus: {
    name: "Focus",
    abbreviation: "FCS",
    category: "Attention & Precision",
    rarity: "RARE",
    description: "Sustained deep work capacity, attention span fidelity, and laser-like task accuracy.",
    realWorldImpact: "Induces 90-minute ultradian flow states, eliminates cognitive switching costs, and dramatically improves technical and motor skill precision.",
    combatScaling: "Directly multiplies Critical Strike Chance, reveals enemy anatomical weakspots, and enhances evasive reaction speed.",
    lore: "When focus narrows to a singular point, time dilates. The assassin's dagger and the scholar's pen both strike with fatal precision.",
    associatedSkills: ["Lethal Precision", "Flow State Resonance", "Weakpoint Analysis"],
  },
  endurance: {
    name: "Endurance",
    abbreviation: "END",
    category: "Cardiovascular Resilience",
    rarity: "RARE",
    description: "VO2 max aerobic capacity, mitochondrial density, lactic acid buffering, and stamina under heavy load.",
    realWorldImpact: "Lowers resting heart rate, maximizes capillary blood flow to muscles and brain, increases metabolic flexibility, and delays cognitive exhaustion.",
    combatScaling: "Directly scales maximum Character HP in Tower battles, granting immense survival against boss ultimate phases.",
    lore: "The marathon of ascension belongs to those whose hearts beat with the steady rhythm of tectonic plates. They outlast every storm.",
    associatedSkills: ["Mitochondrial Surge", "Second Wind", "Titan Fortitude"],
  },
  recovery: {
    name: "Recovery",
    abbreviation: "REC",
    category: "Biological Repair",
    rarity: "UNCOMMON",
    description: "Parasympathetic nervous regulation, slow-wave deep sleep architecture, and cellular regeneration.",
    realWorldImpact: "Accelerates muscle protein synthesis (MPS), clears systemic cortisol and inflammation, and optimizes growth hormone release during sleep.",
    combatScaling: "Increases out-of-combat HP regeneration, accelerates daily recovery cooldowns, and enhances elixir potency.",
    lore: "Growth does not occur in the furnace of battle, but in the quiet restoration that follows. True power honors the restorative cycle of the moon.",
    associatedSkills: ["Cellular Rebirth", "Parasympathetic Calm", "Rapid Mending"],
  },
  consistency: {
    name: "Consistency",
    abbreviation: "CON",
    category: "Habit Momentum",
    rarity: "EPIC",
    description: "Habit loop consolidation (cue-routine-reward), daily protocol fidelity, and circadian momentum.",
    realWorldImpact: "Automates daily positive behaviors into effortless basal ganglia routines, preventing burnout and guaranteeing compound life progress.",
    combatScaling: "Permanently scales passive EXP and Gold multipliers, unlocks Sovereign milestone titles, and amplifies all class buffs.",
    lore: "The drop of water that hollows the stone does so not by force, but by falling again and again without fail.",
    associatedSkills: ["Temporal Flow", "Sovereign Momentum", "Eternal Routine"],
  },
};

export interface WorkoutLoreEntry {
  name: string;
  category: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  targetMuscles: {
    primary: string[];
    secondary: string[];
  };
  biomechanics: string;
  lore: string;
  exercises: Array<{ name: string; target: string; setsReps: string }>;
}

export const WORKOUT_LORE: Record<string, WorkoutLoreEntry> = {
  "Push Split": {
    name: "Push Split Hypertrophy Routine",
    category: "Upper Kinetic Pressing",
    rarity: "EPIC",
    targetMuscles: {
      primary: ["Pectoralis Major (Chest)", "Anterior Deltoids (Front Shoulders)", "Triceps Brachii (Arm Extensors)"],
      secondary: ["Serratus Anterior", "Rotator Cuff", "Transverse Abdominis (Core)"],
    },
    biomechanics: "Focuses on horizontal and vertical pressing mechanics. Heavy multi-joint compound presses recruit high-threshold Type IIx motor units, stimulating myofibrillar protein synthesis.",
    lore: "The vanguard routine of gladiators and titans. Forging an impenetrable chest and shoulder barrier capable of absorbing and deflecting heavy kinetic shockwaves.",
    exercises: [
      { name: "Barbell Bench Press", target: "Mid-Chest & Triceps", setsReps: "4 Sets x 6-8 Reps" },
      { name: "Incline Dumbbell Press", target: "Clavicular Upper Chest", setsReps: "3 Sets x 8-10 Reps" },
      { name: "Overhead Barbell Press (OHP)", target: "Anterior Deltoids", setsReps: "3 Sets x 6-8 Reps" },
      { name: "Dips / Cable Flyes", target: "Lower Chest & Squeeze", setsReps: "3 Sets x 10-12 Reps" },
      { name: "Tricep Rope Pushdowns", target: "Lateral & Medial Triceps", setsReps: "3 Sets x 12-15 Reps" },
    ],
  },
  "Pull Split": {
    name: "Pull Split Hypertrophy Routine",
    category: "Dorsal Kinetic Chain",
    rarity: "EPIC",
    targetMuscles: {
      primary: ["Latissimus Dorsi (Lats)", "Rhomboids & Trapezius (Upper Back)", "Posterior Deltoids (Rear Shoulders)", "Biceps Brachii & Brachialis"],
      secondary: ["Erector Spinae (Lower Back)", "Forearm Flexors & Grip", "Brachioradialis"],
    },
    biomechanics: "Emphasizes scapular retraction, humeral adduction, and elbow flexion. Balances pressing posture and builds the coveted athletic V-Taper aesthetic.",
    lore: "The discipline of the hunter. Builds the pulling power required to scale vertical cliffs of ancient gates and draw heavy warbows across dimensional boundaries.",
    exercises: [
      { name: "Deadlift / Weighted Pull-Ups", target: "Full Posterior Chain & Lats", setsReps: "4 Sets x 5-8 Reps" },
      { name: "Barbell Bent-Over Row", target: "Rhomboids & Mid-Back Thickness", setsReps: "4 Sets x 8-10 Reps" },
      { name: "Lat Pulldowns / Cable Rows", target: "Latissimus Dorsi Width", setsReps: "3 Sets x 10-12 Reps" },
      { name: "Face Pulls", target: "Rear Delts & Rotator Cuff Health", setsReps: "3 Sets x 15 Reps" },
      { name: "Incline Dumbbell Bicep Curls", target: "Biceps Long Head", setsReps: "3 Sets x 10-12 Reps" },
    ],
  },
  "Legs Split": {
    name: "Legs & Lower Body Compound Routine",
    category: "Pillar Foundation",
    rarity: "EPIC",
    targetMuscles: {
      primary: ["Quadriceps Femoris (Front Thighs)", "Hamstrings (Posterior Thighs)", "Gluteus Maximus & Medius (Hips)", "Gastrocnemius & Soleus (Calves)"],
      secondary: ["Adductor Magnus", "Erector Spinae", "Deep Pelvic Floor & Core"],
    },
    biomechanics: "Combines knee-dominant squats and hip-dominant hinges to trigger maximal central nervous system recruitment and systemic metabolic conditioning.",
    lore: "A tower cannot stand on weak ground. The leg protocol grounds the hunter to the earth, anchoring kinetic power directly into the bedrock.",
    exercises: [
      { name: "Barbell Back Squat", target: "Quadriceps & Gluteal Drive", setsReps: "4 Sets x 6-8 Reps" },
      { name: "Romanian Deadlift (RDL)", target: "Hamstring Stretch & Glutes", setsReps: "3 Sets x 8-10 Reps" },
      { name: "Bulgarian Split Squat", target: "Unilateral Leg Strength & Balance", setsReps: "3 Sets x 10 Reps/leg" },
      { name: "Leg Curls & Extensions", target: "Hamstrings & Quads Isolation", setsReps: "3 Sets x 12-15 Reps" },
      { name: "Standing Calf Raises", target: "Gastrocnemius & Ankle Stability", setsReps: "4 Sets x 15-20 Reps" },
    ],
  },
};

export interface EnemyLoreEntry {
  name: string;
  title: string;
  category: string;
  threatLevel: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  description: string;
  lore: string;
  behavior: string;
  weakness: string;
  dropLore: string;
}

export const ENEMY_LORE: Record<string, EnemyLoreEntry> = {
  "Spiked Slime": {
    name: "Spiked Slime",
    title: "Abyssal Floor 1 Aberration",
    category: "Elemental Slime",
    threatLevel: "E-Rank Gate Fiend",
    rarity: "COMMON",
    description: "A resilient gelatinous organism infused with jagged crystal spikes that corrodes armor on contact.",
    lore: "Mutated acidic protoplasm that coalesced from ambient mana seepage on the lower floors of the Tower. Hardened silicon crystals jut out from its viscous membrane.",
    behavior: "Lunges forward with kinetic elasticity, attempting to engulf weapons and corrode hunter armor with acidic enzyme bursts.",
    weakness: "Thermal Fire spells and blunt concussive strikes that shatter its internal silicon core.",
    dropLore: "Leaves behind purified slime gel and low-tier mana residues traded for basic health elixirs.",
  },
  "Vampire Bat": {
    name: "Vampire Bat",
    title: "Screeching Shadow Predator",
    category: "Aerial Beast",
    threatLevel: "E-Rank Gate Fiend",
    rarity: "COMMON",
    description: "A swift nocturnal predator with razor fangs that drains vital energy to sustain its rapid flight.",
    lore: "Dwells in the vaulted ceilings of early tower chambers. Their supersonic echolocation disorients ascendants before swooping down in coordinated swarms.",
    behavior: "High-speed erratic divebombs targeting exposed neck arteries, draining stamina and inflicting bleed.",
    weakness: "Precision ranged strikes, high Focus critical hits, and Tempest lightning shocks.",
    dropLore: "Bat wings and concentrated coagulated blood vials used in swiftness drafts.",
  },
  "Dungeon Rat": {
    name: "Dungeon Rat",
    title: "Plague-Infested Scavenger",
    category: "Beast Fiend",
    threatLevel: "E-Rank Gate Fiend",
    rarity: "COMMON",
    description: "An aggressive sewer rodent mutated by ambient miasma with sharp claws and toxic bite.",
    lore: "Thrives amidst discarded debris of forgotten ascendant expeditions. Its bite transmits necrotic dampening that slows hunter reaction speeds.",
    behavior: "Aggressive low-stance rushes with rapid flurry bites, seeking to overwhelm hunters in narrow corridors.",
    weakness: "Heavy Strength sweeping melee swings and radiant cleansing holy light.",
    dropLore: "Hardened rodent pelts and toxic bile glands used in poison coatings.",
  },
  "Armored Crab": {
    name: "Armored Crab",
    title: "Carapace Guardian",
    category: "Chitin Fiend",
    threatLevel: "D-Rank Gate Fiend",
    rarity: "UNCOMMON",
    description: "A heavily fortified crustacean with an impenetrable shell that shrugs off light physical strikes.",
    lore: "Formed from ancient calcified reef beds submerged under Tower ether. Its pincers can crush titanium steel plate like paper.",
    behavior: "Hunkers behind impenetrable front claws, deflecting frontal attacks before delivering bone-shattering crush counter-blows.",
    weakness: "Arcane Knowledge magic spells and armor-piercing blunt force.",
    dropLore: "Chitinous carapace fragments prized for crafting vanguard shield reinforcements.",
  },
  "Flying Skull": {
    name: "Flying Skull",
    title: "Spectral Flame Apparition",
    category: "Undead Spirit",
    threatLevel: "D-Rank Gate Fiend",
    rarity: "UNCOMMON",
    description: "A floating skeletal remains enveloped in spectral emerald flames that detonates when threatened.",
    lore: "The cursed soul remnants of fallen challengers who perished in the Tower, bound to eternal patrol duty by ancient necromantic glyphs.",
    behavior: "Hovers out of melee reach while chanting cursed hexes, charging forward into an explosive self-destruct upon critical damage.",
    weakness: "High Endurance sustained attrition and holy light dispelling magic.",
    dropLore: "Ectoplasmic embers and haunted bone dust used for enchanting accessories.",
  },
  "Goblin Scout": {
    name: "Goblin Scout",
    title: "Shadow Cave Infiltrator",
    category: "Humanoid Fiend",
    threatLevel: "E-Rank Gate Fiend",
    rarity: "COMMON",
    description: "A stealthy cave scavenger armed with rusted poison daggers that excels at ambush tactics.",
    lore: "Cunning sub-terrestrial scouts armed with rusted daggers and obsidian whistles. They dwell in the dim crevices of lower gate corridors, ambush-hunting stray ascendants.",
    behavior: "Uses rapid flanking movements and poison-tipped daggers, retreating into shadows when countered.",
    weakness: "High Focus critical strikes and wide-arc slashing melee weapons.",
    dropLore: "Carries stolen imperial coin pouches and rough iron sharpening stones.",
  },
  "Golux": {
    name: "Golux",
    title: "Floor 5 Titan Monarch",
    category: "Abyssal Colossus",
    threatLevel: "Floor 5 Boss Tier",
    rarity: "LEGENDARY",
    description: "A towering monolithic warden commanding earth pillars and gravitational shockwaves.",
    lore: "The ancient gatekeeper guarding the first elevator checkpoint. Built from primordial stone slabs, its glowing rune core pulses with the weight of mountains.",
    behavior: "Summons ground spikes, casts wide-area shockwaves, and slams giant stone fists that test player Discipline and counter-timing.",
    weakness: "Disciplined defensive parries and Ascension celestial elemental strikes.",
    dropLore: "Yields Golux Titan Core and large bounties of Imperial Gold and Astral Gems.",
  },
  "Gollux": {
    name: "Gollux",
    title: "Floor 5 Titan Monarch",
    category: "Abyssal Colossus",
    threatLevel: "Floor 5 Boss Tier",
    rarity: "LEGENDARY",
    description: "A towering monolithic warden commanding earth pillars and gravitational shockwaves.",
    lore: "The ancient gatekeeper guarding the first elevator checkpoint. Built from primordial stone slabs, its glowing rune core pulses with the weight of mountains.",
    behavior: "Summons ground spikes, casts wide-area shockwaves, and slams giant stone fists that test player Discipline and counter-timing.",
    weakness: "Disciplined defensive parries and Ascension celestial elemental strikes.",
    dropLore: "Yields Golux Titan Core and large bounties of Imperial Gold and Astral Gems.",
  },
  "Arcane Wizard": {
    name: "Arcane Wizard",
    title: "Floor 10 Sorcery Master",
    category: "Archmage Specter",
    threatLevel: "Floor 10 Boss Tier",
    rarity: "LEGENDARY",
    description: "An ancient spectral archmage channeling destructive tempest lightning and cosmic barrier wards.",
    lore: "Once the grand librarian of the Upper Monolith, now consumed by forbidden void formulas. His levitating grimoires cast dual incantations simultaneously.",
    behavior: "Teleports away from melee threats, casts chain lightning storms, and erects impenetrable prismatic barriers.",
    weakness: "Heavy Strength gap-closing physical strikes and high-damage interrupts.",
    dropLore: "Arcane Grimoire Pages, Astral Gems, and Sovereign Mana Crystals.",
  },
  "Necromancer": {
    name: "Necromancer",
    title: "Floor 15 Lord of Graves",
    category: "Dark Sorcerer",
    threatLevel: "Floor 15 Boss Tier",
    rarity: "LEGENDARY",
    description: "A sinister practitioner of soul manipulation who summons skeleton legions and leeches hunter vitality.",
    lore: "Harvester of souls across a thousand failed ascents. His scythe drips with soul ichor, converting taken lives into protective bone armor.",
    behavior: "Raises endless undead minions, casts health-draining life siphon beams, and releases cursed corpse explosions.",
    weakness: "High Recovery burst surges and Holy / Thermal Flame incinerations.",
    dropLore: "Soul Gem Shards, Death Weaver Robes, and Massive Token Bounties.",
  },
  "NightBorne": {
    name: "NightBorne",
    title: "Floor 20 Abyssal Sovereign",
    category: "Void Overlord",
    threatLevel: "Floor 20 Apex Boss",
    rarity: "MYTHIC",
    description: "The pinnacle supreme warden of the Ascend Monolith wielding dark void blades and dimensional rifts.",
    lore: "An immortal entity born before time itself in the cosmic dark between dimensions. Only hunters with unbreakable Consistency and supreme power can withstand his blade.",
    behavior: "Phase-shifts through spacetime, executing ultra-fast multi-slash slashes and summoning apocalyptic void singularities.",
    weakness: "Unbreakable Consistency momentum and Tide elemental counter-resonance.",
    dropLore: "Sovereign Crown of Ascension, Mythic Void Blade, and Maximum Gem/Token Bounties.",
  },
  "Obsidian Sentinel": {
    name: "Obsidian Sentinel",
    title: "Ancient Tower Colossus",
    category: "Volcanic Golem",
    threatLevel: "S-Rank Gate Boss",
    rarity: "LEGENDARY",
    description: "A super-dense volcanic monolith carved from cooled lava magma with near-indestructible armor.",
    lore: "Carved from the super-heated volcanic magma of the primordial earth rift. Its black obsidian armor plates have withstood thousands of challenger strikes without a scratch.",
    behavior: "Slams the ground with tectonic magnitude shockwaves, summoning molten magma fissures that incinerate entire combat arenas.",
    weakness: "Cryo-frost spells that induce rapid thermal shock, cracking its volcanic mantle.",
    dropLore: "Yields Legendary Obsidian Plating and the Sovereign Sentinel Core.",
  },
  "Infernal Behemoth": {
    name: "Infernal Behemoth",
    title: "Rift Gate Lord of Ash",
    category: "Demonic Lord",
    threatLevel: "S-Rank World Boss",
    rarity: "MYTHIC",
    description: "An apocalyptic apex predator wreathed in eternal plasma flames that crushes opposition with brute momentum.",
    lore: "An apocalyptic beast born in the subterranean core of the Ash Wastes. Its breath incinerates armor, and its blood burns with permanent plasma flames.",
    behavior: "Rampages across the battlefield with unstoppable momentum, unleashing high-temperature firestorms and devastating crushing jaws.",
    weakness: "Cryo-elemental vulnerability and precision strikes to its cardiac mana valve.",
    dropLore: "Behemoth Dragon Horns and Sovereign Fire Essence.",
  },
};

export function getEnemyLore(name?: string, floorNumber: number = 1, isBoss: boolean = false): EnemyLoreEntry {
  if (name && ENEMY_LORE[name]) {
    return ENEMY_LORE[name];
  }

  // Fallback pattern matching
  const lower = (name || "").toLowerCase();
  for (const key of Object.keys(ENEMY_LORE)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return ENEMY_LORE[key];
    }
  }

  // Generic dynamic fallback
  const tierName = isBoss ? `Floor ${floorNumber} Boss` : `Floor ${floorNumber} Guardian`;
  return {
    name: name || (isBoss ? "Tower Apex Boss" : "Dimensional Fiend"),
    title: `${tierName} • Level ${floorNumber}`,
    category: isBoss ? "Abyssal Boss" : "Gate Aberration",
    threatLevel: isBoss ? "S-Rank Boss Tier" : "Standard Fiend",
    rarity: isBoss ? "LEGENDARY" : "UNCOMMON",
    description: isBoss
      ? `A fearsome monolithic champion defending the dimensional seals of Floor ${floorNumber}.`
      : `A hostile dimensional creature patrolling Floor ${floorNumber} of the Ascend Tower.`,
    lore: `Dwells in the ether-rich corridors of Floor ${floorNumber}. Its physical form is nourished by ambient ascension energy.`,
    behavior: "Attacks intruders on sight with high-intensity combat routines and evasive maneuvers.",
    weakness: "Exploit tactical attribute weakness and elemental affinity matching (+25% DMG).",
    dropLore: "Leaves behind Imperial Gold, EXP Essence, and Tower Tokens.",
  };
}
