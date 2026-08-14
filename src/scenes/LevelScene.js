import Phaser from "phaser";
import { LEVELS } from "../data/levels.js";
import { CLASSES } from "../data/classes.js";
import { WEAPONS } from "../data/weapons.js";
import { PASSIVES } from "../data/passives.js";
import { BOSSES } from "../data/bosses.js";
import { Player } from "../entities/Player.js";
import { Enemy } from "../entities/Enemy.js";
import { Boss } from "../entities/Boss.js";
import { Pickup } from "../entities/Pickup.js";
import { AudioManager } from "../systems/AudioManager.js";
import { SpawnDirector } from "../systems/SpawnDirector.js";
import { WeaponSystem } from "../systems/WeaponSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { HazardSystem } from "../systems/HazardSystem.js";
import { ProgressionSystem } from "../systems/ProgressionSystem.js";
import { ObjectPools } from "../systems/ObjectPools.js";
import { SaveManager } from "../systems/SaveManager.js";
import { JuiceSystem } from "../systems/JuiceSystem.js";
import { MathUtils } from "../utils/MathUtils.js";
import { BossBanner } from "../ui/BossBanner.js";
import { CardPanel } from "../ui/CardPanel.js";

export class LevelScene extends Phaser.Scene {
  constructor() { super({ key: "LevelScene" }); }

  init(data) {
    this.levelId = data.levelId || 1;
    this.freshRun = data.freshRun || false;
    this.levelConfig = LEVELS.find(l => l.id === this.levelId);
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.levelTime = 0;
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.paused = false;
    this.gameOver = false;

    // Background image
    this.bgImage = this.add.image(w / 2, h / 2, `bg_level${this.levelId}`);
    this.bgImage.setDisplaySize(w, h);
    this.bgImage.setDepth(0);
    this.bgImage.setAlpha(0.85);

    // Ground pattern
    const gfx = this.add.graphics();
    gfx.fillStyle(this.levelConfig.groundColor, 0.3);
    for (let x = 0; x < w; x += 32) {
      for (let y = 0; y < h; y += 32) {
        if ((x + y) % 64 === 0) {
          gfx.fillRect(x, y, 32, 32);
        }
      }
    }
    gfx.setDepth(0);

    // Audio
    this.audio = new AudioManager(this);
    this.audio.playBGM(this.levelConfig.bpm, this.levelConfig.scale, 220, 0.8 + this.levelId * 0.1);

    // Run state
    if (this.freshRun) {
      this.runState = this.createFreshRunState();
      this.registry.set("runState", this.runState);
    } else {
      this.runState = this.registry.get("runState");
    }

    // Systems
    this.collisionSystem = new CollisionSystem(this);
    this.hazardSystem = new HazardSystem(this);
    this.hazardSystem.setLevelConfig(this.levelConfig.hazard);
    this.spawnDirector = new SpawnDirector(this);
    this.spawnDirector.setLevelConfig(this.levelConfig);
    this.pools = new ObjectPools(this);
    this.weaponSystem = new WeaponSystem(this, this.runState);
    this.progression = new ProgressionSystem(this.runState);
    this.juice = new JuiceSystem(this);
    this.shownLevel = this.progression.level;

    // Player
    const classKey = this.registry.get("selectedClass") || "barbarian";
    this.player = new Player(this, w / 2, h / 2, classKey, this.runState);

    // Collections
    this.enemies = [];
    this.pickups = [];
    this.boss = null;

    // Boss banner
    this.bossBanner = new BossBanner(this);

    // Card panel
    this.cardPanel = new CardPanel(this);

    // UI Scene launch
    this.scene.launch("UIScene", { player: this.player, progression: this.progression, levelName: this.levelConfig.name });

    // Events
    this.events.on("enemy_death", this.onEnemyDeath, this);
    this.events.on("boss_death", this.onBossDeath, this);
    this.events.on("player_death", this.onPlayerDeath, this);

    // Input
    this.input.keyboard.on("keydown-ESC", () => this.togglePause());
    this.input.keyboard.on("keydown-P", () => this.togglePause());

    // Level timer text
    this.timerText = this.add.text(w / 2, 8, "0:00", {
      fontSize: "12px", color: "#ffffff"
    }).setOrigin(0.5).setDepth(10);

    // Level name
    this.add.text(w / 2, 22, this.levelConfig.name, {
      fontSize: "10px", color: "#aaaaaa"
    }).setOrigin(0.5).setDepth(10);
  }

