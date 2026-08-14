import { WEAPONS } from "../data/weapons.js";
import { MathUtils } from "../utils/MathUtils.js";

export class WeaponSystem {
  constructor(scene, runState) {
    this.scene = scene;
    this.runState = runState;
    this.cooldowns = {};
    this.hydras = [];
  }

  update(dt, player, enemies, collisionSystem, pools) {
    const dmgMult = this.runState.getStatMult("damageMult");
    const areaMult = this.runState.getStatMult("areaMult");
    const cdrMult = this.runState.getStatMult("cooldownMult");

    for (const [key, level] of Object.entries(this.runState.weapons)) {
      const def = WEAPONS[key];
      if (!def) continue;
      const scaling = def.scaling[Math.min(level - 1, def.scaling.length - 1)];
      const cooldown = (scaling.cooldown ?? def.baseCooldown) * cdrMult * 1000;

      this.cooldowns[key] = (this.cooldowns[key] || 0) + dt;
      if (this.cooldowns[key] >= cooldown) {
        this.cooldowns[key] = 0;
        this.fireWeapon(key, def, scaling, player, enemies, collisionSystem, pools, dmgMult, areaMult);
      }
    }

    for (let i = this.hydras.length - 1; i >= 0; i--) {
      const h = this.hydras[i];
      h.timer += dt;
      if (h.timer > 1500) {
        h.timer = 0;
        const nearest = collisionSystem.queryNearest(h.x, h.y, 200);
        if (nearest) {
          const angle = MathUtils.angleTo(h.x, h.y, nearest.x, nearest.y);
          pools.spawnProjectile(h.x, h.y, "firebolt", 0.5, 120, angle, 8 * dmgMult * 0.5, 0);
        }
      }
      h.lifetime -= dt;
      if (h.lifetime <= 0) {
        h.obj.destroy();
        this.hydras.splice(i, 1);
      }
    }
  }

