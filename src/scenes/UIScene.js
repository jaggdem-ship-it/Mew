import { HealthOrb } from "../ui/HealthOrb.js";
import { XPBar } from "../ui/XPBar.js";

export class UIScene extends Phaser.Scene {
  constructor() { super({ key: "UIScene" }); }

  init(data) {
    this.player = data.player;
    this.progression = data.progression;
    this.levelName = data.levelName;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.healthOrb = new HealthOrb(this, 30, h - 25);
    this.xpBar = new XPBar(this, 60, h - 12, w - 70, 6);

    // Weapon icons
    this.weaponIcons = [];
  }

  update() {
    if (!this.player || this.player.dead) return;

    this.healthOrb.update(this.player.getHpPercent());
    this.xpBar.update(
      this.progression.xp / this.progression.xpToNext,
      this.progression.level
    );

    // Update weapon icons
    const weapons = Object.entries(this.player.runState.weapons);
    while (this.weaponIcons.length < weapons.length) {
      const icon = this.add.circle(70 + this.weaponIcons.length * 18, this.scale.height - 35, 6, 0x666666);
      icon.setDepth(10);
      const txt = this.add.text(70 + this.weaponIcons.length * 18, this.scale.height - 28, "", {
        fontSize: "8px", color: "#ffffff"
      }).setOrigin(0.5).setDepth(11);
      this.weaponIcons.push({ icon, txt });
    }

    weapons.forEach(([key, lvl], i) => {
      if (i < this.weaponIcons.length) {
        const def = this.player.runState.weaponDefs[key];
        this.weaponIcons[i].icon.setFillStyle(def ? 0xff6666 : 0x666666);
        this.weaponIcons[i].txt.setText(`${lvl}`);
      }
    });
  }
}
