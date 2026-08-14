import Phaser from "phaser";
import { AudioManager } from "../systems/AudioManager.js";
import { SaveManager } from "../systems/SaveManager.js";

export class TitleScene extends Phaser.Scene {
  constructor() { super({ key: "TitleScene" }); }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const save = SaveManager.load();

    const titleBg = this.add.image(w / 2, h / 2, "bg_level1");
    titleBg.setDisplaySize(w, h);
    titleBg.setAlpha(0.35);
    this.add.rectangle(w / 2, h / 2, w, h, 0x0d1b2a, 0.6);

    // Title
    const title = this.add.text(w / 2, 60, "SANCTUARY", {
      fontSize: "32px", color: "#e94560", fontStyle: "bold"
    }).setOrigin(0.5).setShadow(2, 2, "#000000", 2, false, true);
    const subtitle = this.add.text(w / 2, 90, "SURVIVORS", {
      fontSize: "20px", color: "#ff6666"
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title, y: 65, duration: 2000, yoyo: true, repeat: -1, ease: "Sine.easeInOut"
    });

    // Menu items
    const items = [
      { label: "Start Campaign", action: () => this.startCampaign() },
      { label: "Meta Shop", action: () => this.openShop() },
      { label: "Settings", action: () => this.openSettings() }
    ];

    items.forEach((item, i) => {
      const txt = this.add.text(w / 2, 140 + i * 28, item.label, {
        fontSize: "16px", color: "#ffffff"
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      txt.on("pointerover", () => { txt.setColor("#e94560"); txt.setScale(1.1); });
      txt.on("pointerout", () => { txt.setColor("#ffffff"); txt.setScale(1); });
      txt.on("pointerdown", () => {
        this.audio.playSfx("ui_click");
        item.action();
      });
    });

    // Gold display
    this.add.text(w - 10, 10, `Gold: ${save.gold}`, {
      fontSize: "12px", color: "#ffd700"
    }).setOrigin(1, 0);

    // Best time
    if (save.bestTime) {
      const mins = Math.floor(save.bestTime / 60);
      const secs = save.bestTime % 60;
      this.add.text(w - 10, 26, `Best: ${mins}:${secs.toString().padStart(2, "0")}`, {
        fontSize: "10px", color: "#aaaaaa"
      }).setOrigin(1, 0);
    }

    // Campaign clear badge
    if (save.campaignClear) {
      this.add.text(10, 10, "CAMPAIGN CLEARED", {
        fontSize: "10px", color: "#ffd700", fontStyle: "bold"
      }).setOrigin(0, 0);
    }

    this.audio = new AudioManager(this);
    this.audio.playBGM(100, [0, 2, 4, 5, 7, 9, 11], 220, 0.8);
  }

  startCampaign() {
    this.audio.stopBGM();
    this.scene.start("ClassSelectScene");
  }

  openShop() {
    this.scene.launch("ShopScene");
  }

  openSettings() {
    this.scene.launch("SettingsScene");
  }
}
