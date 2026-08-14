import { MathUtils } from "../utils/MathUtils.js";

export class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
    this.cellSize = 64;
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  insert(entity) {
    const cx = Math.floor(entity.x / this.cellSize);
    const cy = Math.floor(entity.y / this.cellSize);
    const key = `${cx},${cy}`;
    if (!this.grid.has(key)) this.grid.set(key, []);
    this.grid.get(key).push(entity);
  }

  query(x, y, radius) {
    const results = [];
    const rCells = Math.ceil(radius / this.cellSize);
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    for (let dx = -rCells; dx <= rCells; dx++) {
      for (let dy = -rCells; dy <= rCells; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          for (const e of cell) {
            if (MathUtils.distance(x, y, e.x, e.y) <= radius + (e.size || 8)) {
              results.push(e);
            }
          }
        }
      }
    }
    return results;
  }

  queryNearest(x, y, maxDist = 300) {
    let nearest = null;
    let best = maxDist;
    const rCells = Math.ceil(maxDist / this.cellSize);
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    for (let dx = -rCells; dx <= rCells; dx++) {
      for (let dy = -rCells; dy <= rCells; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          for (const e of cell) {
            const d = MathUtils.distance(x, y, e.x, e.y);
            if (d < best) {
              best = d;
              nearest = e;
            }
          }
        }
      }
    }
    return nearest;
  }

  rebuild(entities) {
    this.clear();
    for (const e of entities) {
      if (e.active !== false) this.insert(e);
    }
  }
}
