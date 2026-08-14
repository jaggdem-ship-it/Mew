import Phaser from "phaser";
export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: "PreloadScene" }); }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x0d1b2a);
    this.add.text(w / 2, h / 2 - 20, "SANCTUARY SURVIVORS", {
      fontSize: "20px", color: "#e94560", fontStyle: "bold"
    }).setOrigin(0.5);

    const barW = 200;
    const bar = this.add.rectangle(w / 2 - barW / 2, h / 2 + 10, 0, 8, 0xe94560).setOrigin(0, 0.5);
    this.add.rectangle(w / 2, h / 2 + 10, barW, 8, 0x000000, 0.5).setOrigin(0.5);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      bar.width = barW * Math.min(progress, 1);
      if (progress >= 1) {
        clearInterval(interval);
        this.scene.start("TitleScene");
      }
    }, 50);
  }
}
