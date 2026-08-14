import { ENEMIES } from "../data/enemies.js";
import { MathUtils } from "../utils/MathUtils.js";

export class Enemy {
  constructor(scene, x, y, type, isElite = false, eliteAffix = null) {
    this.scene = scene;
    this.type = type;
    this.def = ENEMIES[type];
    if (!this.def) throw new Error(`Unknown enemy type: ${type}`);

    this.isElite = isElite;
    this.eliteAffix = eliteAffix;
    this.hp = this.def.hp * (isElite ? 3 : 1);
    this.maxHp = this.hp;
    this.damage = this.def.damage * (isElite ? 1.5 : 1);
    this.speed = this.def.speed * (eliteAffix === "fast" ? 1.5 : 1);
    this.xp = this.def.xp * (isElite ? 5 : 1);
    this.size = this.def.size;
    this.behavior = this.def.behavior;
    this.color = this.def.color;
    this.active = true;
    this.shouldDestroy = false;
    this.phaseTimer = 0;
    this.phaseVisible = true;
    this.spawnTimer = 0;
    this.chillTimer = 0;
    this.facing = 1;
    this.animTimer = 0;

    this.sprite = scene.add.image(x, y, type);
    this.sprite.setScale(this.size / 8);
    this.sprite.setDepth(3);
    if (isElite) {
      this.glow = scene.add.circle(x, y, this.size + 4, 0xffd700, 0.3);
      this.glow.setDepth(2);
    }
    this.x = x;
    this.y = y;

    if (isElite || this.def.hp > 50) {
      this.hpBarBg = scene.add.rectangle(x, y - this.size - 6, this.size * 2, 3, 0x000000);
      this.hpBar = scene.add.rectangle(x, y - this.size - 6, this.size * 2, 3, 0xff0000);
      this.hpBar.setOrigin(0.5, 0.5);
      this.hpBarBg.setOrigin(0.5, 0.5);
      this.hpBar.setDepth(4);
      this.hpBarBg.setDepth(4);
    }
  }

