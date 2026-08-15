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
  howToImproveSummary: string;
  howToImprove: string[];
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
    howToImproveSummary: "Execute progressive overload in heavy compound lifts and high-intensity resistance training in the Workout Logger.",
    howToImprove: [
      "Log Barbell Back Squats & Deadlifts (85%+ 1RM for central nervous system recruitment)",
      "Perform Barbell Bench Press, Overhead Press (OHP), and Incline Dumbbell Presses",
      "Incorporate Weighted Pull-ups, Dips, and Heavy Romanian Deadlifts (RDLs)",
      "Log new 1RM Personal Records (PRs) in the Weekly Boss PR encounter",
      "Consume 1.6g-2.2g protein per kg bodyweight to accelerate myofibrillar repair"
    ],
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
    howToImproveSummary: "Complete daily reading, technical skill practice, academic coursework, and deep intellectual studies.",
    howToImprove: [
      "Complete 30-45 minutes of daily non-fiction reading (science, engineering, philosophy)",
      "Practice coding, software architecture, algorithm design, or foreign languages",
      "Review academic lectures, scientific papers, and high-level educational curricula",
      "Synthesize conceptual notes and write summaries using the Feynman Technique",
      "Create and fulfill daily 'Study & Learning' tagged habit missions"
    ],
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
    howToImproveSummary: "Complete daily scheduled missions without skipping and protect consecutive habit streak momentum.",
    howToImprove: [
      "Execute scheduled morning habits immediately upon waking without hitting snooze",
      "Fulfill 100% of your daily habit quests across easy, medium, and hard tiers",
      "Maintain active habit streaks across 7, 14, 30, and 60+ consecutive days",
      "Resist impulse browsing, social media dopamine scrolling, and instant distractions",
      "Take cold showers, practice delayed gratification, and finish difficult tasks first"
    ],
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
    howToImproveSummary: "Log undistracted 60-90 minute Deep Work blocks, Pomodoro focus cycles, and mindfulness meditation.",
    howToImprove: [
      "Conduct uninterrupted 90-minute Deep Work blocks with all phone notifications disabled",
      "Utilize Pomodoro cycles (50 min work / 10 min break) for intense technical tasks",
      "Practice 10-15 minutes of daily breathwork, mindfulness, or open-monitoring meditation",
      "Work in dedicated distraction-free environments with binaural alpha/theta audio",
      "Track and complete daily 'Deep Focus / Project Execution' habit missions"
    ],
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
    howToImproveSummary: "Log running, cycling, rowing, daily step targets (10,000+), and high-volume aerobic conditioning.",
    howToImprove: [
      "Achieve 8,000 to 12,000+ daily steps to feed and incubate Dragon eggs",
      "Perform Zone 2 cardio (45-60 mins of steady jogging, cycling, or incline walking at 60-70% max HR)",
      "Execute high-intensity interval training (HIIT) sprints and kettlebell complexes",
      "Incorporate high-rep metabolic resistance sets (15-25 reps per set) in workouts",
      "Practice nasal breathing during steady-state aerobic runs to optimize CO2 tolerance"
    ],
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
    howToImproveSummary: "Log 7.5-9 hours of consistent circadian sleep, schedule scheduled rest days, and follow biometric heatmap fatigue alerts.",
    howToImprove: [
      "Maintain a strict circadian sleep schedule (sleep and wake within 30 mins every day)",
      "Ensure 7.5 to 9 hours of sleep with a cool, pitch-dark, quiet bedroom environment",
      "Allow fatigued muscle groups (<50% freshness on the Body Heatmap) 48-72h of full rest",
      "Practice post-workout stretching, foam rolling, sauna sessions, or cold plunges",
      "Avoid screens, blue light, and heavy meals within 2 hours of bedtime"
    ],
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
    howToImproveSummary: "Achieve 100% Daily All-Clear habit completions, log check-ins daily, and avoid zero-progress days.",
    howToImprove: [
      "Achieve 100% completion of all daily habit missions for the Daily All-Clear bonus",
      "Check in and sync your activity with Ascend OS daily to maintain calendar heatmap cadence",
      "Utilize the 2-Minute Rule for habits when energy is low rather than skipping entirely",
      "Equip and manage Streak Freeze Shields to safeguard long-term momentum during emergencies",
      "Stack new positive habits immediately after existing established daily rituals"
    ],
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

