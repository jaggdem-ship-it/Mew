export class PauseScene extends Phaser.Scene {
  constructor() { super({ key: "PauseScene" }); }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7);

    this.add.text(w / 2, h / 2 - 30, "PAUSED", {
      fontSize: "24px", color: "#ffffff", fontStyle: "bold"
    }).setOrigin(0.5);

    const resume = this.add.text(w / 2, h / 2 + 10, "Resume", {
      fontSize: "16px", color: "#ffffff"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    resume.on("pointerover", () => resume.setColor("#e94560"));
    resume.on("pointerout", () => resume.setColor("#ffffff"));
    resume.on("pointerdown", () => {
      this.scene.stop();
      this.scene.resume("LevelScene");
    });

    const quit = this.add.text(w / 2, h / 2 + 40, "Quit to Menu", {
      fontSize: "14px", color: "#888888"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    quit.on("pointerover", () => quit.setColor("#ffffff"));
    quit.on("pointerout", () => quit.setColor("#888888"));
    quit.on("pointerdown", () => {
      this.scene.stop("LevelScene");
      this.scene.stop();
      this.scene.start("TitleScene");
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.scene.stop();
      this.scene.resume("LevelScene");
    });
  }
}