  fireWeapon(key, def, scaling, player, enemies, collisionSystem, pools, dmgMult, areaMult) {
    const damage = (scaling.damage ?? def.baseDamage) * dmgMult;
    const area = (scaling.area ?? def.baseArea) * areaMult;
    const pierce = scaling.pierce ?? def.pierce;

    switch (def.type) {
      case "projectile": {
        const nearest = collisionSystem.queryNearest(player.x, player.y, 250);
        if (!nearest) return;
        const angle = MathUtils.angleTo(player.x, player.y, nearest.x, nearest.y);
        if (key === "teeth") {
          const count = scaling.count ?? 3;
          const spread = Math.PI / 6;
          for (let i = 0; i < count; i++) {
            const a = angle - spread / 2 + (spread / (count - 1 || 1)) * i;
            pools.spawnProjectile(player.x, player.y, "bone_shard", 0.5, def.baseSpeed, a, damage, pierce);
          }
        } else if (key === "frozen_orb") {
          const orb = pools.spawnProjectile(player.x, player.y, "ice_shard", 0.7, def.baseSpeed, angle, damage, pierce);
          orb.bolts = scaling.bolts ?? 4;
          orb.boltTimer = 0;
        } else if (key === "chain_lightning") {
          const chains = scaling.chains ?? 3;
          const target = nearest;
          let current = target;
          const hit = new Set();
          for (let i = 0; i < chains && current; i++) {
            if (hit.has(current)) break;
            hit.add(current);
            pools.spawnProjectile(player.x, player.y, "lightning_bolt", 0.6, 200, MathUtils.angleTo(player.x, player.y, current.x, current.y), damage, 0);
            current = collisionSystem.queryNearest(current.x, current.y, 100);
            if (hit.has(current)) break;
          }
        } else if (key === "bone_spirit") {
          const count = scaling.count ?? 1;
          for (let i = 0; i < count; i++) {
            pools.spawnProjectile(player.x, player.y, "bone_shard", 0.6, def.baseSpeed, angle + i * 0.3, damage, pierce);
          }
        } else {
          const tex = key === "firebolt" ? "firebolt" : key === "javelin" ? "arrow" : "holy_bolt";
          pools.spawnProjectile(player.x, player.y, tex, 0.5, def.baseSpeed, angle, damage, pierce);
        }
        break;
      }
      case "aura": {
        const radius = 30 * area;
        const nearby = collisionSystem.query(player.x, player.y, radius);
        for (const e of nearby) {
          if (e.takeDamage) e.takeDamage(damage);
        }
        const swirl = this.scene.add.image(player.x, player.y, "explosion");
        swirl.setScale(0.3);
        swirl.setAlpha(0.4);
        swirl.setTint(0xff4444);
        this.scene.tweens.add({ targets: swirl, scale: 1.2 * area, alpha: 0, duration: 300, onComplete: () => swirl.destroy() });
        break;
      }
      case "orbit": {
        const count = scaling.count ?? 1;
        for (let i = 0; i < count; i++) {
          const a = (this.scene.time.now / 1000 + (Math.PI * 2 / count) * i) % (Math.PI * 2);
          const ox = player.x + Math.cos(a) * 40 * area;
          const oy = player.y + Math.sin(a) * 40 * area;
          const nearby = collisionSystem.query(ox, oy, 15);
          for (const e of nearby) {
            if (e.takeDamage) e.takeDamage(damage);
          }
          const hammer = this.scene.add.image(ox, oy, "holy_bolt");
          hammer.setScale(0.5);
          hammer.setAlpha(0.7);
          this.scene.time.delayedCall(100, () => hammer.destroy());
        }
        break;
      }
      case "nova": {
        const nova = this.scene.add.image(player.x, player.y, "poison_pool");
        nova.setScale(0.2);
        nova.setAlpha(0.5);
        this.scene.tweens.add({
          targets: nova, scale: 1.5 * area, alpha: 0, duration: 500,
          onUpdate: () => {
            const nearby = collisionSystem.query(player.x, player.y, 40 * area * nova.scaleX);
            for (const e of nearby) {
              if (e.takeDamage && !e._novaHit) { e.takeDamage(damage); e._novaHit = true; }
            }
          },
          onComplete: () => { nova.destroy(); for (const e of enemies) e._novaHit = false; }
        });
        break;
      }
      case "summon": {
        const heads = scaling.heads ?? 1;
        for (let i = 0; i < heads; i++) {
          const hx = player.x + MathUtils.randomRange(-30, 30);
          const hy = player.y + MathUtils.randomRange(-30, 30);
          const hObj = this.scene.add.image(hx, hy, "hydra_head");
          hObj.setScale(0.5);
          hObj.setDepth(3);
          this.hydras.push({ obj: hObj, x: hx, y: hy, timer: 0, lifetime: 8000 });
        }
        break;
      }
      case "strike": {
        const bolts = scaling.bolts ?? 3;
        for (let i = 0; i < bolts; i++) {
          const target = enemies[Math.floor(Math.random() * enemies.length)];
          if (!target) continue;
          const strike = this.scene.add.image(target.x, target.y, "fist_of_heavens");
          strike.setScale(0.3);
          strike.setAlpha(0.9);
          this.scene.tweens.add({
            targets: strike, scale: 1, alpha: 0, duration: 200,
            onComplete: () => {
              strike.destroy();
              if (target.takeDamage) target.takeDamage(damage);
            }
          });
        }
        break;
      }
      case "homing": {
        const count = scaling.count ?? 1;
        for (let i = 0; i < count; i++) {
          const nearest = collisionSystem.queryNearest(player.x, player.y, 250);
          if (!nearest) return;
          const angle = MathUtils.angleTo(player.x, player.y, nearest.x, nearest.y);
          const spirit = pools.spawnProjectile(player.x, player.y, "bone_shard", 0.6, def.baseSpeed, angle, damage, pierce);
          spirit.homing = true;
          spirit.target = nearest;
        }
        break;
      }
      case "reactive": {
        break;
      }
    }
  }
}