// =======================================================================
// 🥚 EGG STORY LORE REGISTRY
// =======================================================================
export interface EggLoreEntry {
  name: string;
  element: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";
  origin: string;
  storyLore: string;
  incubationGuide: string;
  potentialBeasts: string[];
}

export const EGG_LORE: Record<string, EggLoreEntry> = {
  "Woodland Earth Egg": {
    name: "Woodland Earth Egg",
    element: "Nature / Earth",
    rarity: "COMMON",
    origin: "Harvested from glowing moss nests in the verdant outskirts of beginner dimensional rifts.",
    storyLore: "Pulsing with gentle earthen mana and biological vitality. Juvenile woodland wyrms curl inside, absorbing the kinetic vibrations of the hunter's daily walking footsteps until their shell cracks with verdant light.",
    incubationGuide: "Accumulate 3,000 steps through daily walks, light errands, or steady movement to crack the outer moss shell.",
    potentialBeasts: ["Florian (Verdant Sylva)", "Nyx (Shadow Drake)", "Bramble (Thornwood Dragon)"],
  },
  "Glacial Cryo Egg": {
    name: "Glacial Cryo Egg",
    element: "Frost / Ice",
    rarity: "RARE",
    origin: "Chiseled from the thousand-year ice spire of Mount Ymir in the frozen Abyss.",
    storyLore: "Encased in eternal sub-zero permafrost that never melts. The cryogenic dragon inside channels absolute zero temperature, focusing the hunter's mind into diamond-hard concentration.",
    incubationGuide: "Accumulate 5,000 steps to generate enough internal friction heat to awaken the cryo-drake.",
    potentialBeasts: ["Ymir (Glacial Frost Dragon)", "Thalassa (Abyssal Tide Dragon)", "Borealis (Aurora Frost Wyrm)"],
  },
  "Solar Flare Egg": {
    name: "Solar Flare Egg",
    element: "Solar / Fire",
    rarity: "EPIC",
    origin: "Forged at the solar zenith of the Imperial Pyre in the celestial dragon realm.",
    storyLore: "Its crimson-gold crystalline shell radiates miniature solar flares and thermic heat. The embryonic solar dragon within feeds on workout intensity and unbroken daily consistency, yearning to ignite the skies.",
    incubationGuide: "Requires 8,000 steps and high-volume workout sessions to reach thermal fusion temperature and hatch the radiant dragon.",
    potentialBeasts: ["Ignis (Solar Flame Dragon)", "Volcanus (Magma Core Wyrm)", "Crimson (Blood Wyrm)"],
  },
  "Neon Cyber Egg": {
    name: "Neon Cyber Egg",
    element: "Cyber / Tech",
    rarity: "LEGENDARY",
    origin: "Excavated from subterranean server monoliths beneath the lost Neon Metropolis.",
    storyLore: "Encased in brushed carbon-titanium alloy and micro-circuit wiring. A synthetic bio-dragon core calculates real-time step acceleration metrics, converting raw human kinetic steps into computational power.",
    incubationGuide: "Accumulate 12,000 steps to calibrate the cybernetic shell's quantum capacitors and initiate system hatching.",
    potentialBeasts: ["Cyberion (Synthetic Neon Wyrm)", "Chrono (Temporal Spark Drake)", "Zephyrus (Tempest Storm Drake)"],
  },
  "Cosmic Void Egg": {
    name: "Cosmic Void Egg",
    element: "Void / Darkness",
    rarity: "MYTHIC",
    origin: "Recovered from the singularity event horizon of collapsed S-Rank Gate rifts.",
    storyLore: "Hovering slightly above its pedestal, this obsidian egg absorbs ambient darkness and radiates a chilling gravitational pulse. Within lies an ancient void monarch waiting for an Ascendant of unbroken discipline.",
    incubationGuide: "Channel 20,000 physical steps and intense workout energy to overcome its dark gravity well and shatter the outer shell.",
    potentialBeasts: ["Erebos (Void Star Dragon)", "Aurelius (Golden Celestial Wyrm)", "Aether (Prismatic Astral Wyrm)"],
  },
  "Common Elemental Egg": {
    name: "Common Elemental Egg",
    element: "Nature / Earth",
    rarity: "COMMON",
    origin: "Harvested from glowing moss nests in the verdant outskirts of beginner dimensional rifts.",
    storyLore: "Pulsing with gentle earthen mana and biological vitality. Juvenile woodland wyrms curl inside, absorbing the kinetic vibrations of the hunter's daily walking footsteps until their shell cracks with verdant light.",
    incubationGuide: "Accumulate 3,000 steps through daily walks, light errands, or steady movement to crack the outer moss shell.",
    potentialBeasts: ["Florian (Verdant Sylva)", "Nyx (Shadow Drake)", "Aero (Gale Whelp)"],
  },
  "Rare Cybernetic Egg": {
    name: "Rare Cybernetic Egg",
    element: "Cyber / Tech",
    rarity: "RARE",
    origin: "Excavated from subterranean server monoliths beneath the lost Neon Metropolis.",
    storyLore: "Encased in brushed carbon-titanium alloy and micro-circuit wiring. A synthetic bio-dragon core calculates real-time step acceleration metrics, converting raw human kinetic steps into computational power.",
    incubationGuide: "Accumulate 6,000 steps to calibrate the cybernetic shell's quantum capacitors and initiate system hatching.",
    potentialBeasts: ["Vesperis (Void Drake)", "Ymir (Glacial Frost Dragon)", "Glitch (Cyber Mecha Drake)"],
  },
  "Epic Void Core Egg": {
    name: "Epic Void Core Egg",
    element: "Void / Darkness",
    rarity: "EPIC",
    origin: "Recovered from the singularity event horizon of collapsed S-Rank Gate rifts.",
    storyLore: "Hovering slightly above its pedestal, this obsidian egg absorbs ambient darkness and radiates a chilling gravitational pulse. Within lies an ancient void monarch waiting for an Ascendant of unbroken discipline.",
    incubationGuide: "Channel 10,000 physical steps and intense workout energy to overcome its dark gravity well and shatter the outer shell.",
    potentialBeasts: ["Morvath (Amethyst Wyrm)", "Ignis (Solar Flame Dragon)", "Shadowfang (Void Colossus)"],
  },
  "Legendary Solar Flare Egg": {
    name: "Legendary Solar Flare Egg",
    element: "Solar / Fire",
    rarity: "LEGENDARY",
    origin: "Forged at the solar zenith of the Imperial Pyre in the celestial dragon realm.",
    storyLore: "Its crimson-gold crystalline shell radiates miniature solar flares and thermic heat. The embryonic solar dragon within feeds on workout intensity and unbroken daily consistency, yearning to ignite the skies.",
    incubationGuide: "Requires 15,000 steps and high-volume workout sessions to reach thermal fusion temperature and hatch the radiant dragon.",
    potentialBeasts: ["Aurelius (Golden Sun Drake)", "Ignis (Solar Flame Lord)", "Volcanis (Magma Wyrm)"],
  },
  "Mythic Astral Celestial Egg": {
    name: "Mythic Astral Celestial Egg",
    element: "Astral / Starlight",
    rarity: "MYTHIC",
    origin: "Summoned from the alignment of the 7 Ascendant Constellations across the outer cosmos.",
    storyLore: "A transcendent celestial relic woven from stardust, cosmic nebulae, and pure primordial mana. Its shell contains the heartbeat of a cosmic celestial monarch capable of bending spacetime and granting sovereign buffs.",
    incubationGuide: "Demands 20,000 steps of relentless human endurance and flawless habit mastery to awaken the celestial sovereign.",
    potentialBeasts: ["Chronos (Time Weaver Dragon)", "Astraea (Cosmic Sovereign Wyrm)", "Solaria (Starlight Drake)"],
  },
  "Glacial Permafrost Egg": {
    name: "Glacial Permafrost Egg",
    element: "Frost / Ice",
    rarity: "RARE",
    origin: "Chiseled from the thousand-year ice spire of Mount Ymir in the frozen Abyss.",
    storyLore: "Encased in eternal sub-zero permafrost that never melts. The cryogenic dragon inside channels absolute zero temperature, focusing the hunter's mind into diamond-hard concentration.",
    incubationGuide: "Accumulate 6,000 steps to generate enough internal friction heat to awaken the cryo-drake.",
    potentialBeasts: ["Ymir (Frost Wyrm)", "Blizzard (Arctic Drake)", "Hailstorm (Glacial Sovereign)"],
  },
};

