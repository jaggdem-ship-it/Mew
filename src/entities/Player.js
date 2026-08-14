import { CONSTANTS } from "../config/GameConfig.js";
import { CLASSES } from "../data/classes.js";

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

    this.keys = scene.input.keyboard.addKeys({
      up: "W", down: "S", left: "A", right: "D",
      up2: "UP", down2: "DOWN", left2: "LEFT", right2: "RIGHT"
    });
  }

  update(dt) {
    if (this.dead) return;

    let dx = 0;
    let dy = 0;
    if (this.keys.up.isDown || this.keys.up2.isDown) dy -= 1;
    if (this.keys.down.isDown || this.keys.down2.isDown) dy += 1;
    if (this.keys.left.isDown || this.keys.left2.isDown) dx -= 1;
    if (this.keys.right.isDown || this.keys.right2.isDown) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
      this.facing = dx < 0 ? -1 : 1;
      this.sprite.setScale(Math.abs(this.sprite.scaleX) * this.facing, Math.abs(this.sprite.scaleY));
    }

    let moveSpeed = this.speed;
    if (this.inFrostZone) moveSpeed *= 0.6;

    this.x += dx * moveSpeed * (dt / 1000);
    this.y += dy * moveSpeed * (dt / 1000);

    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    this.x = Math.max(16, Math.min(w - 16, this.x));
    this.y = Math.max(24, Math.min(h - 24, this.y));

    this.sprite.setPosition(this.x, this.y);

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
    this.scene.cameras.main.shake(100, 0.005);
    this.scene.audio.playSfx("hit");

    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  die() {
    this.dead = true;
    this.sprite.setAlpha(0.3);
    this.scene.events.emit("player_death");
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getHpPercent() {
    return this.hp / this.maxHp;
  }
}
