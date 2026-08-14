import Phaser from "phaser";
import { gameConfig } from "./config/GameConfig.js";
import { BootScene } from "./scenes/BootScene.js";
import { PreloadScene } from "./scenes/PreloadScene.js";
import { TitleScene } from "./scenes/TitleScene.js";
import { ClassSelectScene } from "./scenes/ClassSelectScene.js";
import { LevelScene } from "./scenes/LevelScene.js";
import { LevelTransitionScene } from "./scenes/LevelTransitionScene.js";
import { UIScene } from "./scenes/UIScene.js";
import { LevelUpScene } from "./scenes/LevelUpScene.js";
import { ChestScene } from "./scenes/ChestScene.js";
import { BossIntroOverlayScene } from "./scenes/BossIntroOverlayScene.js";
import { PauseScene } from "./scenes/PauseScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { VictoryScene } from "./scenes/VictoryScene.js";
import { ShopScene } from "./scenes/ShopScene.js";
import { SettingsScene } from "./scenes/SettingsScene.js";

const config = {
  ...gameConfig,
  scene: [
    BootScene, PreloadScene, TitleScene, ClassSelectScene,
    LevelScene, LevelTransitionScene, UIScene, LevelUpScene,
    ChestScene, BossIntroOverlayScene, PauseScene,
    GameOverScene, VictoryScene, ShopScene, SettingsScene
  ]
};

new Phaser.Game(config);
