export const gameConfig = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  pixelArt: true,
  backgroundColor: "#1a1a2e",
  transparent: false,
  antialias: false,
  roundPixels: true,
  banner: false,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game-container",
    min: { width: 320, height: 180 },
    max: { width: 1920, height: 1080 }
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
      tileBias: 16,
      maxEntries: 64,
      overlapBias: 4
    }
  },

  audio: { disableWebAudio: false },
  render: { batchSize: 4096, maxTextures: 8 }
};

export const CONSTANTS = {
  PLAYER_BASE_SPEED: 100,
  PLAYER_BASE_HP: 100,
  XP_CURVE: [0, 15, 35, 60, 100, 150, 210, 280, 360, 450, 550, 660, 780, 910, 1050, 1200, 1360, 1530, 1710, 1900],
  MAX_WEAPON_SLOTS: 6,
  MAX_PASSIVE_SLOTS: 6,
  WEAPON_MAX_LEVEL: 8,
  PASSIVE_MAX_LEVEL: 5,
  ELITE_INTERVAL: 45000,
  CHEST_ROULETTE_TIME: 2000
};
