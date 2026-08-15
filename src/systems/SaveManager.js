export class SaveManager {
  static KEY = "sanctuary_survivors_save";

  static getDefault() {
    return {
      gold: 0,
      bestTime: null,
      campaignClear: false,
      tormentUnlocked: false,
      upgrades: {
        might: 0,
        vitality: 0,
        growth: 0,
        greed: 0,
        armor: 0,
        speed: 0,
        magnet: 0,
        revival: 0
      },
      settings: {
        master: 0.6,
        bgm: 0.5,
        sfx: 0.7,
        shake: true,
        hitstop: true
      }
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(SaveManager.KEY);
      if (raw) {
        const data = JSON.parse(raw);
        return { ...SaveManager.getDefault(), ...data };
      }
    } catch (e) {}
    return SaveManager.getDefault();
  }

  static save(data) {
    try {
      localStorage.setItem(SaveManager.KEY, JSON.stringify(data));
    } catch (e) {}
  }

  static addGold(amount) {
    const data = SaveManager.load();
    data.gold += amount;
    SaveManager.save(data);
    return data.gold;
  }

  static spendGold(amount) {
    const data = SaveManager.load();
    if (data.gold >= amount) {
      data.gold -= amount;
      SaveManager.save(data);
      return true;
    }
    return false;
  }

  static buyUpgrade(key, cost) {
    const data = SaveManager.load();
    if (data.gold >= cost && data.upgrades[key] < 5) {
      data.gold -= cost;
      data.upgrades[key]++;
      SaveManager.save(data);
      return true;
    }
    return false;
  }

  static setCampaignClear() {
    const data = SaveManager.load();
    data.campaignClear = true;
    data.tormentUnlocked = true;
    SaveManager.save(data);
  }

  static setBestTime(seconds) {
    const data = SaveManager.load();
    if (!data.bestTime || seconds < data.bestTime) {
      data.bestTime = seconds;
      SaveManager.save(data);
    }
  }
}
