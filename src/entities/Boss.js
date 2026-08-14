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
    this._baseScale = this.size / 100;

    this.sprite = scene.add.image(x, y, `boss_${bossKey}`);
    this.sprite.setScale(0);
    this.sprite.setDepth(5);

    // Boss aura glow
    this.aura = scene.add.circle(x, y, this.size + 15, this.color, 0.12);
    this.aura.setDepth(4);
    // Pulsing aura
    scene.tweens.add({
      targets: this.aura,
      alpha: { from: 0.08, to: 0.2 },
      scale: { from: 1, to: 1.3 },
      duration: 1200,
      yoyo: true,
      repeat: -1
    });

    // HP bar
    this.hpBarBg = scene.add.rectangle(scene.scale.width / 2, 16, scene.scale.width - 40, 6, 0x000000, 0.8);
    this.hpBar = scene.add.rectangle(scene.scale.width / 2, 16, scene.scale.width - 40, 6, 0xff0000);
    this.hpBar.setOrigin(0.5, 0.5);
    this.hpBarBg.setOrigin(0.5, 0.5);
    this.hpBar.setDepth(10);
    this.hpBarBg.setDepth(10);

    this.nameText = scene.add.text(scene.scale.width / 2, 6, this.def.name, {
      fontSize: "10px", color: "#ff0000", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 2
    }).setOrigin(0.5).setDepth(10);

    // Spawn cinematic
    scene.juice.bossIntroCinematic(this.sprite, this.def.name);
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
    const breathe = 1 + Math.sin(this.animTimer / 500) * 0.04;

    // Phase change detection
    const newPhaseIndex = this.def.phases.indexOf(phase);
    if (newPhaseIndex !== this.phaseIndex) {
      this.phaseIndex = newPhaseIndex;
      this.scene.juice.bossPhaseTransition(this.sprite, this.color);
      this.scene.audio.playSfx("boss_roar");
    }

    // Movement
    if (phase.movePattern === "chase") {
      let spd = this.speed;
      if (phase.speedMult) spd *= phase.speedMult;
      if (dist > 15) {
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
        // Teleport out
        this.scene.tweens.add({
          targets: this.sprite,
          alpha: 0,
          scale: 0.1,
          duration: 300,
          onComplete: () => {
            if (!this.active) return;
            const angle = MathUtils.randomRange(0, Math.PI * 2);
            const dist = MathUtils.randomRange(80, 150);
            this.x = px + Math.cos(angle) * dist;
            this.y = py + Math.sin(angle) * dist;
            this.sprite.setPosition(this.x, this.y);
            this.aura.setPosition(this.x, this.y);
            // Teleport in
            this.scene.tweens.add({
              targets: this.sprite,
              alpha: 1,
              scale: this._baseScale,
              duration: 300,
              ease: "Back.easeOut"
            });
            // Teleport flash
            this.scene.juice.spawnTrail(this.x, this.y, 0x9370DB, 0.8, 400);
            this.scene.audio.playSfx("dash");
          }
        });
      }
    }

    // Attack
    this.attackTimer += dt;
    const atkCd = (this.def.attackCooldown || 2000) / (phase.attackSpeedMult || 1);
    if (this.attackTimer > atkCd) {
      this.attackTimer = 0;
      const attack = phase.attacks[Math.floor(Math.random() * phase.attacks.length)];
      this.executeAttack(attack, player);
    }

    // Summons
    if (phase.summonCount && this.summonTimer > 6000) {
      this.summonTimer = 0;
      for (let i = 0; i < phase.summonCount; i++) {
        const angle = MathUtils.randomRange(0, Math.PI * 2);
        const dist = MathUtils.randomRange(40, 80);
        this.scene.spawnEnemy("skeleton_warrior", this.x + Math.cos(angle) * dist, this.y + Math.sin(angle) * dist);
      }
    }
    this.summonTimer += dt;

    // Collision
    if (dist < this.size + 15) player.takeDamage(this.damage);

    // Frost aura (Duriel)
    if (phase.attacks.includes("frost_aura")) {
      const aura = this.def.auraRadius || 80;
      if (dist < aura) player.speed = player.baseSpeed * (this.def.auraSlow || 0.5);
      else player.speed = player.baseSpeed;
    }

    // Apply transforms
    this.sprite.setPosition(this.x, this.y);
    const scaleX = Math.abs(this._baseScale) * this.facing * breathe;
    const scaleY = this._baseScale * breathe;
    this.sprite.setScale(scaleX, scaleY);
    this.aura.setPosition(this.x, this.y);
    this.hpBar.setScale(Math.max(0, this.hp / this.maxHp), 1);
  }

  executeAttack(attack, player) {
    const px = player.x;
    const py = player.y;
    switch (attack) {
      case "arrow_volley": {
        // Wind up
        this.scene.tweens.add({
          targets: this.sprite,
          scaleY: this._baseScale * 0.8,
          duration: 200,
          yoyo: true
        });
        this.scene.time.delayedCall(200, () => {
          for (let i = -1; i <= 1; i++) {
            const angle = MathUtils.angleTo(this.x, this.y, px, py) + i * 0.3;
            this.scene.pools.spawnProjectile(this.x, this.y, "arrow", 0.6, 120, angle, this.damage, 1);
          }
          this.scene.juice.muzzleFlash(this.x, this.y, 0xFF6600, 0.8);
          this.scene.audio.playSfx("shoot");
        });
        break;
      }
      case "skeleton_summon": {
        this.scene.juice.spawnTrail(this.x, this.y, 0x00FF00, 0.5, 300);
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
        // Telegraph: red glow + shake
        this.scene.tweens.add({
          targets: this.sprite,
          tint: 0xff0000,
          duration: 200,
          yoyo: true,
          repeat: 2
        });
        const indicator = this.scene.add.line(this.x, this.y, 0, 0, px - this.x, py - this.y, 0xff0000, 0.4);
        indicator.setDepth(2);
        this.scene.time.delayedCall(600, () => {
          indicator.destroy();
          if (!this.active) return;
          this.sprite.clearTint();
          const angle = MathUtils.angleTo(this.x, this.y, this.chargeTarget.x, this.chargeTarget.y);
          // Charge!
          const chargeInterval = setInterval(() => {
            if (!this.active) { clearInterval(chargeInterval); return; }
            this.x += Math.cos(angle) * 350 * 0.016;
            this.y += Math.sin(angle) * 350 * 0.016;
            this.chargeTimer += 16;
            // Trail dust
            if (Math.random() < 0.5) {
              this.scene.juice.spawnTrail(this.x, this.y, 0x8B0000, 0.4, 200);
            }
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
        this.scene.juice.muzzleFlash(this.x, this.y, 0x32CD32, 0.7);
        this.scene.audio.playSfx("fireball");
        break;
      }
      case "dash": {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        // Dash blur
        const blur = this.scene.add.image(this.x, this.y, this.sprite.texture.key);
        blur.setScale(this.sprite.scaleX, this.sprite.scaleY);
        blur.setAlpha(0.5);
        blur.setDepth(4);
        this.scene.tweens.add({ targets: blur, alpha: 0, duration: 200, onComplete: () => blur.destroy() });
        this.x += Math.cos(angle) * 80;
        this.y += Math.sin(angle) * 80;
        this.scene.juice.spawnTrail(this.x, this.y, 0x9932CC, 0.6, 300);
        this.scene.audio.playSfx("dash");
        break;
      }
      case "poison_pool": {
        const pool = this.scene.add.image(this.x, this.y, "poison_pool");
        pool.setScale(0);
        pool.setDepth(1);
        pool.setAlpha(0.7);
        this.scene.tweens.add({
          targets: pool,
          scale: 0.8,
          duration: 400,
          ease: "Power2"
        });
        this.scene.time.delayedCall(4000, () => {
          this.scene.tweens.add({ targets: pool, alpha: 0, duration: 300, onComplete: () => pool.destroy() });
        });
        break;
      }
      case "summon_vile_spawn": {
        this.scene.juice.spawnTrail(this.x, this.y, 0x90EE90, 0.5, 300);
        for (let i = 0; i < 3; i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          this.scene.spawnEnemy("maggot", this.x + Math.cos(angle) * 40, this.y + Math.sin(angle) * 40);
        }
        break;
      }
      case "summon_frost_maggots": {
        this.scene.juice.spawnTrail(this.x, this.y, 0x87CEEB, 0.5, 300);
        for (let i = 0; i < 4; i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          this.scene.spawnEnemy("frost_maggot", this.x + Math.cos(angle) * 50, this.y + Math.sin(angle) * 50);
        }
        break;
      }
      case "lightning_orb": {
        const orb = this.scene.pools.spawnProjectile(this.x, this.y, "lightning_bolt", 0.7, 60, MathUtils.angleTo(this.x, this.y, px, py), this.damage, 99);
        orb.slow = true;
        this.scene.juice.muzzleFlash(this.x, this.y, 0xFFFF00, 0.8);
        this.scene.audio.playSfx("fireball");
        break;
      }
      case "ring_of_bolts": {
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i;
          this.scene.pools.spawnProjectile(this.x, this.y, "lightning_bolt", 0.5, 100, angle, this.damage, 2);
        }
        this.scene.juice.screenShake(4, 200);
        this.scene.audio.playSfx("explosion");
        break;
      }
      case "summon_council": {
        this.scene.juice.spawnTrail(this.x, this.y, 0xFFD700, 0.5, 300);
        for (let i = 0; i < 2; i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          this.scene.spawnEnemy("council_member", this.x + Math.cos(angle) * 60, this.y + Math.sin(angle) * 60);
        }
        break;
      }
      case "fire_nova": {
        const nova = this.scene.add.image(this.x, this.y, "explosion");
        nova.setScale(0.1);
        nova.setAlpha(0.8);
        nova.setTint(0xff4400);
        this.scene.tweens.add({
          targets: nova,
          scale: 2.5,
          alpha: 0,
          duration: 600,
          ease: "Power2",
          onComplete: () => nova.destroy()
        });
        this.scene.juice.deathBurst(this.x, this.y, 0xFF4500, 12, 3);
        const dist = MathUtils.distance(this.x, this.y, px, py);
        if (dist < 100) player.takeDamage(this.damage);
        this.scene.juice.screenShake(5, 250);
        this.scene.audio.playSfx("explosion");
        break;
      }
      case "lightning_hose": {
        const angle = MathUtils.angleTo(this.x, this.y, px, py);
        // Rotating beam
        const beam = this.scene.add.line(this.x, this.y, 0, 0, Math.cos(angle) * 150, Math.sin(angle) * 150, 0xffff00, 0.5);
        beam.setDepth(2);
        beam.setLineWidth(4);
        // Pulse width
        this.scene.tweens.add({
          targets: beam,
          lineWidth: 8,
          duration: 100,
          yoyo: true,
          repeat: 4
        });
        this.scene.time.delayedCall(1000, () => beam.destroy());
        if (MathUtils.distance(this.x, this.y, px, py) < 150) {
          const toPlayer = MathUtils.angleTo(this.x, this.y, px, py);
          if (Math.abs(MathUtils.normalizeAngle(toPlayer - angle)) < 0.4) {
            player.takeDamage(this.damage * 2);
            this.scene.juice.screenShake(3, 100);
          }
        }
        break;
      }
      case "apocalypse": {
        this.scene.juice.screenShake(3, 1500);
        for (let i = 0; i < 5; i++) {
          this.scene.time.delayedCall(i * 300, () => {
            const tx = MathUtils.randomRange(20, this.scene.scale.width - 20);
            const ty = MathUtils.randomRange(20, this.scene.scale.height - 20);
            // Warning marker
            const marker = this.scene.add.circle(tx, ty, 12, 0xff0000, 0.3);
            this.scene.tweens.add({
              targets: marker,
              scale: 1.5,
              alpha: 0.6,
              duration: 500,
              yoyo: true,
              repeat: 1
            });
            this.scene.time.delayedCall(1000, () => {
              marker.destroy();
              const blast = this.scene.add.image(tx, ty, "explosion");
              blast.setScale(0.5);
              blast.setAlpha(0.9);
              blast.setTint(0xff0000);
              this.scene.tweens.add({
                targets: blast,
                scale: 1.8,
                alpha: 0,
                duration: 400,
                onComplete: () => blast.destroy()
              });
              this.scene.juice.deathBurst(tx, ty, 0xFF0000, 8, 3);
              if (MathUtils.distance(px, py, tx, ty) < 35) player.takeDamage(this.damage * 1.5);
            });
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

    // Heavy hit juice
    this.scene.juice.hitFlash(this.sprite, 0xffffff, 150);
    this.scene.juice.screenShake(4, 120);
    this.scene.juice.damageArc(this.x, this.y - this.size, Math.floor(amount), false);
    this.scene.juice.bloodSplatter(this.x, this.y, 5);

    // Hit stop on heavy damage
    if (amount > 50) {
      this.scene.juice.hitStop(5);
    }

    // Knockback
    const kbAngle = MathUtils.randomRange(0, Math.PI * 2);
    this.x += Math.cos(kbAngle) * 5;
    this.y += Math.sin(kbAngle) * 5;

    this.scene.audio.playSfx("boss_hit");

    if (this.hp <= 0) this.die();
  }

  die() {
    this.active = false;
    this.shouldDestroy = true;
    this.scene.juice.bossDeathCinematic(this.sprite, () => {
      this.sprite.destroy();
      this.aura.destroy();
      this.hpBar.destroy();
      this.hpBarBg.destroy();
      this.nameText.destroy();
    });
    this.scene.audio.playSfx("boss_death");
    this.scene.events.emit("boss_death", this);
  }
}
