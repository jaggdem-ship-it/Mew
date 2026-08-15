export const CONSTANTS = {
  PLAYER_BASE_HP: 100,
  PLAYER_BASE_SPEED: 180,
  XP_PER_LEVEL: 100,
  GOLD_PER_CHEST: 50,
  CHEST_SPAWN_INTERVAL: 60000,
  ELITE_SPAWN_CHANCE: 0.08,
  MAX_WEAPONS: 6,
  MAX_PASSIVES: 6,
  SAVE_KEY: "sanctuary_survivors_save",

  // World settings
  TILE_SIZE: 64,
  WORLD_WIDTH_TILES: 50,
  WORLD_HEIGHT_TILES: 50,
  CAMERA_LERP: 0.08,

  // Spawn radius around player (in tiles)
  SPAWN_RADIUS_MIN_TILES: 8,
  SPAWN_RADIUS_MAX_TILES: 14,

  // View distance for culling (in pixels)
  CULL_DISTANCE: 600,

  // XP curve per level
  XP_CURVE: [0, 15, 25, 40, 60, 85, 115, 150, 190, 235, 285, 340, 400, 465, 535, 610, 690, 775, 865, 960],

  // Weapon/passive limits
  WEAPON_MAX_LEVEL: 8,
  PASSIVE_MAX_LEVEL: 5,
  MAX_WEAPON_SLOTS: 6,
  MAX_PASSIVE_SLOTS: 6,
};

export const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#0d1b2a",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
