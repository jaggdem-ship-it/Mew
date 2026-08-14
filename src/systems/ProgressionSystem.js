import { CONSTANTS } from "../config/GameConfig.js";

export class ProgressionSystem {
  constructor(runState) {
    this.runState = runState;
    this.level = 1;
    this.xp = 0;
    this.xpToNext = CONSTANTS.XP_CURVE[1] || 15;
    this.rerolls = 3;
  }

  addXp(amount) {
    const xpMult = this.runState.getStatMult("xpMult");
    this.xp += Math.floor(amount * xpMult);
    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    const idx = Math.min(this.level, CONSTANTS.XP_CURVE.length - 1);
    this.xpToNext = CONSTANTS.XP_CURVE[idx] || Math.floor(this.xpToNext * 1.3);
    return true;
  }

  getLevelCards() {
    const cards = [];
    const ownedWeapons = Object.keys(this.runState.weapons);
    const ownedPassives = Object.keys(this.runState.passives);
    const allWeapons = Object.keys(this.runState.weaponDefs);
    const allPassives = Object.keys(this.runState.passiveDefs);

    // New weapon
    if (ownedWeapons.length < CONSTANTS.MAX_WEAPON_SLOTS) {
      const available = allWeapons.filter(w => !ownedWeapons.includes(w));
      if (available.length) {
        const key = available[Math.floor(Math.random() * available.length)];
        cards.push({ type: "weapon", key, isNew: true });
      }
    }

    // New passive
    if (ownedPassives.length < CONSTANTS.MAX_PASSIVE_SLOTS) {
      const available = allPassives.filter(p => !ownedPassives.includes(p));
      if (available.length) {
        const key = available[Math.floor(Math.random() * available.length)];
        cards.push({ type: "passive", key, isNew: true });
      }
    }

    // Upgrade existing weapon
    const upgradableWeapons = ownedWeapons.filter(w => this.runState.weapons[w] < CONSTANTS.WEAPON_MAX_LEVEL);
    if (upgradableWeapons.length) {
      const key = upgradableWeapons[Math.floor(Math.random() * upgradableWeapons.length)];
      const def = this.runState.weaponDefs[key];
      const canEvolve = def.evolution && this.runState.passives[def.evolvePassive] >= 1 && this.runState.weapons[key] >= CONSTANTS.WEAPON_MAX_LEVEL - 1;
      cards.push({ type: "weapon_upgrade", key, isEvolution: canEvolve });
    }

    // Upgrade existing passive
    const upgradablePassives = ownedPassives.filter(p => this.runState.passives[p] < CONSTANTS.PASSIVE_MAX_LEVEL);
    if (upgradablePassives.length) {
      const key = upgradablePassives[Math.floor(Math.random() * upgradablePassives.length)];
      cards.push({ type: "passive_upgrade", key });
    }

    // Fill to 3-4 cards
    while (cards.length < 3) {
      cards.push({ type: "gold", amount: 10 + this.level * 2 });
    }

    return cards.slice(0, 4);
  }

  applyCard(card) {
    if (card.type === "weapon" || card.type === "weapon_upgrade") {
      this.runState.addWeaponLevel(card.key);
    } else if (card.type === "passive" || card.type === "passive_upgrade") {
      this.runState.addPassiveLevel(card.key);
    } else if (card.type === "gold") {
      this.runState.gold += card.amount;
    }
  }
}
