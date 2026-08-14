export class LevelTransitionScene extends Phaser.Scene {
  constructor() { super({ key: "LevelTransitionScene" }); }

  init(data) {
    this.levelId = data.levelId;
    this.runState = data.runState;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x0d1b2a);

    const title = this.add.text(w / 2, 50, `LEVEL ${this.levelId} CLEARED`, {
      fontSize: "20px", color: "#ffd700", fontStyle: "bold"
    }).setOrigin(0.5);

    // Stats recap
    const stats = [
      `Gold earned: ${this.runState.gold}`,
      `Weapons: ${Object.keys(this.runState.weapons).length}`,
      `Passives: ${Object.keys(this.runState.passives).length}`
    ];
    stats.forEach((s, i) => {
      this.add.text(w / 2, 90 + i * 20, s, {
        fontSize: "12px", color: "#ffffff"
      }).setOrigin(0.5);
    });

    // Weapon list
    let y = 160;
    this.add.text(w / 2, y, "Equipped:", { fontSize: "10px", color: "#aaaaaa" }).setOrigin(0.5);
    y += 15;
    for (const [key, lvl] of Object.entries(this.runState.weapons)) {
      const def = this.runState.weaponDefs[key];
      this.add.text(w / 2, y, `${def.name} Lv.${lvl}`, { fontSize: "9px", color: "#cccccc" }).setOrigin(0.5);
      y += 12;
    }

    // Next level button
    const nextBtn = this.add.text(w / 2, h - 40, `ENTER LEVEL ${this.levelId + 1} >`, {
      fontSize: "16px", color: "#e94560", fontStyle: "bold"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    nextBtn.on("pointerover", () => nextBtn.setScale(1.1));
    nextBtn.on("pointerout", () => nextBtn.setScale(1));
    nextBtn.on("pointerdown", () => {
      this.registry.set("runState", this.runState);
      this.scene.start("LevelScene", { levelId: this.levelId + 1, freshRun: false });
    });
  }
}
