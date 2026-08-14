import { MathUtils } from "../utils/MathUtils.js";

export class Pickup {
  constructor(scene, x, y, type, amount) {
    this.scene = scene;
    this.type = type;
    this.amount = amount;
    this.x = x;
    this.y = y;
    this.active = true;
    this.shouldDestroy = false;
    this.lifetime = 15000;
    this.floatOffset = MathUtils.randomRange(0, Math.PI * 2);

    const textureMap = { xp: "xp_gem", gold: "gold_coin", health: "health_potion" };
    const texture = textureMap[type] || "xp_gem";
    this.sprite = scene.add.image(x, y, texture);
    this.sprite.setScale(0.6);
    this.sprite.setDepth(2);
  }

  update(dt, player) {
    if (!this.active) return;
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.shouldDestroy = true;
      return;
    }

    const bob = Math.sin(this.scene.time.now / 300 + this.floatOffset) * 3;
    this.sprite.y = this.y + bob;
    this.sprite.setScale(0.6 + Math.sin(this.scene.time.now / 400 + this.floatOffset) * 0.1);

    const magnetRadius = 60 * player.magnetMult;
    const dist = MathUtils.distance(this.x, this.sprite.y, player.x, player.y);
    if (dist < magnetRadius) {
      const angle = MathUtils.angleTo(this.x, this.sprite.y, player.x, player.y);
      const pullSpeed = 150 * (1 - dist / magnetRadius);
      this.x += Math.cos(angle) * pullSpeed * (dt / 1000);
      this.y += Math.sin(angle) * pullSpeed * (dt / 1000);
      this.sprite.setPosition(this.x, this.y + bob);
    }

    if (dist < 16) this.collect(player);
  }

  collect(player) {
    this.shouldDestroy = true;
    this.active = false;
    this.sprite.destroy();

    if (this.type === "xp") {
      this.scene.progression.addXp(this.amount);
      this.scene.audio.playSfx("pickup_xp");
    } else if (this.type === "gold") {
      this.scene.runState.gold += Math.floor(this.amount * player.goldMult);
      this.scene.audio.playSfx("pickup_gold");
    } else if (this.type === "health") {
      player.heal(this.amount);
      this.scene.audio.playSfx("pickup_health");
    }
  }
}
