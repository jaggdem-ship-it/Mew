export class HealthOrb {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.radius = 18;

    this.bg = scene.add.circle(x, y, this.radius, 0x330000);
    this.fill = scene.add.circle(x, y, this.radius - 2, 0xff0000);
    this.fill.setDepth(1);
    this.bg.setDepth(0);

    // Mask for liquid fill effect
    const maskShape = scene.add.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillCircle(x, y, this.radius - 2);
    this.fill.setMask(maskShape.createGeometryMask());
    this.maskShape = maskShape;

    this.percent = 1;
  }

  update(percent) {
    this.percent = percent;
    const fillHeight = (this.radius * 2 - 4) * percent;
    this.fill.setScale(1, percent);
    this.fill.y = this.y + (this.radius - 2) * (1 - percent);

    // Low HP warning
    if (percent < 0.25) {
      this.fill.setFillStyle(0xff0000);
      this.bg.setStrokeStyle(2, 0xff0000);
    } else {
      this.fill.setFillStyle(0xcc0000);
      this.bg.setStrokeStyle(0);
    }
  }

  destroy() {
    this.bg.destroy();
    this.fill.destroy();
    this.maskShape.destroy();
  }
}
