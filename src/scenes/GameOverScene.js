import Phaser from "phaser";
import { SaveManager } from "../systems/SaveManager.js";

export class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: "GameOverScene" }); }

  init(data) {
    this.levelId = data.levelId;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.9);

    this.add.text(w / 2, h / 2 - 30, "YOU DIED", {
      fontSize: "28px", color: "#ff0000", fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(w / 2, h / 2 + 5, `Fell on Level ${this.levelId}`, {
      fontSize: "14px", color: "#aaaaaa"
    }).setOrigin(0.5);

    const retry = this.add.text(w / 2, h / 2 + 40, "Try Again", {
      fontSize: "16px", color: "#ffffff"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    retry.on("pointerover", () => retry.setColor("#e94560"));
    retry.on("pointerout", () => retry.setColor("#ffffff"));
    retry.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });

    const menu = this.add.text(w / 2, h / 2 + 70, "Main Menu", {
      fontSize: "14px", color: "#888888"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    menu.on("pointerover", () => menu.setColor("#ffffff"));
    menu.on("pointerout", () => menu.setColor("#888888"));
    menu.on("pointerdown", () => {
      this.scene.start("TitleScene");
    });
  }
}
