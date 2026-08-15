import { MuscleGroupKey } from "../types/muscleRecovery";

export interface MuscleTrainingInfo {
  key: MuscleGroupKey;
  name: string;
  anatomicalName: string;
  category: string;
  primaryStat: string;
  statBonus: string;
  recommendedExercises: Array<{
    name: string;
    type: "Compound" | "Isolation" | "Bodyweight";
    setsReps: string;
    benefit: string;
  }>;
  actionableCues: string[];
  recoveryLore: string;
}

export const MUSCLE_TRAINING_GUIDE: Record<MuscleGroupKey, MuscleTrainingInfo> = {
  CHEST: {
    key: "CHEST",
    name: "Chest",
    anatomicalName: "Pectoralis Major & Pectoralis Minor",
    category: "Upper Push",
    primaryStat: "Strength (STR)",
    statBonus: "+STR and +END scaling",
    recommendedExercises: [
      { name: "Barbell Flat Bench Press", type: "Compound", setsReps: "3-5 sets of 5-8 reps", benefit: "Maximal mechanical tension & upper body pushing strength" },
      { name: "Incline Dumbbell Press", type: "Compound", setsReps: "3-4 sets of 8-12 reps", benefit: "Clavicular head (upper chest) hypertrophy" },
      { name: "Weighted Chest Dips", type: "Compound", setsReps: "3 sets of 6-10 reps", benefit: "Lower chest flare & tricep lockout power" },
      { name: "Cable Crossover / Pec Deck", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Deep peak horizontal adduction contraction" },
      { name: "Deficit Push-ups", type: "Bodyweight", setsReps: "3 sets to near failure", benefit: "Endurance & scapular mobility finisher" }
    ],
    actionableCues: [
      "Retract and depress your scapulae onto the bench before initiating the unrack",
      "Lower the barbell to lower sternum under control with a 2-second eccentric phase",
      "Flare elbows at a safe 45-degree angle to avoid excessive shoulder impingement"
    ],
    recoveryLore: "Heavy barbell benching creates micro-tears across dense myofibrillar fibers. Requires 48-72h for optimal protein synthesis."
  },
  FRONT_DELTS: {
    key: "FRONT_DELTS",
    name: "Front Deltoids",
    anatomicalName: "Anterior Deltoid",
    category: "Upper Push",
    primaryStat: "Strength (STR) & Focus (FOC)",
    statBonus: "+STR and +FOC scaling",
    recommendedExercises: [
      { name: "Standing Overhead Barbell Press (OHP)", type: "Compound", setsReps: "3-5 sets of 5-8 reps", benefit: "Vertical pressing power and core stabilization" },
      { name: "Seated Dumbbell Shoulder Press", type: "Compound", setsReps: "3-4 sets of 8-10 reps", benefit: "Unilateral anterior deltoid development" },
      { name: "Incline Bench Front Dumbbell Raises", type: "Isolation", setsReps: "3 sets of 10-12 reps", benefit: "Strict isolated anterior flexion" },
      { name: "Pike Push-ups / Handstand Push-ups", type: "Bodyweight", setsReps: "3 sets of 6-10 reps", benefit: "Kinetic bodyweight pressing balance" }
    ],
    actionableCues: [
      "Squeeze glutes and brace core during overhead pressing to avoid lumbar hyperextension",
      "Press the bar directly in a straight vertical path over the mid-foot",
      "Avoid excessive front raise volume if you already bench press heavily"
    ],
    recoveryLore: "The vanguard armor of the shoulder joint. Stabilizes overhead weapon thrusts and protects the rotator cuff."
  },
  SHOULDERS: {
    key: "SHOULDERS",
    name: "Side Shoulders (Lateral Delts)",
    anatomicalName: "Lateral Deltoid",
    category: "Upper Push / Isolation",
    primaryStat: "Endurance (END) & Discipline (DIS)",
    statBonus: "+END and +DIS scaling",
    recommendedExercises: [
      { name: "Dumbbell Lateral Raises", type: "Isolation", setsReps: "4 sets of 12-15 reps", benefit: "V-taper width and rounded shoulder caps" },
      { name: "Cable Lateral Raises (Behind Back)", type: "Isolation", setsReps: "3-4 sets of 12-15 reps", benefit: "Constant tension across the entire range of motion" },
      { name: "Dumbbell Arnold Press", type: "Compound", setsReps: "3 sets of 8-12 reps", benefit: "Rotational deltoid fiber recruitment" },
      { name: "Leaning Single-Arm Cable Raises", type: "Isolation", setsReps: "3 sets of 15 reps", benefit: "Targeted stretch-mediated hypertrophy" }
    ],
    actionableCues: [
      "Lead with your elbows and maintain a slight forward lean in the scapular plane",
      "Avoid using hip momentum; pause for 1 second at parallel height",
      "Higher frequency (2-3x per week) with lighter weights accelerates lateral delt growth"
    ],
    recoveryLore: "Composed predominantly of fatigue-resistant Type I and IIa fibers that thrive on high rep volume."
  },
  REAR_DELTS: {
    key: "REAR_DELTS",
    name: "Rear Deltoids",
    anatomicalName: "Posterior Deltoid",
    category: "Upper Pull",
    primaryStat: "Discipline (DIS) & Recovery (REC)",
    statBonus: "+DIS and +REC scaling",
    recommendedExercises: [
      { name: "Face Pulls with External Rotation", type: "Isolation", setsReps: "4 sets of 15-20 reps", benefit: "Rotator cuff health & posterior delt thickness" },
      { name: "Bent-Over Dumbbell Rear Delt Flyes", type: "Isolation", setsReps: "3-4 sets of 12-15 reps", benefit: "Direct horizontal abduction isolation" },
      { name: "Reverse Pec Deck Flyes", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Strict stabilized rear delt contraction" },
      { name: "Incline Bench Prone Y-Raises", type: "Bodyweight", setsReps: "3 sets of 12 reps", benefit: "Lower trap & posterior chain integration" }
    ],
    actionableCues: [
      "Keep palms facing inward or down and focus on pushing elbows outward",
      "Pull towards the eyes/forehead on face pulls to engage external rotators",
      "Essential for counter-balancing heavy pressing and maintaining upright posture"
    ],
    recoveryLore: "The unsung stabilizer of the hunter's upper back. Restores muscular symmetry and prevents shoulder impingement."
  },
  TRAPS: {
    key: "TRAPS",
    name: "Trapezius (Traps)",
    anatomicalName: "Superior, Middle & Inferior Trapezius",
    category: "Upper Pull / Back",
    primaryStat: "Strength (STR) & Power",
    statBonus: "+STR and +CNS scaling",
    recommendedExercises: [
      { name: "Barbell Power Shrugs", type: "Compound", setsReps: "4 sets of 8-12 reps", benefit: "Upper trap mass and heavy spinal loading tolerance" },
      { name: "Heavy Dumbbell Farmer's Walks", type: "Compound", setsReps: "3 rounds of 40m", benefit: "Isometric trap endurance and crushing grip strength" },
      { name: "Snatch-Grip Barbell High Pulls", type: "Compound", setsReps: "4 sets of 5-6 reps", benefit: "Explosive triple extension and upper back power" },
      { name: "Kelso Shrugs on Incline Bench", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Mid and lower trapezius retraction" }
    ],
    actionableCues: [
      "Pause and squeeze at the peak of the shrug for 2 full seconds",
      "Avoid rolling shoulders in circles to prevent unnecessary cervical friction",
      "Farmer's carries develop diamond-hard structural integrity for heavy armor"
    ],
    recoveryLore: "Carries the literal weight of heavy armor. Traps respond powerfully to heavy loaded carries and explosive pulls."
  },
  LATS: {
    key: "LATS",
    name: "Lats (Upper & Mid Back)",
    anatomicalName: "Latissimus Dorsi & Rhomboids",
    category: "Upper Pull",
    primaryStat: "Strength (STR) & Consistency (CNS)",
    statBonus: "+STR and +CNS scaling",
    recommendedExercises: [
      { name: "Weighted Pull-ups / Chin-ups", type: "Compound", setsReps: "3-4 sets of 5-8 reps", benefit: "Gold standard for vertical pulling power and back width" },
      { name: "Barbell Bent-Over Rows", type: "Compound", setsReps: "4 sets of 6-10 reps", benefit: "Thick back density and spinal erector isometric bracing" },
      { name: "Neutral-Grip Lat Pulldowns", type: "Compound", setsReps: "3-4 sets of 8-12 reps", benefit: "Full stretch-mediated lat elongation" },
      { name: "Chest-Supported T-Bar Rows", type: "Compound", setsReps: "3 sets of 8-12 reps", benefit: "Heavy mid-back rowing without lower back fatigue" },
      { name: "Straight-Arm Cable Pullovers", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Isolated lat sweeps without forearm/bicep fatigue" }
    ],
    actionableCues: [
      "Initiate every pull by driving your elbows down toward your back pockets",
      "Achieve a full dead-hang stretch at the bottom of pull-ups to maximize range of motion",
      "Maintain a proud chest and avoid rounding the upper thoracic spine"
    ],
    recoveryLore: "The wings of an Ascendant sovereign. Transfers force between the lower body and upper limbs during high-tier battles."
  },
  LOWER_BACK: {
    key: "LOWER_BACK",
    name: "Lower Back & Spinal Erectors",
    anatomicalName: "Erector Spinae & Quadratus Lumborum",
    category: "Core Posterior",
    primaryStat: "Endurance (END) & Discipline (DIS)",
    statBonus: "+END and +DIS scaling",
    recommendedExercises: [
      { name: "Conventional Barbell Deadlifts", type: "Compound", setsReps: "3-5 sets of 3-5 reps", benefit: "Full-body posterior chain dominance and spinal bracing" },
      { name: "Hyperextensions / Back Extensions", type: "Compound", setsReps: "3 sets of 12-15 reps", benefit: "Isolated spinal erector endurance and glute synergy" },
      { name: "Barbell Good Mornings", type: "Compound", setsReps: "3 sets of 8-10 reps", benefit: "Hip hinge mastery under controlled barbell load" },
      { name: "Bird-Dog Isometric Holds", type: "Bodyweight", setsReps: "3 sets of 10 per side", benefit: "Lumbar stabilization and deep multifidus recruitment" }
    ],
    actionableCues: [
      "Take a deep diaphragmatic breath and brace 360-degrees into your belt before lifting",
      "Keep the barbell path tight against your shins and thighs throughout the deadlift",
      "Never round your lumbar spine under heavy axial loading"
    ],
    recoveryLore: "The structural pillar of the human chassis. Requires 72h recovery after maximal deadlift attempts."
  },
  BICEPS: {
    key: "BICEPS",
    name: "Biceps & Brachialis",
    anatomicalName: "Biceps Brachii & Brachialis",
    category: "Arms / Upper Pull",
    primaryStat: "Strength (STR) & Focus (FOC)",
    statBonus: "+STR and +FOC scaling",
    recommendedExercises: [
      { name: "Standing Barbell Bicep Curls", type: "Compound", setsReps: "3-4 sets of 8-10 reps", benefit: "Maximal bicep overloading and supination power" },
      { name: "Incline Dumbbell Curls", type: "Isolation", setsReps: "3 sets of 10-12 reps", benefit: "Long head stretch-mediated hypertrophy" },
      { name: "Dumbbell Hammer Curls", type: "Isolation", setsReps: "3-4 sets of 8-12 reps", benefit: "Brachialis and forearms thickness for blade wielding" },
      { name: "EZ-Bar Preacher Curls", type: "Isolation", setsReps: "3 sets of 10-12 reps", benefit: "Strict isolation eliminating all body momentum" }
    ],
    actionableCues: [
      "Keep elbows pinned to your sides and supinate wrists hard at the top of the curl",
      "Control the lowering eccentric phase for a full 2-3 seconds per repetition",
      "Incline curls place the long head under maximum stretch for accelerated growth"
    ],
    recoveryLore: "Directly powers one-handed weapon swings and grapple maneuvers. Recovers relatively quickly within 36-48h."
  },
  TRICEPS: {
    key: "TRICEPS",
    name: "Triceps",
    anatomicalName: "Triceps Brachii (Lateral, Long & Medial Heads)",
    category: "Arms / Upper Push",
    primaryStat: "Strength (STR) & Endurance (END)",
    statBonus: "+STR and +END scaling",
    recommendedExercises: [
      { name: "Close-Grip Barbell Bench Press", type: "Compound", setsReps: "3-4 sets of 6-8 reps", benefit: "Heavy compound tricep overload and lockout force" },
      { name: "Overhead Rope Tricep Extensions", type: "Isolation", setsReps: "3-4 sets of 10-12 reps", benefit: "Long head deep stretch and overhead shoulder mobility" },
      { name: "EZ-Bar Skull Crushers (Lying Extensions)", type: "Isolation", setsReps: "3 sets of 8-12 reps", benefit: "Dense medial and lateral head recruitment" },
      { name: "Cable V-Bar Pushdowns", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Strict continuous tension and peak contraction" }
    ],
    actionableCues: [
      "Keep elbows tucked and avoid letting them flare excessively outward",
      "Overhead extensions are mandatory for fully developing the massive long head",
      "Lock out fully at the bottom of cable pushdowns for maximal peak contraction"
    ],
    recoveryLore: "Comprises 60% of upper arm volume and provides the final punch in all pressing and strike mechanics."
  },
  FOREARMS: {
    key: "FOREARMS",
    name: "Forearms & Grip",
    anatomicalName: "Brachioradialis, Flexor & Extensor Carpi",
    category: "Arms / Grip",
    primaryStat: "Discipline (DIS) & Strength (STR)",
    statBonus: "+DIS and +STR scaling",
    recommendedExercises: [
      { name: "Dead Hangs from Pull-Up Bar", type: "Bodyweight", setsReps: "3 sets for max time (45-90s)", benefit: "Crushing grip endurance and shoulder decompression" },
      { name: "Reverse EZ-Bar Forearm Curls", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Brachioradialis and forearm extensor development" },
      { name: "Dumbbell Wrist Curls (Palms Up & Down)", type: "Isolation", setsReps: "3 sets of 15-20 reps", benefit: "Wrist flexor/extensor tendon resilience" },
      { name: "Heavy Hex Dumbbell Pinch Carries", type: "Compound", setsReps: "3 rounds of 30 seconds", benefit: "Pinch grip strength for holding legendary relics" }
    ],
    actionableCues: [
      "Incorporate dead hangs into daily routines to decompress the spine and build iron grip",
      "Avoid relying exclusively on lifting straps for warm-up sets to build natural grip",
      "High rep ranges (15-25) work best for dense forearm tendon adaptation"
    ],
    recoveryLore: "The conduit of physical intent. An iron grip allows channeling full muscular power into weapons without slippage."
  },
  ABS: {
    key: "ABS",
    name: "Abdominals (Core)",
    anatomicalName: "Rectus Abdominis & Transverse Abdominis",
    category: "Core Anterior",
    primaryStat: "Discipline (DIS) & Consistency (CNS)",
    statBonus: "+DIS and +CNS scaling",
    recommendedExercises: [
      { name: "Hanging Leg Raises / Toes-to-Bar", type: "Bodyweight", setsReps: "3-4 sets of 10-15 reps", benefit: "Lower abdominal recruitment and hip flexor control" },
      { name: "Ab Wheel Rollouts", type: "Bodyweight", setsReps: "3-4 sets of 8-12 reps", benefit: "Anti-extension core strength and transverse bracing" },
      { name: "Kneeling Cable Crunches", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Progressively overloaded rectus abdominis flexion" },
      { name: "Weighted Plank Holds", type: "Bodyweight", setsReps: "3 sets of 60 seconds", benefit: "Isometric anti-extension core endurance" }
    ],
    actionableCues: [
      "Tilt the pelvis backward and round the spine during crunches to engage abs rather than hip flexors",
      "Exhale all air at the peak of contraction for maximal intra-abdominal compression",
      "Abs are revealed through caloric balance and built through progressive mechanical load"
    ],
    recoveryLore: "The central nexus of physical stability. Connects upper and lower kinetic chains for devastating combat strikes."
  },
  OBLIQUES: {
    key: "OBLIQUES",
    name: "Obliques & Lateral Core",
    anatomicalName: "External & Internal Obliques",
    category: "Core Lateral",
    primaryStat: "Focus (FOC) & Endurance (END)",
    statBonus: "+FOC and +END scaling",
    recommendedExercises: [
      { name: "Standing Cable Woodchoppers (High-to-Low)", type: "Compound", setsReps: "3 sets of 12 per side", benefit: "Rotational torque and dynamic athletic power" },
      { name: "Hanging Windshield Wipers", type: "Bodyweight", setsReps: "3 sets of 8-10 reps per side", benefit: "High-tier rotational core control" },
      { name: "Suitcase Carries (Single-Arm Walk)", type: "Compound", setsReps: "3 rounds of 30m per side", benefit: "Anti-lateral flexion and spinal stabilization" },
      { name: "Side Plank with Hip Dips", type: "Bodyweight", setsReps: "3 sets of 15 per side", benefit: "Lateral core endurance and quadratus lumborum health" }
    ],
    actionableCues: [
      "Initiate rotations from the core rather than yanking with arms or shoulders",
      "Suitcase carries force obliques to fight asymmetric gravity without twisting",
      "Essential for explosive rotational striking and agile evasion in combat"
    ],
    recoveryLore: "Ties the ribcage to the pelvis like steel armor cables. Shields internal organs against heavy impact."
  },
  QUADS: {
    key: "QUADS",
    name: "Quadriceps (Front Thighs)",
    anatomicalName: "Rectus Femoris, Vastus Lateralis, Medialis & Intermedius",
    category: "Legs",
    primaryStat: "Strength (STR) & Endurance (END)",
    statBonus: "+STR and +END scaling",
    recommendedExercises: [
      { name: "Barbell Back Squats (High/Low Bar)", type: "Compound", setsReps: "3-5 sets of 5-8 reps", benefit: "The king of lower body compound strength and quad mass" },
      { name: "Barbell Front Squats", type: "Compound", setsReps: "3-4 sets of 6-8 reps", benefit: "Strict upright quad emphasis and upper back posture" },
      { name: "Bulgarian Split Squats (Dumbbell)", type: "Compound", setsReps: "3 sets of 8-10 per leg", benefit: "Unilateral leg power, balance, and vastus medialis tear-drop" },
      { name: "Leg Press (Close & Low Stance)", type: "Compound", setsReps: "3-4 sets of 10-12 reps", benefit: "Heavy quad overloading with zero spinal axial fatigue" },
      { name: "Leg Extensions", type: "Isolation", setsReps: "3 sets of 12-15 reps", benefit: "Isolated peak quad contraction and rectus femoris stretch" }
    ],
    actionableCues: [
      "Drive knees out in line with toes and achieve depth at or below parallel",
      "Keep torso upright during front squats and drive weight through the mid-foot",
      "Control the descent on Bulgarian split squats to build iron knee stability"
    ],
    recoveryLore: "The hydraulic pistons of human movement. Quad recovery requires high protein intake and 48-72h of restoration."
  },
  HAMSTRINGS: {
    key: "HAMSTRINGS",
    name: "Hamstrings (Back Thighs)",
    anatomicalName: "Biceps Femoris, Semitendinosus & Semimembranosus",
    category: "Legs Posterior",
    primaryStat: "Strength (STR) & Recovery (REC)",
    statBonus: "+STR and +REC scaling",
    recommendedExercises: [
      { name: "Romanian Deadlifts (RDLs)", type: "Compound", setsReps: "3-4 sets of 6-10 reps", benefit: "Extreme stretch-mediated hamstring hypertrophy" },
      { name: "Lying or Seated Leg Curls", type: "Isolation", setsReps: "3-4 sets of 10-12 reps", benefit: "Knee flexion isolation and distal tendon strength" },
      { name: "Glute-Ham Raises (GHR)", type: "Bodyweight", setsReps: "3 sets of 6-10 reps", benefit: "Eccentric hamstring strength for sprint deceleration" },
      { name: "Single-Leg Dumbbell RDLs", type: "Compound", setsReps: "3 sets of 8-10 per leg", benefit: "Unilateral hip hinge balance and stabilizer recruitment" }
    ],
    actionableCues: [
      "Push hips far back like closing a door behind you with your glutes",
      "Maintain a soft knee bend and stop descending once hips stop moving backward",
      "Feel the deep stretch in your hamstrings before driving hips forward"
    ],
    recoveryLore: "Powers rapid sprint deceleration and jumping springiness. Susceptible to fatigue if overloaded without sufficient sleep."
  },
  GLUTES: {
    key: "GLUTES",
    name: "Glutes",
    anatomicalName: "Gluteus Maximus, Medius & Minimus",
    category: "Legs Posterior",
    primaryStat: "Strength (STR) & Power",
    statBonus: "+STR and +CNS scaling",
    recommendedExercises: [
      { name: "Barbell Hip Thrusts", type: "Compound", setsReps: "3-4 sets of 8-12 reps", benefit: "Maximal horizontal hip extension and glute peak tension" },
      { name: "Sumo Deadlifts", type: "Compound", setsReps: "3-4 sets of 5-8 reps", benefit: "Wide-stance glute and adductor recruitment" },
      { name: "Walking Dumbbell Lunges", type: "Compound", setsReps: "3 sets of 20 total strides", benefit: "Dynamic glute stretch and unilateral conditioning" },
      { name: "Standing Cable Glute Kickbacks", type: "Isolation", setsReps: "3 sets of 12-15 per leg", benefit: "Direct gluteus maximus peak contraction" }
    ],
    actionableCues: [
      "Tuck your chin and maintain a neutral spine at the top of the hip thrust",
      "Squeeze glutes hard at the apex for 1-2 seconds of maximal contraction",
      "The largest and most powerful muscle group in the human body"
    ],
    recoveryLore: "The primary engine of kinetic locomotion. Transmits sovereign power through the hips into every physical movement."
  },
  CALVES: {
    key: "CALVES",
    name: "Calves",
    anatomicalName: "Gastrocnemius & Soleus",
    category: "Legs Lower",
    primaryStat: "Endurance (END) & Consistency (CNS)",
    statBonus: "+END and +CNS scaling",
    recommendedExercises: [
      { name: "Standing Barbell Calf Raises", type: "Isolation", setsReps: "4 sets of 12-15 reps", benefit: "Gastrocnemius (straight leg) diamond diamond thickness" },
      { name: "Seated Machine Calf Raises", type: "Isolation", setsReps: "3-4 sets of 15-20 reps", benefit: "Soleus (bent knee) deep muscle hypertrophy" },
      { name: "Donkey Calf Raises / Leg Press Calf Raises", type: "Isolation", setsReps: "3 sets of 15 reps", benefit: "Deep stretch at the bottom of the ankle range" },
      { name: "Jump Rope / Double Unders", type: "Bodyweight", setsReps: "3 rounds of 2 minutes", benefit: "Achilles tendon elasticity and cardiovascular stamina" }
    ],
    actionableCues: [
      "Pause for a full 2-second stretch at the bottom of each rep to eliminate Achilles bounce",
      "Explode to full plantarflexion on your big toes and hold the contraction for 1 second",
      "Daily step volume and high training frequency (3-4x weekly) unlocks calf growth"
    ],
    recoveryLore: "Endures hundreds of thousands of lifetime steps. Requires deep stretches and full pauses to overcome elastic rebound."
  }
};
