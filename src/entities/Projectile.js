import { MathUtils } from "../utils/MathUtils.js";

export class Projectile {
  constructor(scene) {
    this.scene = scene;
    this.sprite = scene.add.image(0, 0, "firebolt");
    this.sprite.setVisible(false);
    this.active = false;
    this.shouldDestroy = false;
    this.radius = 4;
  }

  reset(x, y, textureKey, scale, speed, angle, damage, pierce) {
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
    this.trailTimer = 0;
    this.bolts = 0;
    this.boltTimer = 0;

    this.sprite.setTexture(textureKey);
    this.sprite.setPosition(x, y);
    this.sprite.setScale(scale);
    this.sprite.setRotation(angle);
    this.sprite.setVisible(true);
    this.sprite.setAlpha(1);
    this.sprite.setDepth(4);
    this.sprite.clearTint();

    // Spawn flash
    const flash = this.scene.add.circle(x, y, 8, 0xffffff, 0.6);
    flash.setDepth(5);
    this.scene.tweens.add({
      targets: flash,
      scale: 2,
      alpha: 0,
      duration: 100,
      onComplete: () => flash.destroy()
    });
  }

  update(dt) {
    if (!this.active) return;
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.impact();
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

    // Trail particles
    this.trailTimer += dt;
    if (this.trailTimer > 40) {
      this.trailTimer = 0;
      const trailColor = this.getTrailColor();
      this.scene.juice.spawnTrail(this.x, this.y, trailColor, this.scale * 0.4, 120);
    }

    // Frozen orb bolt spray
    if (this.bolts > 0) {
      this.boltTimer += dt;
      if (this.boltTimer > 300) {
        this.boltTimer = 0;
        this.bolts--;
        for (let i = 0; i < 3; i++) {
          const a = this.angleVal + (Math.PI * 2 / 3) * i;
          this.scene.pools.spawnProjectile(this.x, this.y, "ice_shard", 0.4, 100, a, this.damage * 0.3, 0);
        }
      }
    }

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    if (this.x < -30 || this.x > w + 30 || this.y < -30 || this.y > h + 30) {
      this.shouldDestroy = true;
    }
  }

  getTrailColor() {
    switch (this.textureKey) {
      case "firebolt": return 0xFF4500;
      case "ice_shard": return 0x87CEEB;
      case "arrow": return 0xCCCCCC;
      case "lightning_bolt": return 0xFFFF00;
      case "poison_orb": return 0x32CD32;
      case "bone_shard": return 0xDDDDDD;
      case "holy_bolt": return 0xFFD700;
      case "meteor": return 0xFF4500;
      case "fist_of_heavens": return 0xFFD700;
      case "hydraHead": return 0xFF6600;
      default: return 0xffffff;
    }
  }

  impact() {
    const color = this.getTrailColor();
    this.scene.juice.impactBurst(this.x, this.y, color, 5);
  }

  onHit(enemy) {
    if (this.hitEnemies.has(enemy)) return false;
    this.hitEnemies.add(enemy);
    enemy.takeDamage(this.damage, this.x, this.y);

    // Impact juice
    const color = this.getTrailColor();
    this.scene.juice.impactBurst(this.x, this.y, color, 4);
    this.scene.juice.spawnTrail(this.x, this.y, color, 0.5, 200);

    if (this.hitEnemies.size > this.pierce) {
      this.impact();
      this.shouldDestroy = true;
    }
    return true;
  }

  release() {
    this.active = false;
    this.shouldDestroy = false;
    if (this.sprite) this.sprite.setVisible(false);
  }
}
