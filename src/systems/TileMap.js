import { CONSTANTS } from "../config/GameConfig.js";

export class TileMap {
  constructor(scene, widthTiles, heightTiles, tileSize) {
    this.scene = scene;
    this.widthTiles = widthTiles;
    this.heightTiles = heightTiles;
    this.tileSize = tileSize;
    this.worldWidth = widthTiles * tileSize;
    this.worldHeight = heightTiles * tileSize;

    // 2D grid: 0 = floor, 1 = obstacle, 2 = hazard
    this.grid = [];
    for (let y = 0; y < heightTiles; y++) {
      this.grid[y] = new Uint8Array(widthTiles).fill(0);
    }

    this.obstacles = [];
    this.hazards = [];
  }

  // Generate obstacles from level data
  generateFromLevel(levelDef) {
    const rng = (seed) => {
      let s = seed;
      return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };

    const rand = rng(levelDef.seed || 42);

    // Place border walls
    for (let x = 0; x < this.widthTiles; x++) {
      this.grid[0][x] = 1;
      this.grid[this.heightTiles - 1][x] = 1;
    }
    for (let y = 0; y < this.heightTiles; y++) {
      this.grid[y][0] = 1;
      this.grid[y][this.widthTiles - 1] = 1;
    }

    // Place obstacles based on level theme
    const obstacleCount = levelDef.obstacleCount || 80;
    const hazardCount = levelDef.hazardCount || 15;

    for (let i = 0; i < obstacleCount; i++) {
      const tx = 2 + Math.floor(rand() * (this.widthTiles - 4));
      const ty = 2 + Math.floor(rand() * (this.heightTiles - 4));
      if (this.grid[ty][tx] === 0) {
        this.grid[ty][tx] = 1;
        this.obstacles.push({ tx, ty, type: levelDef.obstacleType || "tree" });
      }
    }

    for (let i = 0; i < hazardCount; i++) {
      const tx = 3 + Math.floor(rand() * (this.widthTiles - 6));
      const ty = 3 + Math.floor(rand() * (this.heightTiles - 6));
      if (this.grid[ty][tx] === 0) {
        this.grid[ty][tx] = 2;
        this.hazards.push({ tx, ty, type: levelDef.hazardType || "poison" });
      }
    }

    // Clear center area for player spawn
    const cx = Math.floor(this.widthTiles / 2);
    const cy = Math.floor(this.heightTiles / 2);
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && nx < this.widthTiles && ny >= 0 && ny < this.heightTiles) {
          this.grid[ny][nx] = 0;
        }
      }
    }

    this.renderObstacles();
  }

  renderObstacles() {
    // Render visible obstacles as sprites
    for (const obs of this.obstacles) {
      const x = obs.tx * this.tileSize + this.tileSize / 2;
      const y = obs.ty * this.tileSize + this.tileSize / 2;
      const sprite = this.scene.add.image(x, y, obs.type);
      sprite.setScale(0.8);
      sprite.setDepth(2);
      sprite.setAlpha(0.9);
      obs.sprite = sprite;
    }

    for (const haz of this.hazards) {
      const x = haz.tx * this.tileSize + this.tileSize / 2;
      const y = haz.ty * this.tileSize + this.tileSize / 2;
      const sprite = this.scene.add.image(x, y, haz.type);
      sprite.setScale(0.7);
      sprite.setDepth(1);
      sprite.setAlpha(0.6);
      haz.sprite = sprite;
    }
  }

  // Check if a world position is blocked
  isBlocked(x, y) {
    const tx = Math.floor(x / this.tileSize);
    const ty = Math.floor(y / this.tileSize);
    if (tx < 0 || tx >= this.widthTiles || ty < 0 || ty >= this.heightTiles) return true;
    return this.grid[ty][tx] === 1;
  }

  // Check if position is in hazard
  isHazard(x, y) {
    const tx = Math.floor(x / this.tileSize);
    const ty = Math.floor(y / this.tileSize);
    if (tx < 0 || tx >= this.widthTiles || ty < 0 || ty >= this.heightTiles) return false;
    return this.grid[ty][tx] === 2;
  }

  // Get tile center
  getTileCenter(tx, ty) {
    return {
      x: tx * this.tileSize + this.tileSize / 2,
      y: ty * this.tileSize + this.tileSize / 2
    };
  }

  // Find nearest free tile
  findNearestFreeTile(tx, ty) {
    if (this.grid[ty][tx] === 0) return { tx, ty };
    let radius = 1;
    while (radius < 10) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
          const nx = tx + dx;
          const ny = ty + dy;
          if (nx >= 0 && nx < this.widthTiles && ny >= 0 && ny < this.heightTiles) {
            if (this.grid[ny][nx] === 0) return { tx: nx, ty: ny };
          }
        }
      }
      radius++;
    }
    return { tx, ty };
  }

  // Get random spawn position around a center point
  getRandomSpawnAround(cx, cy, minDist, maxDist) {
    const angle = Math.random() * Math.PI * 2;
    const dist = minDist + Math.random() * (maxDist - minDist);
    let x = cx + Math.cos(angle) * dist;
    let y = cy + Math.sin(angle) * dist;

    // Snap to nearest free tile
    const tx = Math.floor(x / this.tileSize);
    const ty = Math.floor(y / this.tileSize);
    const free = this.findNearestFreeTile(tx, ty);
    const center = this.getTileCenter(free.tx, free.ty);

    return { x: center.x, y: center.y };
  }

  destroy() {
    for (const obs of this.obstacles) {
      if (obs.sprite) obs.sprite.destroy();
    }
    for (const haz of this.hazards) {
      if (haz.sprite) haz.sprite.destroy();
    }
  }
}
