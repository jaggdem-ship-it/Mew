import { MathUtils } from "../utils/MathUtils.js";
import { CONSTANTS } from "../config/GameConfig.js";

export class Enemy {
  constructor(scene, x, y, type, level, isElite = false) {
    this.scene = scene;
    this.type = type;
    this.level = level;
    this.isElite = isElite;
    this.active = true;
    this.shouldDestroy = false;
    this.isPickup = false;
    this.isBoss = false;

    const baseHp = 20 + level * 8;
    const baseDamage = 8 + level * 2;
    const baseSpeed = 60 + level * 3;

    if (isElite) {
      this.maxHp = baseHp * 3;
      this.hp = this.maxHp;
      this.damage = baseDamage * 1.5;
      this.speed = baseSpeed * 1.2;
      this.size = 14;
      this.xpValue = 15 + level * 3;
      this.goldValue = 5 + level;
      this.contactDamage = this.damage;
    } else {
      this.maxHp = baseHp;
      this.hp = this.maxHp;
      this.damage = baseDamage;
      this.speed = baseSpeed;
      this.size = 10;
      this.xpValue = 5 + level;
      this.goldValue = 1 + Math.floor(level / 2);
      this.contactDamage = this.damage;
    }

    this.x = x;
    this.y = y;
    this.radius = this.size;

    this.sprite = scene.add.image(x, y, type);
    this.sprite.setScale(isElite ? 1.4 : 1.0);
    this.sprite.setDepth(3);
    this.sprite.setVisible(false);

    // Elite glow
    if (isElite) {
      this.glow = scene.add.circle(x, y, this.size + 4, 0xFFD700, 0.3);
      this.glow.setDepth(2);
    }

    // HP bar
    this.hpBarBg = scene.add.rectangle(x - this.size * 1.25, y - this.size - 8, this.size * 2.5, 4, 0x000000);
    this.hpBar = scene.add.rectangle(x - this.size * 1.25, y - this.size - 8, this.size * 2.5, 4, 0xFF0000);
    this.hpBarBg.setDepth(10);
    this.hpBar.setDepth(11);
    this.hpBarBg.setVisible(false);
    this.hpBar.setVisible(false);

    // Idle breathing
    scene.juice.animateIdle(this.sprite, isElite ? 0.18 : 0.12, isElite ? 1.0 : 0.8, 0.01);
  }

  update(dt) {
    if (!this.active) return;

    const player = this.scene.player;
    if (!player || player.dead) return;

    // Steering: seek player with obstacle avoidance
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      dx /= dist;
      dy /= dist;
    }

    // Obstacle avoidance raycasts
    const tm = this.scene.tileMap;
    if (tm) {
      const avoidStrength = 2.0;
      const rayLen = 40;

      // Forward ray
      const fx = this.x + dx * rayLen;
      const fy = this.y + dy * rayLen;
      if (tm.isBlocked(fx, fy)) {
        // Turn left or right based on which is clearer
        const lx = this.x + (dx * 0.7 - dy * 0.7) * rayLen;
        const ly = this.y + (dy * 0.7 + dx * 0.7) * rayLen;
        const rx = this.x + (dx * 0.7 + dy * 0.7) * rayLen;
        const ry = this.y + (dy * 0.7 - dx * 0.7) * rayLen;
        const leftClear = !tm.isBlocked(lx, ly);
        const rightClear = !tm.isBlocked(rx, ry);

        if (leftClear && !rightClear) {
          dx = dx * 0.5 - dy * 0.5;
          dy = dy * 0.5 + dx * 0.5;
        } else if (rightClear && !leftClear) {
          dx = dx * 0.5 + dy * 0.5;
          dy = dy * 0.5 - dx * 0.5;
        } else {
          // Both blocked, back up
          dx = -dx * 0.3;
          dy = -dy * 0.3;
        }
      }
    }

    // Normalize after steering adjustments
    const speed = this.speed * (dt / 1000);
    const moveLen = Math.sqrt(dx * dx + dy * dy);
    if (moveLen > 0) {
      dx = (dx / moveLen) * speed;
      dy = (dy / moveLen) * speed;
    }

    let nextX = this.x + dx;
    let nextY = this.y + dy;

    // Apply movement with obstacle sliding
    if (tm) {
      if (!tm.isBlocked(nextX, this.y)) {
        this.x = nextX;
      }
      if (!tm.isBlocked(this.x, nextY)) {
        this.y = nextY;
      }
    } else {
      this.x = nextX;
      this.y = nextY;
    }

    // Face movement direction
    if (dx !== 0) {
      this.sprite.setScale(dx < 0 ? -1 : 1, 1);
    }

    this.sprite.setPosition(this.x, this.y);
    if (this.glow) this.glow.setPosition(this.x, this.y);

    // Update HP bar
    const hpPercent = this.hp / this.maxHp;
    this.hpBar.width = this.size * 2.5 * hpPercent;
    this.hpBarBg.setPosition(this.x - this.size * 1.25, this.y - this.size - 8);
    this.hpBar.setPosition(this.x - this.size * 1.25 + (this.size * 2.5 * (1 - hpPercent)) / 2, this.y - this.size - 8);
  }

  setVisible(visible) {
    this.sprite.setVisible(visible);
    if (this.glow) this.glow.setVisible(visible);
    if (this.hpBar) this.hpBar.setVisible(visible && this.hp < this.maxHp);
    if (this.hpBarBg) this.hpBarBg.setVisible(visible && this.hp < this.maxHp);
  }

  takeDamage(amount, sourceX, sourceY) {
    if (!this.active) return;

    const isCrit = Math.random() < this.scene.player.critChance;
    const finalDmg = isCrit ? amount * 2 : amount;
    this.hp -= finalDmg;

    // Show damage number
    this.scene.pools.spawnDamageNumber(this.x, this.y - 10, Math.floor(finalDmg), isCrit);

    // Hit flash
    this.sprite.setTint(0xFFFFFF);
    this.scene.time.delayedCall(80, () => {
      if (this.sprite && this.active) this.sprite.clearTint();
    });

    // Knockback
    if (sourceX !== undefined && sourceY !== undefined) {
      this.scene.juice.knockback(this, sourceX, sourceY, 8, 100);
    }

    // Show HP bar on damage
    this.hpBar.setVisible(true);
    this.hpBarBg.setVisible(true);

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.active = false;
    this.shouldDestroy = true;

    // Death effects
    this.scene.juice.enemyDeath(this);

    // Spawn pickups
    this.scene.spawnPickup(this.x, this.y, "xp", this.xpValue);
    if (Math.random() < 0.3) {
      this.scene.spawnPickup(this.x, this.y, "gold", this.goldValue);
    }
    if (Math.random() < 0.05) {
      this.scene.spawnPickup(this.x, this.y, "health", 20);
    }

    // Cleanup
    this.sprite.destroy();
    if (this.glow) this.glow.destroy();
    this.hpBar.destroy();
    this.hpBarBg.destroy();
  }
}
