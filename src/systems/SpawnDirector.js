import { CONSTANTS } from "../config/GameConfig.js";

export class SpawnDirector {
  constructor(scene, levelDef) {
    this.scene = scene;
    this.levelDef = levelDef;
    this.spawnTimer = 0;
    this.spawnInterval = 2000;
    this.minInterval = 400;
    this.eliteChance = CONSTANTS.ELITE_SPAWN_CHANCE;
    this.waveNumber = 0;
    this.maxEnemies = 80;
  }

  update(dt) {
    this.spawnTimer += dt;

    // Ramp up difficulty
    const timeMinutes = this.scene.levelTime / 60000;
    this.spawnInterval = Math.max(this.minInterval, 2000 - timeMinutes * 300);
    this.eliteChance = Math.min(0.3, CONSTANTS.ELITE_SPAWN_CHANCE + timeMinutes * 0.02);

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnWave();
    }

    // Cleanup dead enemies
    for (let i = this.scene.enemies.length - 1; i >= 0; i--) {
      if (this.scene.enemies[i].shouldDestroy) {
        this.scene.enemies.splice(i, 1);
      }
    }
  }

  spawnWave() {
    const activeEnemies = this.scene.enemies.filter(e => e.active).length;
    if (activeEnemies >= this.maxEnemies) return;

    this.waveNumber++;
    const player = this.scene.player;
    if (!player) return;

    // Number of enemies scales with time
    const timeMinutes = this.scene.levelTime / 60000;
    const baseCount = 2 + Math.floor(timeMinutes * 1.5);
    const count = Math.min(baseCount, 12);

    for (let i = 0; i < count; i++) {
      const type = this.getRandomEnemyType();
      const isElite = Math.random() < this.eliteChance;

      const spawn = this.scene.tileMap.getRandomSpawnAround(
        player.x, player.y,
        CONSTANTS.SPAWN_RADIUS_MIN_TILES * CONSTANTS.TILE_SIZE,
        CONSTANTS.SPAWN_RADIUS_MAX_TILES * CONSTANTS.TILE_SIZE
      );

      const enemy = this.scene.spawnEnemy(type, isElite);
      if (enemy) {
        enemy.x = spawn.x;
        enemy.y = spawn.y;
        enemy.sprite.setPosition(spawn.x, spawn.y);
      }
    }
  }

  getRandomEnemyType() {
    const pool = this.levelDef.enemyPool;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}
