import { MathUtils } from "../utils/MathUtils.js";

/**
 * Central animation and juice coordinator.
 * Handles hit flashes, death bursts, screen shake, knockback, trails,
 * spawn effects, impact sparks, heal pulses, and cinematic sequences.
 */
export class JuiceSystem {
  constructor(scene) {
    this.scene = scene;
    this.trails = [];
    this.particles = [];
    this.shakeIntensity = 0;
    this.slowMoFactor = 1;
    this.hitStopFrames = 0;
  }

  update(dt) {
    // Hit stop (freeze frame)
    if (this.hitStopFrames > 0) {
      this.hitStopFrames -= dt;
      this.scene.physics.world.pause();
      return false; // signal: skip frame
    } else {
      this.scene.physics.world.resume();
    }

    // Slow motion
    if (this.slowMoFactor !== 1) {
      dt *= this.slowMoFactor;
    }

    // Screen shake decay
    if (this.shakeIntensity > 0) {
      const cam = this.scene.cameras.main;
      cam.setScroll(
        cam.scrollX + (Math.random() - 0.5) * this.shakeIntensity,
        cam.scrollY + (Math.random() - 0.5) * this.shakeIntensity
      );
      this.shakeIntensity *= 0.9;
      if (this.shakeIntensity < 0.3) {
        this.shakeIntensity = 0;
        cam.setScroll(0, 0);
      }
    }

    // Update trails
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const t = this.trails[i];
      t.life -= dt;
      t.sprite.setAlpha(t.life / t.maxLife);
      t.sprite.setScale(t.life / t.maxLife * t.maxScale);
      if (t.life <= 0) {
        t.sprite.destroy();
        this.trails.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * (dt / 1000);
      p.y += p.vy * (dt / 1000);
      p.vy += p.gravity * (dt / 1000);
      p.vx *= p.friction;
      p.sprite.setPosition(p.x, p.y);
      p.sprite.setAlpha(p.life / p.maxLife);
      p.sprite.setRotation(p.sprite.rotation + p.rotSpeed * (dt / 1000));
      if (p.life <= 0) {
        p.sprite.destroy();
        this.particles.splice(i, 1);
      }
    }

    return true;
  }

  // ===== ENTITY ANIMATIONS =====

