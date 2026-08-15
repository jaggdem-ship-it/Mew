import { MathUtils } from "../utils/MathUtils.js";

export class HazardSystem {
  constructor(scene) {
    this.scene = scene;
    this.hazards = [];
    this.timer = 0;
  }

  setLevelConfig(config) {
    this.config = config;
    this.hazards = [];
    this.timer = 0;
  }

  update(dt, player) {
    if (!this.config) return;
    this.timer += dt;

    switch (this.config.type) {
      case "tall_grass":
        this.updateTallGrass(dt, player);
        break;
      case "poison_gas":
        this.updatePoisonGas(dt, player);
        break;
      case "frost_aura_zone":
        this.updateFrostAura(dt, player);
        break;
      case "lava_crack":
        this.updateLavaCrack(dt, player);
        break;
      case "closing_circle":
        this.updateClosingCircle(dt, player);
        break;
    }
  }

  updateTallGrass(dt, player) {
    if (this.timer > this.config.spawnRate) {
      this.timer = 0;
      const x = MathUtils.randomRange(40, this.scene.scale.width - 40);
      const y = MathUtils.randomRange(40, this.scene.scale.height - 40);
      const grass = this.scene.add.circle(x, y, this.config.radius, this.config.color, 0.3);
      grass.setDepth(1);
      this.hazards.push({ type: "grass", obj: grass, x, y, radius: this.config.radius, lifetime: 10000 });
    }
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.lifetime -= dt;
      if (h.lifetime <= 0) {
        h.obj.destroy();
        this.hazards.splice(i, 1);
        continue;
      }
      const d = MathUtils.distance(player.x, player.y, h.x, h.y);
      if (d < h.radius) {
        h.obj.setAlpha(0.6);
      } else {
        h.obj.setAlpha(0.3);
      }
    }
  }

  updatePoisonGas(dt, player) {
    if (this.timer > this.config.spawnRate) {
      this.timer = 0;
      const x = MathUtils.randomRange(40, this.scene.scale.width - 40);
      const y = MathUtils.randomRange(40, this.scene.scale.height - 40);
      // Telegraph
      const telegraph = this.scene.add.circle(x, y, this.config.radius, 0x32cd32, 0.2);
      telegraph.setDepth(1);
      this.hazards.push({
        type: "poison_telegraph", obj: telegraph, x, y, radius: this.config.radius,
        lifetime: this.config.telegraphTime, phase: "telegraph", damage: this.config.damage
      });
    }
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.lifetime -= dt;
      if (h.lifetime <= 0) {
        if (h.phase === "telegraph") {
          h.obj.destroy();
          const gas = this.scene.add.circle(h.x, h.y, h.radius, 0x32cd32, 0.4);
          gas.setDepth(1);
          this.hazards[i] = {
            type: "poison_gas", obj: gas, x: h.x, y: h.y, radius: h.radius,
            lifetime: this.config.duration, phase: "gas", damage: h.damage
          };
          continue;
        } else {
          h.obj.destroy();
          this.hazards.splice(i, 1);
          continue;
        }
      }
      if (h.phase === "gas") {
        const d = MathUtils.distance(player.x, player.y, h.x, h.y);
        if (d < h.radius) {
          player.takeDamage(h.damage * dt / 1000);
        }
      }
    }
  }

  updateFrostAura(dt, player) {
    if (this.timer > this.config.spawnRate) {
      this.timer = 0;
      const x = MathUtils.randomRange(40, this.scene.scale.width - 40);
      const y = MathUtils.randomRange(40, this.scene.scale.height - 40);
      const aura = this.scene.add.circle(x, y, this.config.radius, this.config.color, 0.25);
      aura.setDepth(1);
      this.hazards.push({ type: "frost", obj: aura, x, y, radius: this.config.radius, lifetime: 12000, slowFactor: this.config.slowFactor });
    }
    let inFrost = false;
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.lifetime -= dt;
      if (h.lifetime <= 0) {
        h.obj.destroy();
        this.hazards.splice(i, 1);
        continue;
      }
      const d = MathUtils.distance(player.x, player.y, h.x, h.y);
      if (d < h.radius) inFrost = true;
    }
    player.inFrostZone = inFrost;
  }

  updateLavaCrack(dt, player) {
    if (this.timer > this.config.spawnRate) {
      this.timer = 0;
      const x = MathUtils.randomRange(40, this.scene.scale.width - 40);
      const y = MathUtils.randomRange(40, this.scene.scale.height - 40);
      const angle = MathUtils.randomRange(0, Math.PI * 2);
      // Telegraph line
      const telegraph = this.scene.add.rectangle(x, y, this.config.length, this.config.width, 0xff4500, 0.2);
      telegraph.setRotation(angle);
      telegraph.setDepth(1);
      this.hazards.push({
        type: "lava_telegraph", obj: telegraph, x, y, angle,
        width: this.config.width, length: this.config.length,
        lifetime: this.config.telegraphTime, phase: "telegraph", damage: this.config.damage
      });
    }
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.lifetime -= dt;
      if (h.lifetime <= 0) {
        if (h.phase === "telegraph") {
          h.obj.destroy();
          const lava = this.scene.add.rectangle(h.x, h.y, h.length, h.width, 0xff4500, 0.6);
          lava.setRotation(h.angle);
          lava.setDepth(1);
          this.hazards[i] = {
            type: "lava", obj: lava, x: h.x, y: h.y, angle: h.angle,
            width: h.width, length: h.length,
            lifetime: 3000, phase: "lava", damage: h.damage
          };
          continue;
        } else {
          h.obj.destroy();
          this.hazards.splice(i, 1);
          continue;
        }
      }
      if (h.phase === "lava") {
        const cos = Math.cos(h.angle);
        const sin = Math.sin(h.angle);
        const dx = player.x - h.x;
        const dy = player.y - h.y;
        const along = dx * cos + dy * sin;
        const across = -dx * sin + dy * cos;
        if (Math.abs(along) < h.length / 2 && Math.abs(across) < h.width / 2) {
          player.takeDamage(h.damage * dt / 1000);
        }
      }
    }
  }

  updateClosingCircle(dt, player) {
    if (!this.circleRadius) {
      this.circleRadius = Math.max(this.scene.scale.width, this.scene.scale.height);
      this.circleObj = this.scene.add.circle(this.scene.scale.width / 2, this.scene.scale.height / 2, this.circleRadius, 0xff0000, 0);
      this.circleObj.setStrokeStyle(2, 0xff0000, 0.5);
      this.circleObj.setDepth(10);
    }
    if (this.timer > this.config.interval && this.config.startTime * 1000 < this.scene.levelTime) {
      this.timer = 0;
      this.circleRadius = Math.max(this.config.minRadius, this.circleRadius - this.config.shrinkAmount);
      this.circleObj.setRadius(this.circleRadius);
    }
    const d = MathUtils.distance(player.x, player.y, this.scene.scale.width / 2, this.scene.scale.height / 2);
    if (d > this.circleRadius) {
      player.takeDamage(5 * dt / 1000);
    }
  }

  clear() {
    for (const h of this.hazards) h.obj.destroy();
    this.hazards = [];
    if (this.circleObj) { this.circleObj.destroy(); this.circleObj = null; }
    this.circleRadius = null;
  }
}
