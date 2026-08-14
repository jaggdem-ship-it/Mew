import { BOSSES } from "../data/bosses.js";
import { MathUtils } from "../utils/MathUtils.js";

export class Boss {
  constructor(scene, x, y, bossKey) {
    this.scene = scene;
    this.def = BOSSES[bossKey];
    if (!this.def) throw new Error(`Unknown boss: ${bossKey}`);

    this.hp = this.def.hp;
    this.maxHp = this.hp;
    this.damage = this.def.damage;
    this.speed = this.def.speed;
    this.size = this.def.size;
    this.color = this.def.color;
    this.active = true;
    this.shouldDestroy = false;
    this.phaseIndex = 0;
    this.attackTimer = 0;
    this.summonTimer = 0;
    this.teleportTimer = 0;
    this.chargeTimer = 0;
    this.charging = false;
    this.chargeTarget = null;
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.animTimer = 0;

    this.sprite = scene.add.image(x, y, `boss_${bossKey}`);
    this.sprite.setScale(this.size / 100);
    this.sprite.setDepth(5);

    // Boss glow aura
    this.aura = scene.add.circle(x, y, this.size + 10, this.color, 0.15);
    this.aura.setDepth(4);

    this.hpBarBg = scene.add.rectangle(scene.scale.width / 2, 16, scene.scale.width - 40, 6, 0x000000);
    this.hpBar = scene.add.rectangle(scene.scale.width / 2, 16, scene.scale.width - 40, 6, 0xff0000);
    this.hpBar.setOrigin(0.5, 0.5);
    this.hpBarBg.setOrigin(0.5, 0.5);
    this.hpBar.setDepth(10);
    this.hpBarBg.setDepth(10);

    this.nameText = scene.add.text(scene.scale.width / 2, 6, this.def.name, {
      fontSize: "10px", color: "#ff0000", fontStyle: "bold"
    }).setOrigin(0.5).setDepth(10);
  }

  getCurrentPhase() {
    for (let i = this.def.phases.length - 1; i >= 0; i--) {
      if (this.hp / this.maxHp <= this.def.phases[i].hpThreshold) {
        return this.def.phases[i];
      }
    }
    return this.def.phases[0];
  }

  update(dt, player) {
    if (!this.active || this.shouldDestroy) return;

    const phase = this.getCurrentPhase();
    const px = player.x;
    const py = player.y;
    const dist = MathUtils.distance(this.x, this.y, px, py);

    this.animTimer += dt;
    const breathe = 1 + Math.sin(this.animTimer / 400) * 0.03;

    if (phase.movePattern === "chase") {
      let spd = this.speed;
      if (phase.speedMult) spd *= phase.speedMult;
      if (dist > 10) {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        this.x += Math.cos(angle) * spd * (dt / 1000);
        this.y += Math.sin(angle) * spd * (dt / 1000);
        this.facing = Math.cos(angle) < 0 ? -1 : 1;
      }
    } else if (phase.movePattern === "strafe_edge") {
      const angle = MathUtils.angleTo(this.x, this.y, px, py) + Math.PI / 2;
      this.x += Math.cos(angle) * this.speed * (dt / 1000);
      this.y += Math.sin(angle) * this.speed * (dt / 1000);
      const toPlayer = MathUtils.angleTo(this.x, this.y, px, py);
      this.x += Math.cos(toPlayer) * this.speed * 0.2 * (dt / 1000);
      this.y += Math.sin(toPlayer) * this.speed * 0.2 * (dt / 1000);
      this.facing = Math.cos(toPlayer) < 0 ? -1 : 1;
    } else if (phase.movePattern === "teleport") {
      this.teleportTimer += dt;
      if (this.teleportTimer > 4000) {
        this.teleportTimer = 0;
        this.sprite.setAlpha(0.2);
        this.aura.setAlpha(0.05);
        this.scene.time.delayedCall(500, () => {
          if (!this.active) return;
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          const dist = MathUtils.randomRange(80, 150);
          this.x = px + Math.cos(angle) * dist;
          this.y = py + Math.sin(angle) * dist;
          this.sprite.setAlpha(1);
          this.aura.setAlpha(0.15);
          this.scene.audio.playSfx("dash");
        });
      }
    }

    this.attackTimer += dt;
    const atkCd = (this.def.attackCooldown || 2000) / (phase.attackSpeedMult || 1);
    if (this.attackTimer > atkCd) {
      this.attackTimer = 0;
      const attack = phase.attacks[Math.floor(Math.random() * phase.attacks.length)];
      this.executeAttack(attack, player);
    }

    if (phase.summonCount && this.summonTimer > 6000) {
      this.summonTimer = 0;
      for (let i = 0; i < phase.summonCount; i++) {
        const angle = MathUtils.randomRange(0, Math.PI * 2);
        const dist = MathUtils.randomRange(40, 80);
        this.scene.spawnEnemy("skeleton_warrior", this.x + Math.cos(angle) * dist, this.y + Math.sin(angle) * dist);
      }
    }
    this.summonTimer += dt;

    if (dist < this.size + 12) player.takeDamage(this.damage);

    if (phase.attacks.includes("frost_aura")) {
      const aura = this.def.auraRadius || 80;
      if (dist < aura) player.speed = player.baseSpeed * (this.def.auraSlow || 0.5);
      else player.speed = player.baseSpeed;
    }

    this.sprite.setPosition(this.x, this.y);
    this.sprite.setScale(Math.abs(this.sprite.scaleX) * this.facing * breathe, Math.abs(this.sprite.scaleY) * breathe);
    this.aura.setPosition(this.x, this.y);
    this.hpBar.setScale(this.hp / this.maxHp, 1);
  }