  animateIdle(sprite, baseScale = 1, speed = 1, amount = 0.03) {
    if (sprite._idleTween) sprite._idleTween.stop();
    sprite._idleTween = this.scene.tweens.add({
      targets: sprite,
      scaleY: baseScale + amount,
      scaleX: baseScale - amount * 0.5,
      duration: 600 / speed,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  animateBob(sprite, speed = 1, amount = 2) {
    if (sprite._bobTween) sprite._bobTween.stop();
    const baseY = sprite.y;
    sprite._bobTween = this.scene.tweens.add({
      targets: sprite,
      y: baseY + amount,
      duration: 800 / speed,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  animateSpawn(sprite, onComplete) {
    sprite.setScale(0);
    sprite.setAlpha(0);
    this.scene.tweens.add({
      targets: sprite,
      scale: sprite._baseScale || 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
      onComplete
    });
  }

  // ===== HIT / DAMAGE =====

  hitFlash(sprite, color = 0xffffff, duration = 80) {
    if (!sprite || !sprite.active) return;
    sprite.setTint(color);
    this.scene.time.delayedCall(duration, () => {
      if (sprite && sprite.active) sprite.clearTint();
    });
  }

  hitStop(frames = 3) {
    this.hitStopFrames = frames * 16;
  }

  screenShake(intensity = 5, duration = 200) {
    this.shakeIntensity = intensity;
    this.scene.time.delayedCall(duration, () => {
      this.shakeIntensity = 0;
      this.scene.cameras.main.setScroll(0, 0);
    });
  }

  knockback(entity, fromX, fromY, distance = 20, duration = 150) {
    const angle = MathUtils.angleTo(fromX, fromY, entity.x, entity.y);
    const tx = entity.x + Math.cos(angle) * distance;
    const ty = entity.y + Math.sin(angle) * distance;
    const proxy = { x: entity.x, y: entity.y };
    this.scene.tweens.add({
      targets: proxy,
      x: tx,
      y: ty,
      duration,
      ease: "Power2",
      onUpdate: () => {
        entity.x = proxy.x;
        entity.y = proxy.y;
        if (entity.sprite) entity.sprite.setPosition(entity.x, entity.y);
        if (entity.glow) entity.glow.setPosition(entity.x, entity.y);
        if (entity.hpBar) {
          entity.hpBar.setPosition(entity.x - entity.size * 1.25, entity.y - entity.size - 8);
          entity.hpBarBg.setPosition(entity.x - entity.size * 1.25, entity.y - entity.size - 8);
        }
      }
    });
  }

  damageArc(x, y, amount, isCrit = false) {
    const text = this.scene.add.text(x, y - 10, isCrit ? `CRIT ${amount}` : `${amount}`, {
      fontSize: isCrit ? "14px" : "10px",
      color: isCrit ? "#ffaa00" : "#ffffff",
      fontStyle: isCrit ? "bold" : "normal",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100);

    this.scene.tweens.add({
      targets: text,
      y: y - 40,
      alpha: 0,
      duration: 800,
      ease: "Power2",
      onComplete: () => text.destroy()
    });

    if (isCrit) {
      this.scene.tweens.add({
        targets: text,
        scale: 1.5,
        duration: 200,
        yoyo: true
      });
    }
  }

  // ===== DEATH / DESTRUCTION =====

  deathBurst(x, y, color, count = 8, size = 3) {
    for (let i = 0; i < count; i++) {
      const angle = MathUtils.randomRange(0, Math.PI * 2);
      const speed = MathUtils.randomRange(30, 80);
      this.spawnParticle(x, y, color, size, Math.cos(angle) * speed, Math.sin(angle) * speed, 600);
    }
  }

  deathScaleFade(sprite, onComplete) {
    this.scene.tweens.add({
      targets: sprite,
      scale: sprite.scale * 1.3,
      alpha: 0,
      duration: 250,
      ease: "Power2",
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }

  bloodSplatter(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = MathUtils.randomRange(0, Math.PI * 2);
      const speed = MathUtils.randomRange(20, 60);
      this.spawnParticle(x, y, 0x8B0000, MathUtils.randomRange(2, 4), Math.cos(angle) * speed, Math.sin(angle) * speed, 500);
    }
  }

  // ===== PROJECTILE TRAILS & IMPACTS =====

  spawnTrail(x, y, color, scale = 0.3, life = 200) {
    const trail = this.scene.add.circle(x, y, 2, color);
    trail.setScale(scale);
    trail.setDepth(3);
    this.trails.push({ sprite: trail, life, maxLife: life, maxScale: scale });
  }

  impactBurst(x, y, color, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = MathUtils.randomRange(0, Math.PI * 2);
      const speed = MathUtils.randomRange(40, 100);
      this.spawnParticle(x, y, color, MathUtils.randomRange(1, 3), Math.cos(angle) * speed, Math.sin(angle) * speed, 400);
    }
  }

  muzzleFlash(x, y, color, scale = 0.5) {
    const flash = this.scene.add.circle(x, y, 8, color);
    flash.setScale(scale);
    flash.setDepth(6);
    this.scene.tweens.add({
      targets: flash,
      scale: scale * 2,
      alpha: 0,
      duration: 100,
      onComplete: () => flash.destroy()
    });
  }

  // ===== PICKUP EFFECTS =====

  collectBurst(x, y, color) {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      this.spawnParticle(x, y, color, 2, Math.cos(angle) * 50, Math.sin(angle) * 50, 300);
    }
  }

  magnetTrail(pickupSprite, playerX, playerY) {
    if (Math.random() < 0.3) {
      this.spawnTrail(pickupSprite.x, pickupSprite.y, 0x00ffff, 0.2, 150);
    }
  }

  // ===== BOSS CINEMATICS =====

  bossIntroCinematic(bossSprite, bossName, onComplete) {
    const cam = this.scene.cameras.main;
    const originalZoom = cam.zoom;

    // Flash
    const flash = this.scene.add.rectangle(0, 0, this.scene.scale.width * 2, this.scene.scale.height * 2, 0xffffff);
    flash.setDepth(200);
    flash.setAlpha(0.8);

    // Zoom in
    this.scene.tweens.add({
      targets: cam,
      zoom: 1.3,
      duration: 1500,
      ease: "Power2"
    });

    // Boss name
    const nameText = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2 - 40, bossName, {
      fontSize: "24px", color: "#ff0000", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 4
    }).setOrigin(0.5).setDepth(201).setAlpha(0);

    const titleText = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2, "HAS ARRIVED", {
      fontSize: "12px", color: "#ff6666"
    }).setOrigin(0.5).setDepth(201).setAlpha(0);

    // Sequence
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        flash.destroy();
        this.scene.tweens.add({
          targets: [nameText, titleText],
          alpha: 1,
          duration: 300
        });
        this.scene.time.delayedCall(2000, () => {
          this.scene.tweens.add({
            targets: [nameText, titleText],
            alpha: 0,
            duration: 300,
            onComplete: () => {
              nameText.destroy();
              titleText.destroy();
              this.scene.tweens.add({
                targets: cam,
                zoom: originalZoom,
                duration: 800,
                ease: "Power2",
                onComplete
              });
            }
          });
        });
      }
    });

    // Boss spawn animation
    bossSprite.setScale(0);
    bossSprite.setAlpha(0);
    this.scene.tweens.add({
      targets: bossSprite,
      scale: bossSprite._baseScale || 0.3,
      alpha: 1,
      duration: 1000,
      ease: "Elastic.easeOut",
      delay: 300
    });
  }

  bossPhaseTransition(bossSprite, newColor) {
    const flash = this.scene.add.circle(bossSprite.x, bossSprite.y, 60, 0xffffff);
    flash.setDepth(100);
    this.scene.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy()
    });
    this.screenShake(8, 300);
    bossSprite.setTint(newColor);
    this.scene.time.delayedCall(200, () => bossSprite.clearTint());
  }

  bossDeathCinematic(bossSprite, onComplete) {
    this.slowMoFactor = 0.3;
    this.screenShake(15, 1000);

    // Multiple explosions
    for (let i = 0; i < 5; i++) {
      this.scene.time.delayedCall(i * 200, () => {
        const ox = bossSprite.x + MathUtils.randomRange(-30, 30);
        const oy = bossSprite.y + MathUtils.randomRange(-30, 30);
        const boom = this.scene.add.image(ox, oy, "explosion");
        boom.setScale(0.3);
        boom.setAlpha(0.9);
        this.scene.tweens.add({
          targets: boom,
          scale: 1.5,
          alpha: 0,
          duration: 400,
          onComplete: () => boom.destroy()
        });
        this.deathBurst(ox, oy, 0xFF4500, 10, 4);
      });
    }

    // Fade boss
    this.scene.tweens.add({
      targets: bossSprite,
      alpha: 0,
      scale: bossSprite.scale * 1.5,
      duration: 1500,
      ease: "Power2",
      onComplete: () => {
        this.slowMoFactor = 1;
        if (onComplete) onComplete();
      }
    });
  }

  // ===== PLAYER EFFECTS =====

  playerHitFlash(playerSprite) {
    this.hitFlash(playerSprite, 0xff0000, 120);
    this.screenShake(4, 150);
    // Red vignette
    const vignette = this.scene.add.rectangle(
      this.scene.scale.width / 2, this.scene.scale.height / 2,
      this.scene.scale.width, this.scene.scale.height, 0xff0000, 0.2
    );
    vignette.setDepth(50);
    this.scene.tweens.add({
      targets: vignette,
      alpha: 0,
      duration: 300,
      onComplete: () => vignette.destroy()
    });
  }

  playerDeath(playerSprite, onComplete) {
    this.slowMoFactor = 0.2;
    this.screenShake(10, 800);
    this.deathBurst(playerSprite.x, playerSprite.y, 0x8B0000, 15, 4);
    this.scene.tweens.add({
      targets: playerSprite,
      alpha: 0,
      scale: 0.1,
      rotation: Math.PI * 2,
      duration: 800,
      ease: "Power2",
      onComplete: () => {
        this.slowMoFactor = 1;
        if (onComplete) onComplete();
      }
    });
  }

  // ===== LEVEL UP / CHEST =====

  levelUpFlash() {
    const flash = this.scene.add.rectangle(0, 0, this.scene.scale.width * 2, this.scene.scale.height * 2, 0x00aaff);
    flash.setDepth(200);
    flash.setAlpha(0.5);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy()
    });
    // Particles ring
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      this.spawnParticle(
        this.scene.scale.width / 2, this.scene.scale.height / 2,
        0x00aaff, 3, Math.cos(angle) * 80, Math.sin(angle) * 80, 600
      );
    }
  }

  chestOpenBurst(x, y) {
    this.screenShake(3, 200);
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i;
      const speed = MathUtils.randomRange(40, 100);
      const color = Math.random() > 0.5 ? 0xFFD700 : 0x00aaff;
      this.spawnParticle(x, y, color, MathUtils.randomRange(2, 5), Math.cos(angle) * speed, Math.sin(angle) * speed, 700);
    }
    // Gold text popup
    const goldText = this.scene.add.text(x, y - 20, "LOOT!", {
      fontSize: "16px", color: "#FFD700", fontStyle: "bold",
      stroke: "#000000", strokeThickness: 3
    }).setOrigin(0.5).setDepth(100);
    this.scene.tweens.add({
      targets: goldText,
      y: y - 60,
      alpha: 0,
      duration: 1000,
      onComplete: () => goldText.destroy()
    });
  }

  // ===== ELITE SPAWN =====

  eliteSpawnFlash(x, y) {
    const flash = this.scene.add.circle(x, y, 20, 0xFFD700);
    flash.setDepth(100);
    this.scene.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy()
    });
    this.screenShake(3, 150);
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      this.spawnParticle(x, y, 0xFFD700, 3, Math.cos(angle) * 60, Math.sin(angle) * 60, 400);
    }
  }

  // ===== UTILITY =====

  spawnParticle(x, y, color, size, vx, vy, life, gravity = 80, friction = 0.98) {
    const sprite = this.scene.add.circle(x, y, size, color);
    sprite.setDepth(5);
    this.particles.push({
      sprite, x, y, vx, vy, life, maxLife: life,
      gravity, friction, rotSpeed: MathUtils.randomRange(-5, 5)
    });
  }

  setSlowMo(factor, duration) {
    this.slowMoFactor = factor;
    this.scene.time.delayedCall(duration, () => {
      this.slowMoFactor = 1;
    });
  }
}
