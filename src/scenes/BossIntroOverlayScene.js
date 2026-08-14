import Phaser from "phaser";
export class BossIntroOverlayScene extends Phaser.Scene {
  constructor() { super({ key: "BossIntroOverlayScene" }); }

  create() {
    // Boss intro is handled within LevelScene via BossBanner
  }
}
