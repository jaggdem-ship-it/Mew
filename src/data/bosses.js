export const BOSSES = {
  blood_raven: {
    key: "blood_raven",
    name: "Blood Raven",
    title: "The Fallen Rogue",
    hp: 400,
    damage: 12,
    speed: 70,
    size: 20,
    color: 0xff0000,
    phases: [
      {
        hpThreshold: 1.0,
        attacks: ["arrow_volley", "skeleton_summon"],
        movePattern: "strafe_edge"
      },
      {
        hpThreshold: 0.5,
        attacks: ["arrow_volley", "skeleton_summon", "charge"],
        movePattern: "strafe_edge"
      }
    ],
    attackCooldown: 2000,
    summonCount: 3,
    xp: 100,
    level: 1
  },
  andariel: {
    key: "andariel",
    name: "Andariel",
    title: "Maiden of Anguish",
    hp: 800,
    damage: 15,
    speed: 55,
    size: 24,
    color: 0x9932cc,
    phases: [
      {
        hpThreshold: 1.0,
        attacks: ["poison_spray", "dash"],
        movePattern: "chase"
      },
      {
        hpThreshold: 0.6,
        attacks: ["poison_spray", "dash", "summon_vile_spawn"],
        movePattern: "chase"
      },
      {
        hpThreshold: 0.3,
        attacks: ["poison_spray", "dash", "summon_vile_spawn", "poison_pool"],
        movePattern: "chase"
      }
    ],
    attackCooldown: 1800,
    xp: 200,
    level: 2
  },
  duriel: {
    key: "duriel",
    name: "Duriel",
    title: "Lord of Pain",
    hp: 1200,
    damage: 18,
    speed: 50,
    size: 26,
    color: 0x00bfff,
    phases: [
      {
        hpThreshold: 1.0,
        attacks: ["frost_aura", "charge"],
        movePattern: "chase"
      },
      {
        hpThreshold: 0.5,
        attacks: ["frost_aura", "charge", "summon_frost_maggots"],
        movePattern: "chase"
      }
    ],
    attackCooldown: 2000,
    auraRadius: 80,
    auraSlow: 0.5,
    xp: 350,
    level: 3
  },
  mephisto: {
    key: "mephisto",
    name: "Mephisto",
    title: "Lord of Hatred",
    hp: 1500,
    damage: 20,
    speed: 45,
    size: 24,
    color: 0xff4500,
    phases: [
      {
        hpThreshold: 1.0,
        attacks: ["teleport", "lightning_orb"],
        movePattern: "teleport"
      },
      {
        hpThreshold: 0.6,
        attacks: ["teleport", "lightning_orb", "ring_of_bolts"],
        movePattern: "teleport"
      },
      {
        hpThreshold: 0.3,
        attacks: ["teleport", "lightning_orb", "ring_of_bolts", "summon_council"],
        movePattern: "teleport"
      }
    ],
    attackCooldown: 2200,
    xp: 500,
    level: 4
  },
  diablo: {
    key: "diablo",
    name: "Diablo",
    title: "Lord of Terror",
    hp: 2500,
    damage: 25,
    speed: 60,
    size: 32,
    color: 0xff0000,
    phases: [
      {
        hpThreshold: 1.0,
        name: "Phase 1: Fire Nova",
        attacks: ["fire_nova"],
        movePattern: "chase"
      },
      {
        hpThreshold: 0.75,
        name: "Phase 2: Lightning Hose",
        attacks: ["fire_nova", "lightning_hose"],
        movePattern: "chase",
        summonCount: 3
      },
      {
        hpThreshold: 0.50,
        name: "Phase 3: Apocalypse",
        attacks: ["fire_nova", "lightning_hose", "apocalypse"],
        movePattern: "chase",
        summonCount: 3
      },
      {
        hpThreshold: 0.25,
        name: "Phase 4: Enrage",
        attacks: ["fire_nova", "lightning_hose", "apocalypse"],
        movePattern: "chase",
        speedMult: 1.3,
        attackSpeedMult: 1.5,
        summonCount: 5
      }
    ],
    attackCooldown: 2500,
    immuneKnockback: true,
    immuneSlow: true,
    xp: 1000,
    level: 5
  }
};
