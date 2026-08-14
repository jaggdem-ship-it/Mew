export const LEVELS = [
  {
    id: 1,
    name: "The Blood Moor",
    bossKey: "blood_raven",
    duration: 180, // seconds before boss gate opens
    bgColor: 0x2d1b1b,
    groundColor: 0x3d2b2b,
    wallColor: 0x1a0f0f,
    hazard: {
      type: "tall_grass",
      description: "Tall grass hides enemies until close",
      spawnRate: 8000,
      radius: 40,
      color: 0x4a7c59
    },
    enemyRoster: ["fallen", "fallen_shaman", "carver"],
    spawnCurve: [
      { time: 0, enemies: ["fallen"], rate: 2000, max: 15 },
      { time: 30, enemies: ["fallen", "fallen_shaman"], rate: 1800, max: 20 },
      { time: 60, enemies: ["fallen", "fallen_shaman", "carver"], rate: 1500, max: 25 },
      { time: 90, enemies: ["carver"], rate: 1000, max: 10, event: "champion_carver_pack" },
      { time: 120, enemies: ["fallen", "fallen_shaman", "carver"], rate: 1200, max: 30 }
    ],
    championEvent: {
      time: 90,
      type: "carver_warband",
      count: 5,
      affix: "fast"
    },
    bossGateTime: 180,
    ambience: "windy_dusk",
    bpm: 100,
    scale: [0, 2, 4, 5, 7, 9, 11]
  },
  {
    id: 2,
    name: "The Hollow Catacombs",
    bossKey: "andariel",
    duration: 240,
    bgColor: 0x1a1a2e,
    groundColor: 0x2d2d3d,
    wallColor: 0x0f0f1a,
    hazard: {
      type: "poison_gas",
      description: "Poison gas blooms from floor cracks",
      spawnRate: 6000,
      radius: 50,
      duration: 4000,
      damage: 3,
      color: 0x32cd32,
      telegraphTime: 1500
    },
    enemyRoster: ["zombie", "skeleton_warrior", "vile_mother"],
    spawnCurve: [
      { time: 0, enemies: ["zombie"], rate: 2500, max: 12 },
      { time: 30, enemies: ["zombie", "skeleton_warrior"], rate: 2200, max: 18 },
      { time: 60, enemies: ["zombie", "skeleton_warrior", "vile_mother"], rate: 2000, max: 22 },
      { time: 120, enemies: ["vile_mother"], rate: 1500, max: 6, event: "vile_mother_nest" },
      { time: 180, enemies: ["zombie", "skeleton_warrior", "vile_mother"], rate: 1800, max: 25 }
    ],
    championEvent: {
      time: 120,
      type: "vile_mother_nest",
      count: 4,
      affix: "extra_strong"
    },
    bossGateTime: 240,
    ambience: "dripping_crypt",
    bpm: 90,
    scale: [0, 2, 3, 5, 7, 8, 10]
  },
  {
    id: 3,
    name: "The Frozen Wastes",
    bossKey: "duriel",
    duration: 240,
    bgColor: 0x1b263b,
    groundColor: 0x2d3d5a,
    wallColor: 0x0d1b2a,
    hazard: {
      type: "frost_aura_zone",
      description: "Ambient frost zones slow the player",
      spawnRate: 5000,
      radius: 60,
      slowFactor: 0.6,
      color: 0x87ceeb
    },
    enemyRoster: ["goatman", "blood_hawk", "frost_zombie"],
    spawnCurve: [
      { time: 0, enemies: ["goatman"], rate: 2000, max: 15 },
      { time: 30, enemies: ["goatman", "blood_hawk"], rate: 1800, max: 22 },
      { time: 60, enemies: ["goatman", "blood_hawk", "frost_zombie"], rate: 1600, max: 28 },
      { time: 100, enemies: ["goatman"], rate: 1200, max: 12, event: "goatman_warband" },
      { time: 150, enemies: ["goatman", "blood_hawk", "frost_zombie"], rate: 1400, max: 32 }
    ],
    championEvent: {
      time: 100,
      type: "goatman_warband",
      count: 5,
      affix: "extra_strong"
    },
    bossGateTime: 240,
    ambience: "wind_howl",
    bpm: 110,
    scale: [0, 2, 3, 5, 7, 9, 10]
  },
  {
    id: 4,
    name: "The Burning Temple",
    bossKey: "mephisto",
    duration: 300,
    bgColor: 0x1a0a0a,
    groundColor: 0x2d1a1a,
    wallColor: 0x0f0505,
    hazard: {
      type: "lava_crack",
      description: "Lava cracks erupt in telegraphed lines",
      spawnRate: 5000,
      width: 30,
      length: 120,
      telegraphTime: 2000,
      damage: 8,
      color: 0xff4500
    },
    enemyRoster: ["demon_trooper", "wraith", "council_member"],
    spawnCurve: [
      { time: 0, enemies: ["demon_trooper"], rate: 2200, max: 12 },
      { time: 30, enemies: ["demon_trooper", "wraith"], rate: 2000, max: 18 },
      { time: 60, enemies: ["demon_trooper", "wraith", "council_member"], rate: 1800, max: 22 },
      { time: 90, enemies: ["council_member"], rate: 1500, max: 6, event: "council_coven" },
      { time: 120, enemies: ["demon_trooper", "wraith", "council_member"], rate: 1600, max: 25 },
      { time: 180, enemies: ["demon_trooper", "wraith"], rate: 1400, max: 20, event: "champion_pack" }
    ],
    championEvent: {
      time: 90,
      type: "council_coven",
      count: 4,
      affix: "lightning_enchanted"
    },
    bossGateTime: 300,
    ambience: "low_rumble",
    bpm: 120,
    scale: [0, 1, 3, 5, 6, 8, 10]
  },
  {
    id: 5,
    name: "The Chaos Sanctuary",
    bossKey: "diablo",
    duration: 90,
    bgColor: 0x0a0a0a,
    groundColor: 0x1a0a0a,
    wallColor: 0x050505,
    hazard: {
      type: "closing_circle",
      description: "Outer ring periodically ignites, pushing player inward",
      startTime: 30,
      interval: 15000,
      shrinkAmount: 20,
      minRadius: 80,
      color: 0xff0000
    },
    enemyRoster: ["fallen", "skeleton_warrior", "goatman", "demon_trooper", "hell_bovine"],
    spawnCurve: [
      { time: 0, enemies: ["fallen", "skeleton_warrior"], rate: 2000, max: 15 },
      { time: 30, enemies: ["goatman", "demon_trooper"], rate: 1800, max: 18 },
      { time: 60, enemies: ["fallen", "skeleton_warrior", "goatman", "demon_trooper", "hell_bovine"], rate: 1600, max: 20 }
    ],
    championEvent: null,
    bossGateTime: 90,
    ambience: "chaos_finale",
    bpm: 130,
    scale: [0, 2, 4, 5, 7, 9, 11]
  }
];