  executeAttack(attack, player) {
    const px = player.x;
    const py = player.y;
    switch (attack) {
      case "arrow_volley": {
        for (let i = -1; i <= 1; i++) {
          const angle = MathUtils.angleTo(this.x, this.y, px, py) + i * 0.3;
          this.scene.pools.spawnProjectile(this.x, this.y, "arrow", 0.6, 120, angle, this.damage, 1);
        }
        this.scene.audio.playSfx("shoot");
        break;
      }
      case "skeleton_summon": {
        for (let i = 0; i < (this.def.summonCount || 3); i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          const dist = MathUtils.randomRange(30, 60);
          this.scene.spawnEnemy("skeleton_warrior", this.x + Math.cos(angle) * dist, this.y + Math.sin(angle) * dist);
        }
        this.scene.audio.playSfx("alert");
        break;
      }
      case "charge": {
        this.charging = true;
        this.chargeTarget = { x: px, y: py };
        this.chargeTimer = 0;
        const indicator = this.scene.add.line(this.x, this.y, 0, 0, px - this.x, py - this.y, 0xff0000, 0.5);
        indicator.setDepth(2);
        this.scene.time.delayedCall(600, () => {
          indicator.destroy();
          if (!this.active) return;
          const angle = MathUtils.angleTo(this.x, this.y, this.chargeTarget.x, this.chargeTarget.y);
          const chargeInterval = setInterval(() => {
            if (!this.active) { clearInterval(chargeInterval); return; }
            this.x += Math.cos(angle) * 300 * 0.016;
            this.y += Math.sin(angle) * 300 * 0.016;
            this.chargeTimer += 16;
            if (this.chargeTimer > 500) { clearInterval(chargeInterval); this.charging = false; }
          }, 16);
        });
        break;
      }
      case "poison_spray": {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        for (let i = -2; i <= 2; i++) {
          this.scene.pools.spawnProjectile(this.x, this.y, "poison_orb", 0.5, 100, angle + i * 0.25, this.damage * 0.5, 2);
        }
        this.scene.audio.playSfx("fireball");
        break;
      }
      case "dash": {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        this.x += Math.cos(angle) * 80;
        this.y += Math.sin(angle) * 80;
        this.scene.audio.playSfx("dash");
        break;
      }
      case "poison_pool": {
        const pool = this.scene.add.image(this.x, this.y, "poison_pool");
        pool.setScale(0.8);
        pool.setDepth(1);
        pool.setAlpha(0.6);
        this.scene.time.delayedCall(4000, () => pool.destroy());
        break;
      }
      case "summon_vile_spawn": {
        for (let i = 0; i < 3; i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          this.scene.spawnEnemy("maggot", this.x + Math.cos(angle) * 40, this.y + Math.sin(angle) * 40);
        }
        break;
      }
      case "summon_frost_maggots": {
        for (let i = 0; i < 4; i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          this.scene.spawnEnemy("frost_maggot", this.x + Math.cos(angle) * 50, this.y + Math.sin(angle) * 50);
        }
        break;
      }
      case "lightning_orb": {
        const orb = this.scene.pools.spawnProjectile(this.x, this.y, "lightning_bolt", 0.7, 60, MathUtils.angleTo(this.x, this.y, px, py), this.damage, 99);
        orb.slow = true;
        this.scene.audio.playSfx("fireball");
        break;
      }
      case "ring_of_bolts": {
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i;
          this.scene.pools.spawnProjectile(this.x, this.y, "lightning_bolt", 0.5, 100, angle, this.damage, 2);
        }
        this.scene.audio.playSfx("explosion");
        break;
      }
      case "summon_council": {
        for (let i = 0; i < 2; i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          this.scene.spawnEnemy("council_member", this.x + Math.cos(angle) * 60, this.y + Math.sin(angle) * 60);
        }
        break;
      }
      case "fire_nova": {
        const nova = this.scene.add.image(this.x, this.y, "explosion");
        nova.setScale(0.3);
        nova.setAlpha(0.7);
        this.scene.tweens.add({
          targets: nova, scale: 2, alpha: 0, duration: 600,
          onComplete: () => nova.destroy()
        });
        const dist = MathUtils.distance(this.x, this.y, px, py);
        if (dist < 100) player.takeDamage(this.damage);
        this.scene.audio.playSfx("explosion");
        break;
      }
      case "lightning_hose": {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        const hose = this.scene.add.line(this.x, this.y, 0, 0, Math.cos(angle) * 150, Math.sin(angle) * 150, 0xffff00, 0.6);
        hose.setDepth(2);
        this.scene.time.delayedCall(1000, () => hose.destroy());
        if (MathUtils.distance(this.x, this.y, px, py) < 150) {
          const toPlayer = MathUtils.angleTo(this.x, this.y, px, py);
          if (Math.abs(MathUtils.normalizeAngle(toPlayer - angle)) < 0.3) player.takeDamage(this.damage * 2);
        }
        break;
      }
      case "apocalypse": {
        for (let i = 0; i < 5; i++) {
          const tx = MathUtils.randomRange(20, this.scene.scale.width - 20);
          const ty = MathUtils.randomRange(20, this.scene.scale.height - 20);
          const marker = this.scene.add.image(tx, ty, "explosion");
          marker.setScale(0.2);
          marker.setAlpha(0.3);
          marker.setTint(0xff0000);
          this.scene.time.delayedCall(1000, () => {
            marker.destroy();
            const blast = this.scene.add.image(tx, ty, "explosion");
            blast.setScale(0.5);
            blast.setAlpha(0.8);
            this.scene.tweens.add({ targets: blast, scale: 1.5, alpha: 0, duration: 300, onComplete: () => blast.destroy() });
            if (MathUtils.distance(px, py, tx, ty) < 30) player.takeDamage(this.damage * 1.5);
          });
        }
        this.scene.audio.playSfx("explosion");
        break;
      }
    }
  }

  takeDamage(amount) {
    if (!this.active) return;
    this.hp -= amount;
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.sprite && this.active) this.sprite.clearTint();
    });
    this.scene.pools.spawnDamageNumber(this.x, this.y - this.size - 5, Math.floor(amount), false);
    this.scene.audio.playSfx("boss_hit");
    this.scene.cameras.main.shake(80, 0.008);

    if (this.hp <= 0) this.die();
  }

  die() {
    this.active = false;
    this.shouldDestroy = true;
    this.sprite.destroy();
    this.aura.destroy();
    this.hpBar.destroy();
    this.hpBarBg.destroy();
    this.nameText.destroy();
    this.scene.audio.playSfx("boss_death");
    this.scene.cameras.main.shake(300, 0.015);
    this.scene.events.emit("boss_death", this);
  }
}
