import { CONSTANTS } from "../config/GameConfig.js";
import { CLASSES } from "../data/classes.js";
import { MathUtils } from "../utils/MathUtils.js";

export class Player {
  constructor(scene, x, y, classKey, runState) {
    this.scene = scene;
    this.runState = runState;
    this.classDef = CLASSES[classKey];
    this.classKey = classKey;

    const stats = this.classDef.stats;
    const upgrades = this.runState.saveData.upgrades;

    this.maxHp = CONSTANTS.PLAYER_BASE_HP * stats.maxHpMult * (1 + upgrades.vitality * 0.1);
    this.hp = this.maxHp;
    this.baseSpeed = CONSTANTS.PLAYER_BASE_SPEED * stats.speedMult * (1 + upgrades.speed * 0.05);
    this.speed = this.baseSpeed;
    this.damageMult = stats.damageMult * (1 + upgrades.might * 0.1);
    this.cooldownMult = stats.cooldownMult * (1 - (upgrades.meditation || 0) * 0.05);
    this.areaMult = stats.areaMult;
    this.xpMult = stats.xpMult * (1 + upgrades.growth * 0.1);
    this.critChance = stats.critChance + (upgrades.lucky_charm || 0) * 0.05;
    this.armor = upgrades.armor || 0;
    this.magnetMult = 1 + (upgrades.magnet || 0) * 0.25;
    this.goldMult = 1 + (upgrades.greed || 0) * 0.15;
    this.damageTakenMult = 1 - (upgrades.armor || 0) * 0.05;

    this.sprite = scene.add.image(x, y, `class_${classKey}`);
    this.sprite.setScale(0.12);
    this.sprite.setDepth(5);
    this.x = x;
    this.y = y;
    this.invulnTimer = 0;
    this.inFrostZone = false;
    this.dead = false;
    this.facing = 1;
    this.runCycle = 0;

    this.keys = scene.input.keyboard.addKeys({
      up: "W", down: "S", left: "A", right: "D",
      up2: "UP", down2: "DOWN", left2: "LEFT", right2: "RIGHT"
    });

    // Idle breathing animation
    scene.juice.animateIdle(this.sprite, 0.12, 0.8, 0.01);
  }

  update(dt) {
    if (this.dead) return;

    let dx = 0;
    let dy = 0;
    if (this.keys.up.isDown || this.keys.up2.isDown) dy -= 1;
    if (this.keys.down.isDown || this.keys.down2.isDown) dy += 1;
    if (this.keys.left.isDown || this.keys.left2.isDown) dx -= 1;
    if (this.keys.right.isDown || this.keys.right2.isDown) dx += 1;

    const isMoving = dx !== 0 || dy !== 0;

    if (isMoving) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
      this.facing = dx < 0 ? -1 : 1;

      // Run cycle bob
      this.runCycle += dt;
      const runBob = Math.sin(this.runCycle / 80) * 2;
      this.sprite.y = this.y + runBob;
      // Run lean
      this.sprite.setRotation(dy * 0.05);
    } else {
      // Return to idle
      this.sprite.y = this.y;
      this.sprite.setRotation(0);
    }

    // Flip sprite based on facing
    this.sprite.setScale(0.12 * this.facing, 0.12);

    let moveSpeed = this.speed;
    if (this.inFrostZone) moveSpeed *= 0.6;

    this.x += dx * moveSpeed * (dt / 1000);
    this.y += dy * moveSpeed * (dt / 1000);

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    this.x = Math.max(16, Math.min(w - 16, this.x));
    this.y = Math.max(24, Math.min(h - 24, this.y));

    this.sprite.x = this.x;

    if (this.invulnTimer > 0) {
      this.invulnTimer -= dt;
      this.sprite.setAlpha(0.5 + Math.sin(this.scene.time.now / 50) * 0.3);
    } else {
      this.sprite.setAlpha(1);
    }
  }

  takeDamage(amount) {
    if (this.dead || this.invulnTimer > 0) return;
    const dmg = Math.max(1, amount * this.damageTakenMult - this.armor);
    this.hp -= dmg;
    this.invulnTimer = 500;

    // Juice: player hit
    this.scene.juice.playerHitFlash(this.sprite);
    this.scene.juice.damageArc(this.x, this.y - 20, Math.floor(dmg), false);

    // Knockback from nearest enemy
    const nearest = this.scene.getNearestEnemy(this.x, this.y);
    if (nearest) {
      const angle = MathUtils.angleTo(nearest.x, nearest.y, this.x, this.y);
      this.x += Math.cos(angle) * 10;
      this.y += Math.sin(angle) * 10;
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  heal(amount) {
    const oldHp = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    const healed = this.hp - oldHp;
    if (healed > 0) {
      // Heal popup
      const healText = this.scene.add.text(this.x, this.y - 30, `+${Math.floor(healed)}`, {
        fontSize: "12px", color: "#00ff00", fontStyle: "bold",
        stroke: "#000000", strokeThickness: 2
      }).setOrigin(0.5).setDepth(100);
      this.scene.tweens.add({
        targets: healText,
        y: this.y - 60,
        alpha: 0,
        duration: 800,
        onComplete: () => healText.destroy()
      });
      // Heal pulse
      this.scene.juice.spawnTrail(this.x, this.y, 0x00FF00, 0.5, 300);
    }
  }

  die() {
    this.dead = true;
    this.scene.juice.playerDeath(this.sprite, () => {
      this.scene.events.emit("player_death");
    });
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getHpPercent() {
    return this.hp / this.maxHp;
  }
}
