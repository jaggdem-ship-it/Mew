import { MathUtils } from "../utils/MathUtils.js";

export class Projectile {
  constructor(scene, x, y, textureKey, scale, speed, angle, damage, pierce) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.textureKey = textureKey;
    this.scale = scale;
    this.speed = speed;
    this.angleVal = angle;
    this.damage = damage;
    this.pierce = pierce;
    this.hitEnemies = new Set();
    this.lifetime = 3000;
    this.active = true;
    this.shouldDestroy = false;
    this.homing = false;
    this.target = null;
    this.rotSpeed = MathUtils.randomRange(-3, 3);

    this.sprite = scene.add.image(x, y, textureKey);
    this.sprite.setScale(scale);
    this.sprite.setRotation(angle);
    this.sprite.setDepth(4);
  }

  update(dt) {
    if (!this.active) return;
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.shouldDestroy = true;
      return;
    }

    if (this.homing && this.target && this.target.active) {
      const desired = MathUtils.angleTo(this.x, this.y, this.target.x, this.target.y);
      this.angleVal = MathUtils.lerp(this.angleVal, desired, 0.05);
    }

    this.x += Math.cos(this.angleVal) * this.speed * (dt / 1000);
    this.y += Math.sin(this.angleVal) * this.speed * (dt / 1000);
    this.sprite.setPosition(this.x, this.y);
    this.sprite.setRotation(this.sprite.rotation + this.rotSpeed * (dt / 1000));

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    if (this.x < -30 || this.x > w + 30 || this.y < -30 || this.y > h + 30) {
      this.shouldDestroy = true;
    }
  }

  onHit(enemy) {
    if (this.hitEnemies.has(enemy)) return false;
    this.hitEnemies.add(enemy);
    enemy.takeDamage(this.damage);
    if (this.hitEnemies.size > this.pierce) {
      this.shouldDestroy = true;
    }
    return true;
  }

  destroy() {
    this.active = false;
    this.sprite.destroy();
  }
}
