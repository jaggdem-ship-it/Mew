export const PASSIVES = {
  vitality: {
    key: "vitality",
    name: "Vitality",
    description: "+10% Max HP per rank",
    scaling: [
      { maxHpMult: 1.10 },
      { maxHpMult: 1.20 },
      { maxHpMult: 1.30 },
      { maxHpMult: 1.40 },
      { maxHpMult: 1.50 }
    ]
  },
  might: {
    key: "might",
    name: "Might",
    description: "+10% Damage per rank",
    scaling: [
      { damageMult: 1.10 },
      { damageMult: 1.20 },
      { damageMult: 1.30 },
      { damageMult: 1.40 },
      { damageMult: 1.50 }
    ]
  },
  swiftness: {
    key: "swiftness",
    name: "Swiftness",
    description: "+8% Move Speed per rank",
    scaling: [
      { speedMult: 1.08 },
      { speedMult: 1.16 },
      { speedMult: 1.24 },
      { speedMult: 1.32 },
      { speedMult: 1.40 }
    ]
  },
  sorcerers_insight: {
    key: "sorcerers_insight",
    name: "Sorcerer's Insight",
    description: "-8% Cooldown per rank",
    scaling: [
      { cooldownMult: 0.92 },
      { cooldownMult: 0.84 },
      { cooldownMult: 0.76 },
      { cooldownMult: 0.68 },
      { cooldownMult: 0.60 }
    ]
  },
  magnetism: {
    key: "magnetism",
    name: "Magnetism",
    description: "+25% Pickup radius per rank",
    scaling: [
      { magnetMult: 1.25 },
      { magnetMult: 1.50 },
      { magnetMult: 1.75 },
      { magnetMult: 2.00 },
      { magnetMult: 2.50 }
    ]
  },
  lucky_charm: {
    key: "lucky_charm",
    name: "Lucky Charm",
    description: "+5% Crit, +10% Loot per rank",
    scaling: [
      { critChance: 0.05, lootMult: 1.10 },
      { critChance: 0.10, lootMult: 1.20 },
      { critChance: 0.15, lootMult: 1.30 },
      { critChance: 0.20, lootMult: 1.40 },
      { critChance: 0.25, lootMult: 1.50 }
    ]
  },
  armor_of_faith: {
    key: "armor_of_faith",
    name: "Armor of Faith",
    description: "+1 Armor, -5% Damage Taken per rank",
    scaling: [
      { armor: 1, damageTakenMult: 0.95 },
      { armor: 2, damageTakenMult: 0.90 },
      { armor: 3, damageTakenMult: 0.85 },
      { armor: 4, damageTakenMult: 0.80 },
      { armor: 5, damageTakenMult: 0.75 }
    ]
  },
  greed: {
    key: "greed",
    name: "Greed",
    description: "+15% Gold Find per rank",
    scaling: [
      { goldMult: 1.15 },
      { goldMult: 1.30 },
      { goldMult: 1.45 },
      { goldMult: 1.60 },
      { goldMult: 1.80 }
    ]
  },
  arcane_power: {
    key: "arcane_power",
    name: "Arcane Power",
    description: "+12% Area Size per rank",
    scaling: [
      { areaMult: 1.12 },
      { areaMult: 1.24 },
      { areaMult: 1.36 },
      { areaMult: 1.48 },
      { areaMult: 1.60 }
    ]
  },
  experience_shrine: {
    key: "experience_shrine",
    name: "Experience Shrine",
    description: "+10% XP Gain per rank",
    scaling: [
      { xpMult: 1.10 },
      { xpMult: 1.20 },
      { xpMult: 1.30 },
      { xpMult: 1.40 },
      { xpMult: 1.50 }
    ]
  }
};
