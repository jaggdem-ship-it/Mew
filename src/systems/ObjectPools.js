import { ObjectPoolBase } from "../utils/ObjectPoolBase.js";

export class ObjectPools {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = new ObjectPoolBase(
      scene,
      () => scene.add.image(0, 0, "firebolt"),
      (obj, x, y, textureKey, scale, speed, angle, damage, pierce) => {
        obj.setTexture(textureKey);
        obj.setPosition(x, y);
        obj.setScale(scale);
        obj.setRotation(angle);
        obj.speed = speed;
        obj.angleVal = angle;
        obj.damage = damage;
        obj.pierce = pierce;
        obj.hitEnemies = new Set();
        obj.lifetime = 3000;
      }
    );
    this.particles = new ObjectPoolBase(
      scene,
      () => scene.add.image(0, 0, "firebolt"),
      (obj, x, y, textureKey, scale, speed, angle, lifetime) => {
        obj.setTexture(textureKey);
        obj.setPosition(x, y);
        obj.setScale(scale);
        obj.vx = Math.cos(angle) * speed;
        obj.vy = Math.sin(angle) * speed;
        obj.lifetime = lifetime;
        obj.maxLifetime = lifetime;
      }
    );
    this.damageNumbers = new ObjectPoolBase(
      scene,
      () => scene.add.text(0, 0, "", { fontSize: "10px", color: "#ffffff" }).setOrigin(0.5),
      (obj, x, y, text, color) => {
        obj.setPosition(x, y);
        obj.setText(text);
        obj.setColor(color);
        obj.lifetime = 800;
        obj.vy = -30;
      }
    );
  }

  spawnProjectile(x, y, textureKey, scale, speed, angle, damage, pierce) {
    return this.projectiles.get(x, y, textureKey, scale, speed, angle, damage, pierce);
  }

  spawnParticle(x, y, textureKey, scale, speed, angle, lifetime) {
    return this.particles.get(x, y, textureKey, scale, speed, angle, lifetime);
  }

  spawnDamageNumber(x, y, damage, isCrit) {
    const text = isCrit ? `CRIT ${damage}` : `${damage}`;
    const color = isCrit ? "#ffaa00" : "#ffffff";
    return this.damageNumbers.get(x, y, text, color);
  }

  update(dt) {
    this.projectiles.update(dt);
    this.particles.update(dt);
    this.damageNumbers.update(dt);
  }
}
