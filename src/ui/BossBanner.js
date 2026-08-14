export class BossBanner {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
  }

  show(bossDef, onComplete) {
    if (this.active) return;
    this.active = true;
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(100);

    const bg = this.scene.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6);
    this.container.add(bg);

    const panel = this.scene.add.rectangle(w / 2, h / 2, 280, 100, 0x1a0a0a);
    panel.setStrokeStyle(2, 0xff0000);
    this.container.add(panel);

    const nameText = this.scene.add.text(w / 2, h / 2 - 15, bossDef.name, {
      fontSize: "24px", color: "#ff0000", fontStyle: "bold"
    }).setOrigin(0.5);
    this.container.add(nameText);

    const titleText = this.scene.add.text(w / 2, h / 2 + 15, bossDef.title, {
      fontSize: "14px", color: "#ff6666"
    }).setOrigin(0.5);
    this.container.add(titleText);

    this.scene.audio.playSfx("boss_roar");

    this.scene.tweens.add({
      targets: panel, scaleX: 1.1, scaleY: 1.1, duration: 200, yoyo: true
    });

    this.scene.time.delayedCall(2500, () => {
      this.hide();
      if (onComplete) onComplete();
    });
  }

  hide() {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
    this.active = false;
  }
}
