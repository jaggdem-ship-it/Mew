import { SaveManager } from "../systems/SaveManager.js";

export class VictoryScene extends Phaser.Scene {
  constructor() { super({ key: "VictoryScene" }); }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.9);

    this.add.text(w / 2, h / 2 - 40, "VICTORY", {
      fontSize: "32px", color: "#ffd700", fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(w / 2, h / 2, "Diablo has been defeated!", {
      fontSize: "14px", color: "#ffffff"
    }).setOrigin(0.5);

    this.add.text(w / 2, h / 2 + 25, "The Sanctuary is safe... for now.", {
      fontSize: "12px", color: "#aaaaaa"
    }).setOrigin(0.5);

    const save = SaveManager.load();
    if (save.tormentUnlocked) {
      this.add.text(w / 2, h / 2 + 50, "Torment I Unlocked!", {
        fontSize: "12px", color: "#ff0000", fontStyle: "bold"
      }).setOrigin(0.5);
    }

    const menu = this.add.text(w / 2, h - 40, "Main Menu", {
      fontSize: "16px", color: "#e94560"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    menu.on("pointerover", () => menu.setScale(1.1));
    menu.on("pointerout", () => menu.setScale(1));
    menu.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}
