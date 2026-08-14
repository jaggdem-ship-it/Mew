import { ENEMIES } from "../data/enemies.js";
import { MathUtils } from "../utils/MathUtils.js";

export class SpawnDirector {
  constructor(scene) {
    this.scene = scene;
    this.timer = 0;
    this.spawnTimer = 0;
    this.eliteTimer = 0;
    this.active = false;
    this.currentWave = null;
  }

  setLevelConfig(config) {
    this.config = config;
    this.timer = 0;
    this.spawnTimer = 0;
    this.eliteTimer = 0;
    this.active = true;
    this.currentWave = config.spawnCurve[0];
    this.waveIndex = 0;
    this.enemyCount = 0;
  }

  update(dt, spawnFn) {
    if (!this.active || !this.config) return;
    this.timer += dt;
    this.spawnTimer += dt;
    this.eliteTimer += dt;

    // Advance wave
    while (this.waveIndex < this.config.spawnCurve.length - 1 &&
           this.timer > this.config.spawnCurve[this.waveIndex + 1].time * 1000) {
      this.waveIndex++;
      this.currentWave = this.config.spawnCurve[this.waveIndex];
    }

    // Spawn enemies
    const wave = this.currentWave;
    if (wave && this.spawnTimer > wave.rate && this.enemyCount < wave.max) {
      this.spawnTimer = 0;
      const type = wave.enemies[Math.floor(Math.random() * wave.enemies.length)];
      const def = ENEMIES[type];
      if (def) {
        const angle = MathUtils.randomRange(0, Math.PI * 2);
        const dist = MathUtils.randomRange(180, 260);
        const x = this.scene.player.x + Math.cos(angle) * dist;
        const y = this.scene.player.y + Math.sin(angle) * dist;
        spawnFn(type, x, y, def);
        this.enemyCount++;
      }
    }

    // Champion event
    if (this.config.championEvent && this.timer > this.config.championEvent.time * 1000 && !this.championSpawned) {
      this.championSpawned = true;
      for (let i = 0; i < this.config.championEvent.count; i++) {
        const angle = MathUtils.randomRange(0, Math.PI * 2);
        const dist = MathUtils.randomRange(150, 220);
        const x = this.scene.player.x + Math.cos(angle) * dist;
        const y = this.scene.player.y + Math.sin(angle) * dist;
        spawnFn(this.config.championEvent.type.replace("_warband", "").replace("_nest", "").replace("_coven", ""), x, y, ENEMIES[this.config.championEvent.type.replace("_warband", "").replace("_nest", "").replace("_coven", "")], true, this.config.championEvent.affix);
      }
    }

    // Random elite packs
    if (this.eliteTimer > 45000) {
      this.eliteTimer = 0;
      const eliteType = wave.enemies[Math.floor(Math.random() * wave.enemies.length)];
      const def = ENEMIES[eliteType];
      if (def) {
        for (let i = 0; i < 3; i++) {
          const angle = MathUtils.randomRange(0, Math.PI * 2);
          const dist = MathUtils.randomRange(160, 240);
          const x = this.scene.player.x + Math.cos(angle) * dist;
          const y = this.scene.player.y + Math.sin(angle) * dist;
          const affix = ENEMIES.elite_affixes[Math.floor(Math.random() * ENEMIES.elite_affixes.length)];
          spawnFn(eliteType, x, y, def, true, affix);
        }
      }
    }
  }

  stop() {
    this.active = false;
  }
}