  createFreshRunState() {
    const classKey = this.registry.get("selectedClass") || "barbarian";
    const cls = CLASSES[classKey];
    return {
      classKey,
      weapons: { [cls.startingWeapon]: 1 },
      passives: {},
      gold: 0,
      weaponDefs: WEAPONS,
      passiveDefs: PASSIVES,
      saveData: SaveManager.load(),
      getStatMult(stat) {
        let mult = 1;
        const cstats = CLASSES[this.classKey].stats;
        if (stat === "damageMult") mult = cstats.damageMult;
        else if (stat === "speedMult") mult = cstats.speedMult;
        else if (stat === "cooldownMult") mult = cstats.cooldownMult;
        else if (stat === "areaMult") mult = cstats.areaMult;
        else if (stat === "xpMult") mult = cstats.xpMult;
        else if (stat === "critChance") mult = cstats.critChance;

        for (const [pKey, pLvl] of Object.entries(this.passives)) {
          const pDef = this.passiveDefs[pKey];
          if (pDef && pLvl > 0) {
            const s = pDef.scaling[Math.min(pLvl - 1, pDef.scaling.length - 1)];
            if (s[stat]) mult *= s[stat];
          }
        }
        return mult;
      },
      addWeaponLevel(key) {
        this.weapons[key] = (this.weapons[key] || 0) + 1;
      },
      addPassiveLevel(key) {
        this.passives[key] = (this.passives[key] || 0) + 1;
      }
    };
  }

  update(time, delta) {
    if (this.paused || this.gameOver) return;

    const dt = delta;
    if (!this.juice.update(dt)) return;
    this.levelTime += dt;

    // Update timer display
    const seconds = Math.floor(this.levelTime / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.timerText.setText(`${mins}:${secs.toString().padStart(2, "0")}`);

    // Check boss gate
    if (!this.bossSpawned && this.levelTime > this.levelConfig.bossGateTime * 1000) {
      this.spawnBoss();
    }

    // Update player
    this.player.update(dt);

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(dt, this.player, this.collisionSystem);
      if (e.shouldDestroy) {
        this.enemies.splice(i, 1);
      }
    }

    // Update boss
    if (this.boss && this.boss.active) {
      this.boss.update(dt, this.player);
    }

    // Update pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.update(dt, this.player);
      if (p.shouldDestroy) {
        this.pickups.splice(i, 1);
      }
    }

    // Update projectiles
    this.pools.update(dt);

    // Update hazards
    this.hazardSystem.update(dt, this.player);

    // Update spawn director
    this.spawnDirector.update(dt, (type, x, y, def, isElite, affix) => this.spawnEnemy(type, x, y, isElite, affix));

    // Rebuild collision grid
    this.collisionSystem.rebuild([...this.enemies, this.boss].filter(e => e && e.active));

    // Projectile-enemy collisions
    for (const proj of this.pools.projectiles.active) {
      if (!proj.active) continue;
      const nearby = this.collisionSystem.query(proj.x, proj.y, proj.radius + 10);
      for (const e of nearby) {
        if (e !== this.player && e.takeDamage) {
          if (proj.onHit && proj.onHit(e)) {
            this.audio.playSfx("enemy_hit");
          }
        }
      }
    }

    // Weapon system
    this.weaponSystem.update(dt, this.player, this.enemies, this.collisionSystem, this.pools);

    // Check level-up
    if (this.progression.level > this.shownLevel) {
      this.shownLevel = this.progression.level;
      this.onLevelUp();
    }