// =======================================================================
// 🏆 ACHIEVEMENT STORY LORE REGISTRY
// =======================================================================
export interface AchievementLoreEntry {
  title: string;
  storyLore: string;
  historicalContext: string;
  unlockWisdom: string;
}

export const ACHIEVEMENT_LORE: Record<string, AchievementLoreEntry> = {
  "First Step of Greatness": {
    title: "First Step of Greatness",
    storyLore: "The grand monolith of the System does not record the intentions of men, only their actions. The first completed habit is the chisel that strikes the stone of destiny.",
    historicalContext: "In the First Age of Awakening, the ancient monarchs realized that power was not inherited—it was forged one sunrise at a time.",
    unlockWisdom: "A single routine executed today is worth ten thousand planned for tomorrow.",
  },
  "Unbroken Streak": {
    title: "Unbroken Streak",
    storyLore: "Seven consecutive sunrises. Seven victories over the neurological friction of hesitation. The neural pathways of habit have begun their irreversible crystallization.",
    historicalContext: "The Order of Seven Sunrises was an ancient brotherhood of hunters who never broke cadence, surviving every siege through momentum.",
    unlockWisdom: "Momentum is a multiplier that compounds willpower into effortless execution.",
  },
  "Consistency Sovereign": {
    title: "Consistency Sovereign",
    storyLore: "Fifty daily quests fulfilled. The basal ganglia now fires without emotional resistance. The hunter has transitioned from novice struggle to sovereign automaticity.",
    historicalContext: "Etched into the obelisk at the Tower entrance: 'He who conquers fifty days without wavering shall never again fear the abyss.'",
    unlockWisdom: "You do not rise to the level of your goals; you fall to the level of your daily consistency.",
  },
  "Iron Will": {
    title: "Iron Will",
    storyLore: "Thirty days of unbroken daily execution. Neuroplastic adaptation is complete. The prefrontal cortex now commands the physical body with absolute authority.",
    historicalContext: "Awarded only to Ascendants whose resolve weathered storms, emergencies, and fatigue without breaking their sacred covenant.",
    unlockWisdom: "True iron is not forged in comfort; it is tempered in the quiet decisions made when no one is watching.",
  },
  "Novice Lifter": {
    title: "Novice Lifter",
    storyLore: "The cold barbell rests across your shoulders. Gravitational resistance meets human will. The muscle fibers tear microscopically, only to rebuild stronger.",
    historicalContext: "The Colosseum of Iron was the proving ground where earthborn hunters transformed fragile biology into living kinetic armor.",
    unlockWisdom: "Every rep against gravity is a vote for the person you are becoming.",
  },
  "Iron Disciple": {
    title: "Iron Disciple",
    storyLore: "Ten completed workout sessions. Your central nervous system now recruits motor units with explosive efficiency. The biometric heatmap burns with righteous effort.",
    historicalContext: "Disciplines of the Iron Path were renowned for walking into dungeon rifts with nothing but bare fists and unwavering kinetic conditioning.",
    unlockWisdom: "Physical strength is the anchor that keeps mental focus from drifting in the wind.",
  },
  "Centurion of Iron": {
    title: "Centurion of Iron",
    storyLore: "One hundred workout sessions logged. Hundreds of thousands of kilograms hoisted against the earth's gravity. A physical titan walking among mortals.",
    historicalContext: "Centurions were the vanguard who shattered the obsidian walls of S-Rank gate guardians through pure unyielding physical volume.",
    unlockWisdom: "You have built a temple of muscle and bone that no storm can dismantle.",
  },
  "Tower Initiate": {
    title: "Tower Initiate",
    storyLore: "The heavy runic doors of Floor 1 grind open. The ancient guardians awaken from centuries of slumber. Your climb up the Tower of Ascension has begun.",
    historicalContext: "The Tower was raised in the celestial era to test if human willpower could reach the heights of the ancient cosmic sovereigns.",
    unlockWisdom: "The highest summit is conquered one floor at a time.",
  },
  "Guardian Slayer": {
    title: "Guardian Slayer",
    storyLore: "Floor 5 clears with a thunderous roar as the Shadow Overlord falls to dust. The first milestone boss of the spire has recognized your sovereign power.",
    historicalContext: "The Shadow Overlord held the 5th floor seal for four centuries until an Ascendant of true attribute balance broke his dark sword.",
    unlockWisdom: "No barrier is insurmountable when physical power, knowledge, and focus strike in unison.",
  },
  "Tower Conqueror": {
    title: "Tower Conqueror",
    storyLore: "Floor 10 conquered! The midway guardian of the spire falls to your blade. Dimensional rift tokens shower the arena as your name echoes across the leaderboard.",
    historicalContext: "Only the top 1% of registered hunters possess the combat power and equipment synergy required to survive Floor 10.",
    unlockWisdom: "When preparation meets opportunity, victory is the only mathematical outcome.",
  },
};