  update(dt, player, collisionSystem) {
    if (!this.active || this.shouldDestroy) return;

    const px = player.x;
    const py = player.y;
    const dist = MathUtils.distance(this.x, this.y, px, py);

    this.animTimer += dt;
    const bob = Math.sin(this.animTimer / 200) * 1.5;

    if (this.behavior === "phase") {
      this.phaseTimer += dt;
      if (this.phaseTimer > (this.def.phaseInterval || 2000)) {
        this.phaseTimer = 0;
        this.phaseVisible = !this.phaseVisible;
        this.sprite.setAlpha(this.phaseVisible ? 1 : 0.2);
      }
    }

    if (this.behavior === "spawner") {
      this.spawnTimer += dt;
      if (this.spawnTimer > (this.def.spawnInterval || 4000)) {
        this.spawnTimer = 0;
        this.scene.spawnEnemy(this.def.spawnType || "maggot", this.x, this.y);
      }
    }

    if (this.behavior === "swarm" || this.behavior === "chase" || this.behavior === "slow_chase") {
      if (dist > 10) {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        this.x += Math.cos(angle) * this.speed * (dt / 1000);
        this.y += Math.sin(angle) * this.speed * (dt / 1000);
        this.facing = Math.cos(angle) < 0 ? -1 : 1;
      }
    } else if (this.behavior === "strafe") {
      const angle = MathUtils.angleTo(this.x, this.y, px, py);
      const perp = angle + Math.PI / 2;
      this.x += Math.cos(perp) * this.speed * (dt / 1000);
      this.y += Math.sin(perp) * this.speed * (dt / 1000);
      this.x += Math.cos(angle) * this.speed * 0.3 * (dt / 1000);
      this.y += Math.sin(angle) * this.speed * 0.3 * (dt / 1000);
      this.facing = Math.cos(angle) < 0 ? -1 : 1;
    } else if (this.behavior === "ranged") {
      if (dist > 120) {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        this.x += Math.cos(angle) * this.speed * (dt / 1000);
        this.y += Math.sin(angle) * this.speed * (dt / 1000);
        this.facing = Math.cos(angle) < 0 ? -1 : 1;
      }
    } else if (this.behavior === "charge") {
      if (!this.chargeTarget) {
        this.chargeTarget = { x: px, y: py };
        this.chargeTimer = 0;
      }
      this.chargeTimer += dt;
      if (this.chargeTimer < 1000) {
        this.sprite.setTint(0xffaa00);
      } else if (this.chargeTimer < 2000) {
        const angle = MathUtils.angleTo(this.x, this.y, this.chargeTarget.x, this.chargeTarget.y);
        this.x += Math.cos(angle) * this.speed * 2.5 * (dt / 1000);
        this.y += Math.sin(angle) * this.speed * 2.5 * (dt / 1000);
        this.facing = Math.cos(angle) < 0 ? -1 : 1;
      } else {
        this.chargeTarget = null;
        this.chargeTimer = 0;
        this.sprite.clearTint();
      }
    }

    if (this.chillTimer > 0) this.chillTimer -= dt;

    this.sprite.setPosition(this.x, this.y + bob);
    this.sprite.setScale(Math.abs(this.sprite.scaleX) * this.facing, Math.abs(this.sprite.scaleY));
    if (this.glow) this.glow.setPosition(this.x, this.y + bob);

    if (this.hpBar) {
      this.hpBarBg.setPosition(this.x, this.y - this.size - 6);
      this.hpBar.setPosition(this.x, this.y - this.size - 6);
      this.hpBar.setScale(this.hp / this.maxHp, 1);
    }

    if (dist < this.size + 12 && this.phaseVisible) {
      player.takeDamage(this.damage);
      if (this.def.chillOnHit) {
        player.speed = player.baseSpeed * 0.7;
        this.scene.time.delayedCall(1500, () => { if (player) player.speed = player.baseSpeed; });
      }
    }

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    this.x = Math.max(this.size, Math.min(w - this.size, this.x));
    this.y = Math.max(this.size, Math.min(h - this.size, this.y));
  }

  takeDamage(amount) {
    if (!this.active) return;
    this.hp -= amount;
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => {
      if (this.sprite && this.active) this.sprite.clearTint();
    });

    this.scene.pools.spawnDamageNumber(this.x, this.y - this.size - 5, Math.floor(amount), false);

    if (this.hp <= 0) this.die();
  }

  die() {
    this.active = false;
    this.shouldDestroy = true;
    this.sprite.destroy();
    if (this.glow) this.glow.destroy();
    if (this.hpBar) { this.hpBar.destroy(); this.hpBarBg.destroy(); }

    if (this.scene.runState.weapons["corpse_explosion"]) {
      const lvl = this.scene.runState.weapons["corpse_explosion"];
      const def = this.scene.runState.weaponDefs["corpse_explosion"];
      const scaling = def.scaling[Math.min(lvl - 1, def.scaling.length - 1)];
      const dmg = scaling.damage * this.scene.runState.getStatMult("damageMult");
      const nearby = this.scene.collisionSystem.query(this.x, this.y, 40 * this.scene.runState.getStatMult("areaMult"));
      for (const e of nearby) {
        if (e !== this && e.takeDamage) e.takeDamage(dmg);
      }
      const boom = this.scene.add.image(this.x, this.y, "explosion");
      boom.setScale(0.5);
      this.scene.tweens.add({ targets: boom, scale: 1.5, alpha: 0, duration: 300, onComplete: () => boom.destroy() });
    }

    this.scene.dropPickup(this.x, this.y, "xp", this.xp);
    if (this.isElite || Math.random() < 0.3) {
      this.scene.dropPickup(this.x, this.y, "gold", Math.floor(this.xp * 0.5));
    }
    if (Math.random() < 0.08) {
      this.scene.dropPickup(this.x, this.y, "health", 20);
    }

    this.scene.audio.playSfx("enemy_death");
    this.scene.events.emit("enemy_death", this);
  }
}