    // Low HP vignette
    if (this.player.getHpPercent() < 0.25) {
      if (!this.vignette) {
        this.vignette = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0xff0000, 0.15);
        this.vignette.setDepth(50);
      }
    } else if (this.vignette) {
      this.vignette.destroy();
      this.vignette = null;
    }
  }

  spawnEnemy(type, x, y, isElite = false, eliteAffix = null) {
    const enemy = new Enemy(this, x, y, type, isElite, eliteAffix);
    this.enemies.push(enemy);
    return enemy;
  }

  spawnBoss() {
    this.bossSpawned = true;
    this.spawnDirector.stop();
    const w = this.scale.width;
    const h = this.scale.height;
    const bossDef = BOSSES[this.levelConfig.bossKey];
    this.boss = new Boss(this, w / 2, h / 4, this.levelConfig.bossKey);

    this.bossBanner.show(bossDef, () => {
      // Boss fight starts
    });
  }

  dropPickup(x, y, type, amount) {
    const pickup = new Pickup(this, x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, type, amount);
    this.pickups.push(pickup);
  }

  onEnemyDeath(enemy) {
    // Handled in Enemy.die()
  }

  onBossDeath(boss) {
    this.bossDefeated = true;
    this.audio.stopBGM();
    this.audio.playSfx("boss_death");

    // Save gold
    SaveManager.addGold(this.runState.gold);

    // Drop chest
    this.dropChest();
  }

  dropChest() {
    const w = this.scale.width;
    const h = this.scale.height;
    const chest = this.add.rectangle(w / 2, h / 2, 20, 16, 0xffd700);
    chest.setStrokeStyle(2, 0xffaa00);
    chest.setDepth(5);
    chest.setInteractive({ useHandCursor: true });

    const label = this.add.text(w / 2, h / 2 - 20, "CHEST", {
      fontSize: "10px", color: "#ffd700"
    }).setOrigin(0.5).setDepth(6);

    chest.on("pointerover", () => chest.setScale(1.1));
    chest.on("pointerout", () => chest.setScale(1));
    chest.on("pointerdown", () => {
      this.audio.playSfx("chest_open");
      chest.destroy();
      label.destroy();
      this.openChest();
    });
  }

  openChest() {
    const tier = this.levelId <= 2 ? "weapon" : this.levelId <= 3 ? "rare" : "epic";
    const rewards = [];
    const count = tier === "epic" ? 3 : tier === "rare" ? 2 : 1;

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      if (roll < 0.5) {
        const available = Object.keys(WEAPONS).filter(w => !this.runState.weapons[w]);
        if (available.length) {
          rewards.push({ type: "weapon", key: available[Math.floor(Math.random() * available.length)] });
        } else {
          rewards.push({ type: "gold", amount: 20 + this.levelId * 10 });
        }
      } else {
        const available = Object.keys(PASSIVES).filter(p => !this.runState.passives[p]);
        if (available.length) {
          rewards.push({ type: "passive", key: available[Math.floor(Math.random() * available.length)] });
        } else {
          rewards.push({ type: "gold", amount: 20 + this.levelId * 10 });
        }
      }
    }

    this.cardPanel.show(rewards, (card) => {
      if (card) {
        this.progression.applyCard(card);
        this.audio.playSfx("pickup_power");
      }
      this.scene.time.delayedCall(500, () => {
        if (this.levelId < 5) {
          this.scene.start("LevelTransitionScene", {
            levelId: this.levelId,
            runState: this.runState
          });
        } else {
          SaveManager.setCampaignClear();
          SaveManager.setBestTime(Math.floor(this.levelTime / 1000));
          this.scene.start("VictoryScene");
        }
      });
    });
  }

  onPlayerDeath() {
    this.gameOver = true;
    this.audio.stopBGM();
    SaveManager.addGold(Math.floor(this.runState.gold * 0.5));
    this.scene.start("GameOverScene", { levelId: this.levelId });
  }

  onLevelUp() {
    this.paused = true;
    this.audio.playSfx("level_up");
    const cards = this.progression.getLevelCards();
    this.cardPanel.show(cards, (card) => {
      if (card) {
        this.progression.applyCard(card);
      }
      this.paused = false;
    });
  }

  togglePause() {
    if (this.cardPanel.container) return; // Don't pause during level up
    this.paused = !this.paused;
    if (this.paused) {
      this.scene.launch("PauseScene");
    } else {
      this.scene.stop("PauseScene");
    }
  }

  getNearestEnemy(x, y) {
    let nearest = null;
    let bestDist = Infinity;
    for (const e of this.enemies) {
      if (!e.active) continue;
      const d = MathUtils.distance(x, y, e.x, e.y);
      if (d < bestDist) { bestDist = d; nearest = e; }
    }
    if (this.boss && this.boss.active) {
      const d = MathUtils.distance(x, y, this.boss.x, this.boss.y);
      if (d < bestDist) nearest = this.boss;
    }
    return nearest;
  }
}
