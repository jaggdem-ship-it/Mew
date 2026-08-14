export const ENEMIES = {
  // Level 1 - Blood Moor
  fallen: {
    key: "fallen",
    name: "Fallen One",
    hp: 20,
    damage: 5,
    speed: 60,
    xp: 3,
    size: 10,
    color: 0xcc4444,
    behavior: "swarm",
    level: 1
  },
  fallen_shaman: {
    key: "fallen_shaman",
    name: "Fallen Shaman",
    hp: 35,
    damage: 8,
    speed: 40,
    xp: 8,
    size: 12,
    color: 0xff6600,
    behavior: "ranged",
    projectile: "firebolt_small",
    level: 1
  },
  carver: {
    key: "carver",
    name: "Carver",
    hp: 30,
    damage: 7,
    speed: 85,
    xp: 5,
    size: 11,
    color: 0xaa2222,
    behavior: "chase",
    level: 1
  },
  // Level 2 - Catacombs
  zombie: {
    key: "zombie",
    name: "Hungry Dead",
    hp: 60,
    damage: 10,
    speed: 25,
    xp: 6,
    size: 14,
    color: 0x556b2f,
    behavior: "slow_chase",
    level: 2
  },
  skeleton_warrior: {
    key: "skeleton_warrior",
    name: "Skeleton Warrior",
    hp: 40,
    damage: 8,
    speed: 55,
    xp: 5,
    size: 12,
    color: 0xdddddd,
    behavior: "chase",
    level: 2
  },
  vile_mother: {
    key: "vile_mother",
    name: "Vile Mother",
    hp: 80,
    damage: 6,
    speed: 30,
    xp: 15,
    size: 16,
    color: 0x8b008b,
    behavior: "spawner",
    spawnType: "maggot",
    spawnInterval: 4000,
    level: 2
  },
  maggot: {
    key: "maggot",
    name: "Maggot",
    hp: 10,
    damage: 4,
    speed: 70,
    xp: 2,
    size: 8,
    color: 0x90ee90,
    behavior: "swarm",
    level: 2
  },
  // Level 3 - Frozen Wastes
  goatman: {
    key: "goatman",
    name: "Khazra",
    hp: 50,
    damage: 12,
    speed: 75,
    xp: 8,
    size: 13,
    color: 0x8b4513,
    behavior: "chase",
    level: 3
  },
  blood_hawk: {
    key: "blood_hawk",
    name: "Blood Hawk",
    hp: 25,
    damage: 7,
    speed: 95,
    xp: 6,
    size: 10,
    color: 0xff4444,
    behavior: "strafe",
    level: 3
  },
  frost_zombie: {
    key: "frost_zombie",
    name: "Frost Zombie",
    hp: 55,
    damage: 9,
    speed: 30,
    xp: 7,
    size: 14,
    color: 0x87ceeb,
    behavior: "slow_chase",
    chillOnHit: true,
    level: 3
  },
  frost_maggot: {
    key: "frost_maggot",
    name: "Frost Maggot",
    hp: 15,
    damage: 5,
    speed: 65,
    xp: 3,
    size: 9,
    color: 0xb0e0e6,
    behavior: "swarm",
    level: 3
  },
  // Level 4 - Burning Temple
  demon_trooper: {
    key: "demon_trooper",
    name: "Demon Trooper",
    hp: 80,
    damage: 14,
    speed: 50,
    xp: 12,
    size: 15,
    color: 0x8b0000,
    behavior: "chase",
    level: 4
  },
  wraith: {
    key: "wraith",
    name: "Wraith",
    hp: 35,
    damage: 10,
    speed: 85,
    xp: 10,
    size: 12,
    color: 0x9370db,
    behavior: "phase",
    phaseInterval: 2000,
    level: 4
  },
  council_member: {
    key: "council_member",
    name: "Council Member",
    hp: 60,
    damage: 12,
    speed: 40,
    xp: 15,
    size: 14,
    color: 0xffd700,
    behavior: "ranged",
    projectile: "lightning_bolt",
    level: 4
  },
  // Level 5 - Chaos Sanctuary
  hell_bovine: {
    key: "hell_bovine",
    name: "Hell Bovine",
    hp: 100,
    damage: 18,
    speed: 90,
    xp: 25,
    size: 16,
    color: 0xffffff,
    behavior: "charge",
    level: 5
  },
  // Elite affixes
  elite_affixes: ["extra_strong", "fast", "lightning_enchanted"]
};
