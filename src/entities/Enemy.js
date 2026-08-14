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
    this._baseScale = this.size / 8;

    this.sprite = scene.add.image(x, y, type);
    this.sprite.setScale(0);
    this.sprite.setDepth(3);

    // Spawn animation
    scene.juice.animateSpawn(this.sprite, () => {
      scene.juice.animateIdle(this.sprite, this._baseScale, 1.2, 0.02);
    });

    // Elite glow
    if (isElite) {
      this.glow = scene.add.circle(x, y, this.size + 4, 0xffd700, 0.3);
      this.glow.setDepth(2);
      // Pulsing elite glow
      scene.tweens.add({
        targets: this.glow,
        alpha: { from: 0.2, to: 0.5 },
        scale: { from: 1, to: 1.2 },
        duration: 800,
        yoyo: true,
        repeat: -1
      });
      scene.juice.eliteSpawnFlash(x, y);
    }

    this.x = x;
    this.y = y;

    // Health bar
    if (isElite || this.def.hp > 50) {
      this.hpBarBg = scene.add.rectangle(x, y - this.size - 8, this.size * 2.5, 4, 0x000000, 0.7);
      this.hpBar = scene.add.rectangle(x - this.size * 1.25, y - this.size - 8, this.size * 2.5, 4, isElite ? 0xFFD700 : 0xff0000);
      this.hpBar.setOrigin(0, 0.5);
      this.hpBarBg.setOrigin(0, 0.5);
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
    const bob = Math.sin(this.animTimer / 250) * 1.5;

    if (this.behavior === "phase") {
      this.phaseTimer += dt;
      if (this.phaseTimer > (this.def.phaseInterval || 2000)) {
        this.phaseTimer = 0;
        this.phaseVisible = !this.phaseVisible;
        this.scene.tweens.add({
          targets: this.sprite,
          alpha: this.phaseVisible ? 1 : 0.15,
          duration: 200
        });
      }
    }

    if (this.behavior === "spawner") {
      this.spawnTimer += dt;
      if (this.spawnTimer > (this.def.spawnInterval || 4000)) {
        this.spawnTimer = 0;
        this.scene.spawnEnemy(this.def.spawnType || "maggot", this.x, this.y);
      }
    }

    let moving = false;
    if (this.behavior === "swarm" || this.behavior === "chase" || this.behavior === "slow_chase") {
      if (dist > 10) {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        this.x += Math.cos(angle) * this.speed * (dt / 1000);
        this.y += Math.sin(angle) * this.speed * (dt / 1000);
        this.facing = Math.cos(angle) < 0 ? -1 : 1;
        moving = true;
      }
    } else if (this.behavior === "strafe") {
      const angle = MathUtils.angleTo(this.x, this.y, px, py);
      const perp = angle + Math.PI / 2;
      this.x += Math.cos(perp) * this.speed * (dt / 1000);
      this.y += Math.sin(perp) * this.speed * (dt / 1000);
      this.x += Math.cos(angle) * this.speed * 0.3 * (dt / 1000);
      this.y += Math.sin(angle) * this.speed * 0.3 * (dt / 1000);
      this.facing = Math.cos(angle) < 0 ? -1 : 1;
      moving = true;
    } else if (this.behavior === "ranged") {
      if (dist > 120) {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        this.x += Math.cos(angle) * this.speed * (dt / 1000);
        this.y += Math.sin(angle) * this.speed * (dt / 1000);
        this.facing = Math.cos(angle) < 0 ? -1 : 1;
        moving = true;
      }
    } else if (this.behavior === "charge") {
      if (!this.chargeTarget) {
        this.chargeTarget = { x: px, y: py };
        this.chargeTimer = 0;
        // Charge wind-up: red pulse
        this.scene.tweens.add({
          targets: this.sprite,
          tint: { from: 0xffffff, to: 0xff0000 },
          duration: 300,
          yoyo: true,
          repeat: 2
        });
      }
      this.chargeTimer += dt;
      if (this.chargeTimer < 1000) {
        // Wind up - shake in place
        this.sprite.x = this.x + (Math.random() - 0.5) * 2;
      } else if (this.chargeTimer < 2000) {
        const angle = MathUtils.angleTo(this.x, this.y, this.chargeTarget.x, this.chargeTarget.y);
        this.x += Math.cos(angle) * this.speed * 2.5 * (dt / 1000);
        this.y += Math.sin(angle) * this.speed * 2.5 * (dt / 1000);
        this.facing = Math.cos(angle) < 0 ? -1 : 1;
        // Trail dust
        if (Math.random() < 0.3) {
          this.scene.juice.spawnTrail(this.x, this.y, 0x8B4513, 0.3, 150);
        }
      } else {
        this.chargeTarget = null;
        this.chargeTimer = 0;
        this.sprite.clearTint();
      }
    }

    if (this.chillTimer > 0) this.chillTimer -= dt;

    // Apply position with bob
    this.sprite.setPosition(this.x, this.y + bob);
    // Flip based on facing
    const scaleX = Math.abs(this._baseScale) * this.facing;
    const scaleY = this._baseScale + (moving ? Math.sin(this.animTimer / 100) * 0.03 : 0);
    this.sprite.setScale(scaleX, scaleY);

    if (this.glow) this.glow.setPosition(this.x, this.y + bob);

    if (this.hpBar) {
      this.hpBarBg.setPosition(this.x - this.size * 1.25, this.y - this.size - 8);
      this.hpBar.setPosition(this.x - this.size * 1.25, this.y - this.size - 8);
      const hpPct = Math.max(0, this.hp / this.maxHp);
      this.hpBar.setScale(hpPct, 1);
      // HP bar color shift on low health
      if (hpPct < 0.3) this.hpBar.setFillStyle(0xff0000);
    }

    // Collision with player
    if (dist < this.size + 12 && this.phaseVisible) {
      player.takeDamage(this.damage);
      if (this.def.chillOnHit) {
        player.speed = player.baseSpeed * 0.7;
        this.scene.time.delayedCall(1500, () => { if (player) player.speed = player.baseSpeed; });
      }
    }

    // Bounds
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    this.x = Math.max(this.size, Math.min(w - this.size, this.x));
    this.y = Math.max(this.size, Math.min(h - this.size, this.y));
  }

  takeDamage(amount, sourceX, sourceY) {
    if (!this.active) return;
    this.hp -= amount;

    // Juice: hit flash
    this.scene.juice.hitFlash(this.sprite, 0xffffff, 100);
    // Juice: knockback
    if (sourceX !== undefined) {
      this.scene.juice.knockback(this, sourceX, sourceY, 8, 100);
    }
    // Juice: damage number
    this.scene.juice.damageArc(this.x, this.y - this.size, Math.floor(amount), false);
    // Juice: blood splatter
    this.scene.juice.bloodSplatter(this.x, this.y, 4);
    // Juice: screen shake for elites
    if (this.isElite) {
      this.scene.juice.screenShake(2, 80);
    }

    if (this.hp <= 0) this.die();
  }

  die() {
    this.active = false;
    this.shouldDestroy = true;

    // Juice: death burst
    this.scene.juice.deathBurst(this.x, this.y, this.color, this.isElite ? 12 : 6, this.isElite ? 4 : 2);
    this.scene.juice.bloodSplatter(this.x, this.y, this.isElite ? 10 : 5);
    if (this.isElite) {
      this.scene.juice.screenShake(5, 200);
    }

    // Juice: scale fade death
    this.scene.juice.deathScaleFade(this.sprite, () => {
      this.sprite.destroy();
      if (this.glow) this.glow.destroy();
      if (this.hpBar) { this.hpBar.destroy(); this.hpBarBg.destroy(); }
    });

    // Corpse explosion check
    if (this.scene.runState.weapons["corpse_explosion"]) {
      const lvl = this.scene.runState.weapons["corpse_explosion"];
      const def = this.scene.runState.weaponDefs["corpse_explosion"];
      const scaling = def.scaling[Math.min(lvl - 1, def.scaling.length - 1)];
      const dmg = scaling.damage * this.scene.runState.getStatMult("damageMult");
      const nearby = this.scene.collisionSystem.query(this.x, this.y, 40 * this.scene.runState.getStatMult("areaMult"));
      for (const e of nearby) {
        if (e !== this && e.takeDamage) e.takeDamage(dmg, this.x, this.y);
      }
      const boom = this.scene.add.image(this.x, this.y, "explosion");
      boom.setScale(0.5);
      this.scene.tweens.add({ targets: boom, scale: 1.5, alpha: 0, duration: 300, onComplete: () => boom.destroy() });
      this.scene.juice.deathBurst(this.x, this.y, 0xFF4500, 8, 3);
    }

    // Drops
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