// =========================================================================
// 🐉 DRAGON STORY LORE & COMPANION CHRONICLES
// =========================================================================

export interface DragonLoreEntry {
  speciesId: number;
  name: string;
  species: string;
  element: "FIRE" | "FROST" | "VOID" | "CYBER" | "NATURE" | "HOLY" | "STORM";
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "HOLOGRAPHIC";
  storyLore: string;
  biologicalResonance: string;
  statBonusLabel: string;
  statBonusPercent: number;
}

export const DRAGON_LORE: Record<number, DragonLoreEntry> = {
  1: {
    speciesId: 1,
    name: "Vesperis",
    species: "Void Drake",
    element: "VOID",
    rarity: "RARE",
    storyLore: "Born in the abyssal silence between shattered dimensional rifts. Vesperis glides on weightless ethereal wings woven from cosmic dark matter, leaving trails of starlit violet embers in its wake.",
    biologicalResonance: "Synchronizes with the hunter's agile kinetic movements, converting brisk daily walking strides into a localized gravity reduction field.",
    statBonusLabel: "+8.0% Movement & Agility Multiplier",
    statBonusPercent: 8.0,
  },
  2: {
    speciesId: 2,
    name: "Morvath",
    species: "Amethyst Wyrm",
    element: "VOID",
    rarity: "EPIC",
    storyLore: "Ancient psychic dragon carved from crystallized mana geocores. Its translucent violet scales vibrate at harmonic frequencies that awaken dormant cognitive potential.",
    biologicalResonance: "Channels high-frequency astral frequencies into the hunter's prefrontal cortex, enhancing focus during study and deep reading blocks.",
    statBonusLabel: "+12.0% Knowledge (KNO) Multiplier",
    statBonusPercent: 12.0,
  },
  3: {
    speciesId: 3,
    name: "Florian",
    species: "Verdant Sylva Wyrm",
    element: "NATURE",
    rarity: "COMMON",
    storyLore: "A gentle woodland dragon that nests in the ancient canopies of the World Tree. Its breath carries the scent of petrichor and flowering moss.",
    biologicalResonance: "Absorbs environmental solar energy and releases restorative phytocides, accelerating cellular EXP synthesis on morning strolls.",
    statBonusLabel: "+6.0% Total EXP Multiplier",
    statBonusPercent: 6.0,
  },
  4: {
    speciesId: 4,
    name: "Ymir",
    species: "Glacial Frost Dragon",
    element: "FROST",
    rarity: "RARE",
    storyLore: "Hatched in the eye of a perpetual sub-zero blizzard. Ymir's crystalline scales radiate a calm, sub-zero aura that freezes distractions and doubts in their tracks.",
    biologicalResonance: "Reduces neurological noise and thermal stress, lowering heart rate variability for laser-sharp focus and stoic discipline.",
    statBonusLabel: "+10.0% Focus (FOC) Multiplier",
    statBonusPercent: 10.0,
  },
  5: {
    speciesId: 5,
    name: "Nyx",
    species: "Obsidian Shadow Drake",
    element: "VOID",
    rarity: "COMMON",
    storyLore: "Woven from cooling volcanic basalt and forgotten dungeon shadows. Nyx clings silently to the hunter's shoulder, feeding on fatigue and exhaling determination.",
    biologicalResonance: "Fortifies core muscular contraction and postural endurance by reinforcing kinetic feedback during heavy compound lifts.",
    statBonusLabel: "+5.0% Base Strength (STR) Multiplier",
    statBonusPercent: 5.0,
  },
  6: {
    speciesId: 6,
    name: "Ignis",
    species: "Solar Flame Dragon",
    element: "FIRE",
    rarity: "EPIC",
    storyLore: "Its draconic heart beats with the nuclear fury of an adolescent star. When Ignis roars, the surrounding air shimmers with thermic shockwaves.",
    biologicalResonance: "Ignites cellular ATP replenishment and neuromuscular power output, supercharging heavy barbell presses and explosive sprint sets.",
    statBonusLabel: "+15.0% Base Strength (STR) Multiplier",
    statBonusPercent: 15.0,
  },
  7: {
    speciesId: 7,
    name: "Aurelius",
    species: "Golden Celestial Wyrm",
    element: "HOLY",
    rarity: "LEGENDARY",
    storyLore: "An exalted dragon clad in impenetrable solar gold. Inscribed with sacred runes by ancient sky kings, Aurelius is the herald of sovereign prosperity.",
    biologicalResonance: "Radiates an auric magnetic resonance field that multiplies gold and relic bounty drops from all completed quests and tower monoliths.",
    statBonusLabel: "+30.0% Gold & Economy Multiplier",
    statBonusPercent: 30.0,
  },
  8: {
    speciesId: 8,
    name: "Thalassa",
    species: "Abyssal Tide Dragon",
    element: "FROST",
    rarity: "RARE",
    storyLore: "Glides seamlessly through oceanic jet streams and vapor currents. Thalassa's serpentine sapphire body moves with the effortless power of the deep ocean swells.",
    biologicalResonance: "Enhances pulmonary efficiency and aerobic VO2 capacity, stabilizing breath rhythm during continuous distance walking and endurance training.",
    statBonusLabel: "+10.0% Endurance (END) Multiplier",
    statBonusPercent: 10.0,
  },
  9: {
    speciesId: 9,
    name: "Zephyrus",
    species: "Tempest Storm Drake",
    element: "STORM",
    rarity: "COMMON",
    storyLore: "Sparks with azure static electricity as it darts across the sky. Zephyrus embodies the sudden fury and exhilarating velocity of summer squalls.",
    biologicalResonance: "Infuses rapid motor neuron recruitment into leg muscles, turning regular daily steps into high-cadence kinetic progress.",
    statBonusLabel: "+6.0% Agility Multiplier",
    statBonusPercent: 6.0,
  },
  10: {
    speciesId: 10,
    name: "Volcanus",
    species: "Magma Core Wyrm",
    element: "FIRE",
    rarity: "RARE",
    storyLore: "Forged in the molten depths of the Earth's mantle. Volcanus carries molten obsidian plates that glow with incandescent geothermal power.",
    biologicalResonance: "Boosts heat-shock protein synthesis and blood flow, providing resilience and explosive power for heavy back and leg workouts.",
    statBonusLabel: "+10.0% Base Strength (STR) Multiplier",
    statBonusPercent: 10.0,
  },
  11: {
    speciesId: 11,
    name: "Bramble",
    species: "Thornwood Dragon",
    element: "NATURE",
    rarity: "COMMON",
    storyLore: "Entangled in evergreen vines and sharp ironthorn briars. Bramble stands guardian over secluded forest clearings where ancient druids rested.",
    biologicalResonance: "Accelerates soft-tissue healing and reduces delayed onset muscle soreness (DOMS) after grueling physical training sessions.",
    statBonusLabel: "+7.0% Recovery (REC) Multiplier",
    statBonusPercent: 7.0,
  },
  12: {
    speciesId: 12,
    name: "Borealis",
    species: "Aurora Frost Wyrm",
    element: "FROST",
    rarity: "EPIC",
    storyLore: "Shimmers with breathtaking curtains of iridescent emerald, cyan, and magenta geomagnetic light. Manifests only beneath clear midnight skies.",
    biologicalResonance: "Synthesizes magnetic auroral currents into the hunter's aura, substantially boosting experience yield across every habit logged.",
    statBonusLabel: "+18.0% Total EXP Multiplier",
    statBonusPercent: 18.0,
  },
  13: {
    speciesId: 13,
    name: "Erebos",
    species: "Void Star Dragon",
    element: "VOID",
    rarity: "HOLOGRAPHIC",
    storyLore: "A mythic primordial entity born from the singularity of a collapsed star. Erebos bends light and spacetime, glitching reality with chromatic holographic brilliance.",
    biologicalResonance: "Transmutes every micro-action of real-world discipline into massive astronomical EXP growth, elevating your ascension rate to sovereign heights.",
    statBonusLabel: "+40.0% Sovereign EXP Multiplier",
    statBonusPercent: 40.0,
  },
  14: {
    speciesId: 14,
    name: "Solarius",
    species: "Dawn Light Drake",
    element: "HOLY",
    rarity: "COMMON",
    storyLore: "Emits a pure harmonic chime at the first ray of dawn. Solarius is the patron companion of early risers and dedicated morning practitioners.",
    biologicalResonance: "Reinforces circadian cortisol rhythm and willpower alignment, ensuring morning habits are completed with unwavering resolve.",
    statBonusLabel: "+7.0% Discipline (DIS) Multiplier",
    statBonusPercent: 7.0,
  },
  15: {
    speciesId: 15,
    name: "Cyberion",
    species: "Synthetic Neon Wyrm",
    element: "CYBER",
    rarity: "LEGENDARY",
    storyLore: "Engineered in neo-cybernetic laboratories with carbon nanotube muscles and glowing fiber-optic telemetry conduits. An overclocked biomechanical marvel.",
    biologicalResonance: "Hooks directly into your biological telemetry, providing real-time biomechanical optimization for maximum speed and step cadence.",
    statBonusLabel: "+25.0% Agility & Speed Multiplier",
    statBonusPercent: 25.0,
  },
  16: {
    speciesId: 16,
    name: "Gladius",
    species: "Iron Scale Dragon",
    element: "FIRE",
    rarity: "COMMON",
    storyLore: "Its scales ring like struck steel anvils. Gladius has witnessed thousands of historic battles, absorbing the martial spirit of victorious warriors.",
    biologicalResonance: "Channels dense kinetic shock absorption, shielding the hunter's tendons during maximal effort lifts and intense PR attempts.",
    statBonusLabel: "+7.0% Base Strength (STR) Multiplier",
    statBonusPercent: 7.0,
  },
  17: {
    speciesId: 17,
    name: "Terra",
    species: "Ancient Mountain Drake",
    element: "NATURE",
    rarity: "RARE",
    storyLore: "Carries a miniature mountain range on its rocky carapace. Terra moves with the unstoppable momentum of continental tectonic plates.",
    biologicalResonance: "Anchors cardiovascular stamina and mental grit, preventing fatigue from derailing multi-kilometer daily treks and long work sessions.",
    statBonusLabel: "+12.0% Endurance (END) Multiplier",
    statBonusPercent: 12.0,
  },
  18: {
    speciesId: 18,
    name: "Aether",
    species: "Prismatic Astral Wyrm",
    element: "VOID",
    rarity: "LEGENDARY",
    storyLore: "Woven from pure higher-dimensional starlight. Aether floats through gravitational planes without friction, warping the fabric of space itself.",
    biologicalResonance: "Expands neural processing bandwidth and abstract problem-solving capacity, amplifying Knowledge and analytical mastery.",
    statBonusLabel: "+28.0% Knowledge (KNO) Multiplier",
    statBonusPercent: 28.0,
  },
  19: {
    speciesId: 19,
    name: "Crimson",
    species: "Blood Wyrm",
    element: "FIRE",
    rarity: "EPIC",
    storyLore: "Ignites in incandescent crimson fire whenever battle reaches its peak. Crimson feeds on adrenaline and the thrill of surpassing limits.",
    biologicalResonance: "Surges blood nitric oxide levels and muscular vasodilation, unlocking monstrous pumps and strength gains in the gym.",
    statBonusLabel: "+18.0% Base Strength (STR) Multiplier",
    statBonusPercent: 18.0,
  },
  20: {
    speciesId: 20,
    name: "Chrono",
    species: "Temporal Spark Drake",
    element: "CYBER",
    rarity: "HOLOGRAPHIC",
    storyLore: "A holographic dragon that flickers in and out of the timeline. Chrono sees all past iterations and future timelines of the Ascendant's destiny.",
    biologicalResonance: "Bends the laws of probability and compound growth, delivering monumental economic bounties to hunters who maintain unbroken streaks.",
    statBonusLabel: "+50.0% Sovereign Gold Multiplier",
    statBonusPercent: 50.0,
  },
};



