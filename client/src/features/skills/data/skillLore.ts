export interface SkillLoreEntry {
  title: string;
  tagline: string;
  combatEffect: string;
  lore: string;
}

export const SKILL_LORE_MAP: Record<string, SkillLoreEntry> = {
  // FLAME PATH
  flame_01: {
    title: "Ignition Pulse",
    tagline: "Ignite the dormant embers of your muscle fibers.",
    combatEffect: "Deals 110% physical + thermal fire damage with every burst.",
    lore: "Legend holds that the ancient Fire Monks discovered this breathing technique while training beneath active volcano calderas. By synchronizing cardiovascular adrenaline with internal mana, the body's strike creates a sudden combustion wave.",
  },
  flame_02: {
    title: "Flame Touch",
    tagline: "Searing strikes that leave persistent residual burns.",
    combatEffect: "Deals 130% damage with a 15% chance to inflict Burn status across 2 combat cycles.",
    lore: "First documented in the chronicles of the Crimson Gate. Warriors who channeled this art could scorch enemy armor bare-handed, leaving scorched sigils that smolder long after the battle ends.",
  },
  flame_03: {
    title: "Magma Palm",
    tagline: "Deliver the crushing density of molten earth.",
    combatEffect: "Strikes with molten intensity, dealing 160% damage and bypassing 10% enemy armor.",
    lore: "Forged in the deep subterranean mantles of the Rift. Striking with Magma Palm liquefies dense defensive plates, reducing heavy armor to molten slag in an instant.",
  },
  flame_04: {
    title: "Inferno Clutch",
    tagline: "Ensnare the target within a vortex of incinerating flame.",
    combatEffect: "Grapples the foe in searing flames, dealing 200% high-burst single-target damage.",
    lore: "Whispered among high-rank Ascendants as the 'Grip of Ash'. Once an adversary is caught within the incandescent clutch, escaping the vortex is said to be as impossible as extinguishing the sun.",
  },
  flame_05: {
    title: "Pyroclastic Core",
    tagline: "Awaken an internal furnace of continuous thermonuclear power.",
    combatEffect: "Increases base Physical Power by +15% and boosts Burn damage by +25%.",
    lore: "An internal transformation where the Ascendant's cardiovascular core turns into a miniature stellar engine. Body heat rises to forge-like temperatures, converting sheer physical exhaustion into raw kinetic flame.",
  },
  flame_06: {
    title: "Hellfire Avatar",
    tagline: "Become the living embodiment of primeval wildfire.",
    combatEffect: "Unleashes a catastrophic inferno dealing 320% area damage with guaranteed Critical Strike.",
    lore: "The ultimate pinnacle of pyromancy recorded in the Monarch's forbidden scrolls. In ancient times, a single Ascendant assuming this avatar was said to have turned an entire legion of invading shadow beasts to ash.",
  },

  // TEMPEST PATH
  tempest_01: {
    title: "Gale Spark",
    tagline: "Accelerate neural synapses to the speed of lightning.",
    combatEffect: "Deals 105% rapid lightning damage and grants +5% Attack Speed.",
    lore: "Developed by scouts navigating the razor-thin winds of high-altitude rifts. By sharpening neural responsiveness, their movements became indistinguishable from crackling static electricity.",
  },
  tempest_02: {
    title: "Zephyr Clasp",
    tagline: "Disrupt enemy momentum with shearing crosswinds.",
    combatEffect: "Deals 125% wind damage and reduces the target's speed and evasion by 10%.",
    lore: "Ancient desert nomads used this technique to snatch arrows out of mid-air. Compressing airflow around the palms creates an invisible suction vortex that snatches away the enemy's balance.",
  },
  tempest_03: {
    title: "Wind Cutter",
    tagline: "Slice through physical space with razor-sharp sonic blades.",
    combatEffect: "Fires pressurized air blades dealing 155% slashing damage with +15% Critical Chance.",
    lore: "A legendary swordsman who lost his weapon in the Tower continued striking with bare hands—his velocity so extreme that compressed sonic shockwaves sliced granite pillars in half.",
  },
  tempest_04: {
    title: "Storm Vortex",
    tagline: "Summon a raging cyclone of cyclonic atmospheric fury.",
    combatEffect: "Draws all surrounding enemies into an electrical vortex, dealing 190% shock damage.",
    lore: "Chronicles of the Sky Citadel recount how masters of the Tempest would conjure roaring maelstroms around themselves to deflect artillery and shatter skyborne leviathans.",
  },
  tempest_05: {
    title: "Thunder Core",
    tagline: "Charge your nervous system with pure ionized plasma.",
    combatEffect: "Grants +20% Critical Damage and a 20% chance on hit to trigger Chain Lightning.",
    lore: "Synthesized from the heart of a fallen Thunder Dragon. The Ascendant's blood vessels glow with faint blue luminescence, crackling with perpetual electrical discharge.",
  },
  tempest_06: {
    title: "Tempest Sovereign",
    tagline: "Command the fury of the heavens itself.",
    combatEffect: "Calls down a devastating storm of celestial thunderbolts dealing 340% piercing damage.",
    lore: "The ancient title bestowed upon those who ascended the highest spire of the World Pillar. When a Tempest Sovereign takes the field, clouds gather instantly and lightning bends to their absolute will.",
  },

  // EARTH PATH
  earth_01: {
    title: "Stone Pebble",
    tagline: "Harden bone density to withstand crushing impacts.",
    combatEffect: "Deals 115% bludgeoning damage and increases Armor Defense by +5%.",
    lore: "The foundational discipline of the Stone Sentinels. By training against cascading boulders, practitioners calcified their skeletal framework into living obsidian.",
  },
  earth_02: {
    title: "Gaia Grasp",
    tagline: "Anchor your stance deep into the foundational bedrock.",
    combatEffect: "Deals 135% earth damage and grants complete immunity to Stagger for 3 turns.",
    lore: "Deep within the tectonic roots of the earth, ancient warriors learned to draw equilibrium directly from planetary gravity, becoming immovable monoliths against incoming titans.",
  },
  earth_03: {
    title: "Seismic Palm",
    tagline: "Rupture the ground with subterranean shockwaves.",
    combatEffect: "Strikes the ground, dealing 165% area damage and applying Stun for 1 turn.",
    lore: "When master brawlers strike with Seismic Palm, the kinetic resonance travels through the earth beneath enemy boots, shattering their footing and disorienting their equilibrium.",
  },
  earth_04: {
    title: "Tectonic Crush",
    tagline: "Crush the adversary between converging tectonic plates.",
    combatEffect: "Encloses the target in dense rock slabs dealing 210% devastating impact damage.",
    lore: "Inspired by the collapsing caverns of the Deep Gate. The surrounding rock answers the Ascendant's call, slamming shut like the jaws of a subterranean behemoth.",
  },
  earth_05: {
    title: "Obsidian Shell",
    tagline: "Coat your physique in an impenetrable crystalline carapace.",
    combatEffect: "Absorbs incoming damage up to 25% of Max HP and reflects 15% physical damage back.",
    lore: "Harvested from the volcanic mantle where magma meets abyssal ice. The resulting obsidian shell is virtually immune to blade cuts and magical erosion alike.",
  },
  earth_06: {
    title: "Titan Golem",
    tagline: "Summon the primordial colossal strength of the Earth Titan.",
    combatEffect: "Deals 350% colossal crushing damage and permanently increases Max HP by +10%.",
    lore: "An ancient primordial rite connecting the soul to the Mountain Titans of old. Upon activation, the ground shakes for miles and the Ascendant strikes with the mass of an entire continent.",
  },

  // TIDE PATH
  tide_01: {
    title: "Hydro Shard",
    tagline: "Condense atmospheric moisture into piercing crystalline darts.",
    combatEffect: "Deals 108% piercing water damage with a 10% chance to Slow enemy recovery.",
    lore: "Devised by coastal mystics who learned to weaponize morning mist. Even a droplet of water, when accelerated through refined mana channels, can penetrate thick hide like a steel bullet.",
  },
  tide_02: {
    title: "Ripple Touch",
    tagline: "Transmit fluid kinetic vibrations through solid armor.",
    combatEffect: "Deals 130% internal damage, completely ignoring flat physical armor shields.",
    lore: "Known as the 'Gentle Current'. The strike feels soft on the surface, but the fluid shockwave propagates directly into the target's internal organs, leaving external armor untouched.",
  },
  tide_03: {
    title: "Torrent Surge",
    tagline: "Release a surging flood wave that washes away enemy momentum.",
    combatEffect: "Deals 160% surging water damage and cleanses 1 negative debuff from yourself.",
    lore: "Emulates the unstoppable power of flash floods breaking through mountain dams. No physical barrier can withstand the continuous relentless kinetic weight of surging tides.",
  },
  tide_04: {
    title: "Abyss Clasp",
    tagline: "Drag your adversary into the crushing dark depths of the deep sea.",
    combatEffect: "Deals 205% abyssal damage and silences enemy active skills for 2 turns.",
    lore: "From the midnight trench of the Forgotten Ocean where sunlight never reaches. The chilling pressure of the abyss crushes the breath and vocal cords of all who dare resist.",
  },
  tide_05: {
    title: "Frozen Heart",
    tagline: "Subzero composure that accelerates health and mana regeneration.",
    combatEffect: "Grants +20% Recovery efficiency and slows enemy attack intervals by 15%.",
    lore: "A state of absolute mental stillness achieved through polar isolation. By lowering the body's internal entropy, cellular regeneration multiplies tenfold.",
  },
  tide_06: {
    title: "Leviathan Aspect",
    tagline: "Unleash the primordial sovereign of the deepest oceans.",
    combatEffect: "Summons a colossal abyssal wave dealing 330% tidal damage and healing 20% Max HP.",
    lore: "The legendary aspect of the ancient World Serpent Leviathan. Legends say that when the Leviathan stirs, whole islands submerge beneath tidal walls.",
  },

  // ASCENSION PATH
  asc_01: {
    title: "Void Spark",
    tagline: "Ignite a fragment of pure nothingness.",
    combatEffect: "Deals 120% true dimensional damage unaffected by elemental resistances.",
    lore: "Discovered by the first Ascendant who dared to gaze into the boundary between realities. A single spark from the void consumes light and matter alike.",
  },
  asc_02: {
    title: "Shadow Grasp",
    tagline: "Summon shadow tendrils from your own silhouette.",
    combatEffect: "Restrains the target for 1 turn while siphoning 10% of their offensive power.",
    lore: "The signature technique of the Shadow Monarch. Your own shadow ceases to be a passive silhouette, awakening as an obedient extension of your will.",
  },
  asc_03: {
    title: "Dimensional Palm",
    tagline: "Fold spatial dimensions to strike beyond visual sight.",
    combatEffect: "Deals 175% spatial damage with 100% accuracy, bypassing all enemy evasion.",
    lore: "By compressing the distance between palm and target into zero dimensions, the strike lands before the motion is even perceived by the naked eye.",
  },
  asc_04: {
    title: "Dark Singularity",
    tagline: "Create a miniature gravitational black hole.",
    combatEffect: "Collapses surrounding space dealing 225% void damage and pulling all targets inward.",
    lore: "A catastrophic application of Monarch energy that warps local space-time. The singularity pulls matter into its event horizon, crushing physical bonds at the subatomic level.",
  },
  asc_05: {
    title: "Sovereign Will",
    tagline: "Impose absolute commanding authority over the battlefield.",
    combatEffect: "Increases all primary attributes by +15% and grants 30% resistance to all debuffs.",
    lore: "The aura of a true Monarch. Weaker entities freeze in instinctive terror, while the Ascendant's mental clarity reaches absolute sovereign omniscience.",
  },
  asc_06: {
    title: "Monarch Incarnation",
    tagline: "Ascend beyond human limitation into the supreme Monarch form.",
    combatEffect: "Transforms into the supreme Shadow Monarch, dealing 400% ultimate void damage.",
    lore: "The final step of the Ascendant protocol. Transcending the physical vessel, the Ascendant commands the boundless legions of darkness and steps into legend as a true God of the Threshold.",
  },
};

export function getSkillLore(skillId: string, fallbackName?: string): SkillLoreEntry {
  const normalized = (skillId || "").toLowerCase().trim();
  if (SKILL_LORE_MAP[normalized]) {
    return SKILL_LORE_MAP[normalized];
  }

  // Check prefix or partial matches
  for (const [key, value] of Object.entries(SKILL_LORE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return {
    title: fallbackName || "Ascendant Technique",
    tagline: "A refined martial ability discovered within the Gate archives.",
    combatEffect: "Enhances physical resonance and deals heavy attribute-scaled damage.",
    lore: "Documented in the ancient records of the Ascendant Guild. Through relentless daily discipline and physical conditioning, this skill channels latent inner power into explosive combat potency.",
  };
}
