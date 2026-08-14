import Phaser from "phaser";
import { SaveManager } from "../systems/SaveManager.js";

export class ShopScene extends Phaser.Scene {
  constructor() { super({ key: "ShopScene" }); }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.save = SaveManager.load();

    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.85);
    this.add.text(w / 2, 25, "META SHOP", {
      fontSize: "20px", color: "#ffd700", fontStyle: "bold"
    }).setOrigin(0.5);

    this.goldText = this.add.text(w - 10, 10, `Gold: ${this.save.gold}`, {
      fontSize: "12px", color: "#ffd700"
    }).setOrigin(1, 0);

    const upgrades = [
      { key: "might", name: "Might", desc: "+10% Damage", cost: 50 },
      { key: "vitality", name: "Vitality", desc: "+10% Max HP", cost: 50 },
      { key: "growth", name: "Growth", desc: "+10% XP", cost: 60 },
      { key: "greed", name: "Greed", desc: "+15% Gold", cost: 60 },
      { key: "armor", name: "Armor", desc: "-5% Damage Taken", cost: 70 },
      { key: "speed", name: "Speed", desc: "+5% Move Speed", cost: 50 },
      { key: "magnet", name: "Magnet", desc: "+25% Pickup Radius", cost: 40 },
      { key: "revival", name: "Revival", desc: "One extra life", cost: 200 }
    ];

    upgrades.forEach((u, i) => {
      const x = 60 + (i % 2) * 200;
      const y = 60 + Math.floor(i / 2) * 35;
      const rank = this.save.upgrades[u.key];
      const maxed = rank >= 5 || (u.key === "revival" && rank >= 1);

      const label = this.add.text(x, y, `${u.name} [${rank}]`, {
        fontSize: "11px", color: maxed ? "#666666" : "#ffffff"
      }).setOrigin(0, 0.5);

      const desc = this.add.text(x, y + 12, u.desc, {
        fontSize: "8px", color: "#888888"
      }).setOrigin(0, 0.5);

      const btn = this.add.text(x + 140, y, maxed ? "MAX" : `${u.cost}G`, {
        fontSize: "10px", color: maxed ? "#666666" : "#ffd700"
      }).setOrigin(0, 0.5).setInteractive({ useHandCursor: !maxed });

      if (!maxed) {
        btn.on("pointerover", () => btn.setColor("#ffffff"));
        btn.on("pointerout", () => btn.setColor("#ffd700"));
        btn.on("pointerdown", () => {
          if (SaveManager.buyUpgrade(u.key, u.cost)) {
            this.save = SaveManager.load();
            this.goldText.setText(`Gold: ${this.save.gold}`);
            label.setText(`${u.name} [${this.save.upgrades[u.key]}]`);
            if (this.save.upgrades[u.key] >= 5 || (u.key === "revival" && this.save.upgrades[u.key] >= 1)) {
              btn.setText("MAX");
              btn.setColor("#666666");
              btn.disableInteractive();
            }
          }
        });
      }
    });

    const back = this.add.text(w / 2, h - 20, "Close", {
      fontSize: "14px", color: "#ffffff"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on("pointerover", () => back.setColor("#e94560"));
    back.on("pointerout", () => back.setColor("#ffffff"));
    back.on("pointerdown", () => {
      this.scene.stop();
    });
  }
}
