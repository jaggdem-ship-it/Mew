import { CLASSES } from "../data/classes.js";
import { AudioManager } from "../systems/AudioManager.js";
import { RunState } from "../systems/RunState.js";

export class ClassSelectScene extends Phaser.Scene {
  constructor() { super({ key: "ClassSelectScene" }); }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x0d1b2a);
    this.add.text(w / 2, 30, "CHOOSE YOUR CLASS", {
      fontSize: "18px", color: "#ffffff", fontStyle: "bold"
    }).setOrigin(0.5);

    this.audio = new AudioManager(this);

    const classes = Object.values(CLASSES);
    const cardW = 100;
    const cardH = 130;
    const spacing = 15;
    const startX = w / 2 - (classes.length * cardW + (classes.length - 1) * spacing) / 2 + cardW / 2;

    classes.forEach((cls, i) => {
      const cx = startX + i * (cardW + spacing);
      const cy = h / 2;

      const panel = this.add.rectangle(cx, cy, cardW, cardH, 0x1a1a2e);
      panel.setStrokeStyle(2, 0x3498db);
      panel.setInteractive({ useHandCursor: true });

      const icon = this.add.image(cx, cy - 35, `class_${cls.key}`);
      icon.setScale(0.06);

      const name = this.add.text(cx, cy - 10, cls.name, {
        fontSize: "12px", color: "#ffffff", fontStyle: "bold"
      }).setOrigin(0.5);

      const desc = this.add.text(cx, cy + 15, cls.description, {
        fontSize: "9px", color: "#aaaaaa", wordWrap: { width: cardW - 10 }
      }).setOrigin(0.5);

      const stats = this.add.text(cx, cy + 50,
        `HP: ${Math.round(cls.stats.maxHpMult * 100)}%\nDMG: ${Math.round(cls.stats.damageMult * 100)}%\nSPD: ${Math.round(cls.stats.speedMult * 100)}%`, {
        fontSize: "8px", color: "#888888", align: "center"
      }).setOrigin(0.5);

      panel.on("pointerover", () => {
        panel.setFillStyle(0x2a2a3e);
        panel.setScale(1.05);
      });
      panel.on("pointerout", () => {
        panel.setFillStyle(0x1a1a2e);
        panel.setScale(1);
      });
      panel.on("pointerdown", () => {
        this.audio.playSfx("ui_click");
        this.selectClass(cls.key);
      });
    });

    // Back button
    const back = this.add.text(20, h - 20, "< Back", {
      fontSize: "12px", color: "#888888"
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });
    back.on("pointerover", () => back.setColor("#ffffff"));
    back.on("pointerout", () => back.setColor("#888888"));
    back.on("pointerdown", () => {
      this.audio.playSfx("ui_back");
      this.scene.start("TitleScene");
    });
  }

  selectClass(classKey) {
    this.registry.set("selectedClass", classKey);
    this.registry.set("currentLevel", 1);
    const runState = new RunState(classKey, 1);
    this.audio.stopBGM();
    this.scene.start("LevelScene", { runState });
  }
}
