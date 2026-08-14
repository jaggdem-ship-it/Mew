export class XPBar {
  constructor(scene, x, y, width, height) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.bg = scene.add.rectangle(x, y, width, height, 0x1a1a2e);
    this.bg.setOrigin(0, 0.5);
    this.fill = scene.add.rectangle(x, y, width, height, 0x00aaff);
    this.fill.setOrigin(0, 0.5);
    this.bg.setDepth(10);
    this.fill.setDepth(11);

    this.levelText = scene.add.text(x + width / 2, y - 10, "Lv.1", {
      fontSize: "10px", color: "#ffffff"
    }).setOrigin(0.5).setDepth(12);
  }

  update(percent, level) {
    this.fill.setScale(percent, 1);
    this.levelText.setText(`Lv.${level}`);
  }

  destroy() {
    this.bg.destroy();
    this.fill.destroy();
    this.levelText.destroy();
  }
}
