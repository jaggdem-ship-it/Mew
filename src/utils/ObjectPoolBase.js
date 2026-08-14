export class ObjectPoolBase {
  constructor(scene, createFn, resetFn, initialSize = 20) {
    this.scene = scene;
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.active = [];
    for (let i = 0; i < initialSize; i++) {
      const obj = this.createFn();
      obj.active = false;
      obj.visible = false;
      this.pool.push(obj);
    }
  }

  get(...args) {
    let obj = this.pool.find(o => !o.active);
    if (!obj) {
      obj = this.createFn();
      this.pool.push(obj);
    }
    obj.active = true;
    obj.visible = true;
    this.resetFn(obj, ...args);
    this.active.push(obj);
    return obj;
  }

  release(obj) {
    obj.active = false;
    obj.visible = false;
    const idx = this.active.indexOf(obj);
    if (idx >= 0) this.active.splice(idx, 1);
  }

  releaseAll() {
    for (const obj of this.active) {
      obj.active = false;
      obj.visible = false;
    }
    this.active = [];
  }

  update(dt) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const obj = this.active[i];
      if (obj.update) obj.update(dt);
      if (obj.shouldDestroy) {
        this.release(obj);
      }
    }
  }
}
