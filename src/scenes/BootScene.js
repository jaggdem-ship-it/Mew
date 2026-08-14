export class BootScene extends Phaser.Scene {
  constructor() { super({ key: "BootScene" }); }

  preload() {
    this.load.image("boss_blood_raven", "assets/bosses/blood_raven.png");
    this.load.image("boss_andariel", "assets/bosses/andariel.png");
    this.load.image("boss_duriel", "assets/bosses/duriel.png");
    this.load.image("boss_mephisto", "assets/bosses/mephisto.png");
    this.load.image("boss_diablo", "assets/bosses/diablo.png");
    this.load.image("class_barbarian", "assets/classes/barbarian.png");
    this.load.image("class_sorceress", "assets/classes/sorceress.png");
    this.load.image("class_necromancer", "assets/classes/necromancer.png");
    this.load.image("class_amazon", "assets/classes/amazon.png");
    this.load.image("bg_level1", "assets/backgrounds/bg_level1.png");
    this.load.image("bg_level2", "assets/backgrounds/bg_level2.png");
    this.load.image("bg_level3", "assets/backgrounds/bg_level3.png");
    this.load.image("bg_level4", "assets/backgrounds/bg_level4.png");
    this.load.image("bg_level5", "assets/backgrounds/bg_level5.png");
  }

  create() {
    const gfx = this.add.graphics();

    // ========== EXPERT PROCEDURAL ENEMY ART ==========
    this.drawFallen(gfx);
    this.drawFallenShaman(gfx);
    this.drawCarver(gfx);
    this.drawZombie(gfx);
    this.drawSkeleton(gfx);
    this.drawVileMother(gfx);
    this.drawMaggot(gfx);
    this.drawGoatman(gfx);
    this.drawBloodHawk(gfx);
    this.drawFrostZombie(gfx);
    this.drawFrostMaggot(gfx);
    this.drawDemonTrooper(gfx);
    this.drawWraith(gfx);
    this.drawCouncilMember(gfx);
    this.drawHellBovine(gfx);

    // ========== EXPERT PROCEDURAL PROJECTILE ART ==========
    this.drawFirebolt(gfx);
    this.drawIceShard(gfx);
    this.drawArrow(gfx);
    this.drawLightningBolt(gfx);
    this.drawPoisonOrb(gfx);
    this.drawBoneShard(gfx);
    this.drawHolyBolt(gfx);
    this.drawMeteor(gfx);
    this.drawFistOfHeavens(gfx);
    this.drawHydraHead(gfx);

    // ========== EXPERT PROCEDURAL EFFECT ART ==========
    this.drawExplosion(gfx);
    this.drawBloodSplatter(gfx);
    this.drawIceNova(gfx);
    this.drawPoisonPool(gfx);
    this.drawLightningNova(gfx);

    // ========== PICKUP ART ==========
    this.drawXPGem(gfx);
    this.drawGoldCoin(gfx);
    this.drawHealthPotion(gfx);

    // ========== UI ==========
    this.drawUIPanel(gfx);
    this.drawHealthOrb(gfx);
    this.drawWeaponIcon(gfx);

    gfx.destroy();
    this.scene.start("PreloadScene");
  }

  drawFallen(gfx) {
    gfx.clear();
    gfx.fillStyle(0x8B0000);
    gfx.fillEllipse(8, 10, 10, 8);
    gfx.fillStyle(0xCC4444);
    gfx.fillCircle(8, 5, 5);
    gfx.fillStyle(0xFFD700);
    gfx.fillTriangle(4, 3, 6, 0, 8, 3);
    gfx.fillTriangle(12, 3, 10, 0, 8, 3);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(6, 5, 1);
    gfx.fillCircle(10, 5, 1);
    gfx.lineStyle(1, 0x888888);
    gfx.lineBetween(12, 8, 14, 2);
    gfx.fillStyle(0xCCCCCC);
    gfx.fillTriangle(14, 2, 13, 4, 15, 4);
    gfx.generateTexture("fallen", 16, 16);
  }

  drawFallenShaman(gfx) {
    gfx.clear();
    gfx.fillStyle(0x660000);
    gfx.fillEllipse(10, 12, 12, 10);
    gfx.fillStyle(0xFF6600);
    gfx.fillCircle(10, 6, 6);
    gfx.fillStyle(0xFFD700);
    gfx.fillTriangle(5, 4, 8, 0, 10, 4);
    gfx.fillTriangle(15, 4, 12, 0, 10, 4);
    gfx.fillStyle(0x00FF00);
    gfx.fillCircle(7, 6, 1.5);
    gfx.fillCircle(13, 6, 1.5);
    gfx.lineStyle(2, 0x8B4513);
    gfx.lineBetween(14, 14, 16, 2);
    gfx.fillStyle(0xFF4500);
    gfx.fillCircle(16, 2, 3);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(16, 2, 1.5);
    gfx.generateTexture("fallen_shaman", 20, 20);
  }

  drawCarver(gfx) {
    gfx.clear();
    gfx.fillStyle(0xAA2222);
    gfx.fillEllipse(8, 9, 9, 7);
    gfx.fillStyle(0xCC0000);
    gfx.fillTriangle(8, 3, 4, 8, 12, 8);
    gfx.fillStyle(0xFFFFFF);
    gfx.fillCircle(6, 6, 1.5);
    gfx.fillCircle(10, 6, 1.5);
    gfx.fillStyle(0x000000);
    gfx.fillCircle(6, 6, 0.8);
    gfx.fillCircle(10, 6, 0.8);
    gfx.fillStyle(0xFFFFFF);
    gfx.fillTriangle(3, 10, 1, 14, 5, 12);
    gfx.fillTriangle(13, 10, 15, 14, 11, 12);
    gfx.generateTexture("carver", 16, 16);
  }

  drawZombie(gfx) {
    gfx.clear();
    gfx.fillStyle(0x556B2F);
    gfx.fillEllipse(10, 12, 11, 10);
    gfx.fillStyle(0x6B8E23);
    gfx.fillCircle(10, 5, 6);
    gfx.fillStyle(0x000000);
    gfx.fillEllipse(10, 7, 4, 2);
    gfx.fillStyle(0xFFFFFF);
    gfx.fillCircle(7, 4, 1.5);
    gfx.fillCircle(13, 4, 1.5);
    gfx.fillStyle(0x000000);
    gfx.fillCircle(7, 4, 0.5);
    gfx.fillCircle(13, 4, 0.5);
    gfx.lineStyle(2, 0x556B2F);
    gfx.lineBetween(4, 10, 1, 8);
    gfx.lineBetween(16, 10, 19, 8);
    gfx.generateTexture("zombie", 20, 20);
  }

  drawSkeleton(gfx) {
    gfx.clear();
    gfx.lineStyle(1.5, 0xDDDDDD);
    gfx.lineBetween(10, 6, 10, 14);
    gfx.lineBetween(6, 9, 14, 9);
    gfx.lineBetween(7, 11, 13, 11);
    gfx.fillStyle(0xEEEEEE);
    gfx.fillCircle(10, 5, 5);
    gfx.fillStyle(0x000000);
    gfx.fillCircle(8, 4, 1.5);
    gfx.fillCircle(12, 4, 1.5);
    gfx.lineStyle(1.5, 0xAAAAAA);
    gfx.lineBetween(14, 14, 16, 4);
    gfx.fillStyle(0xCCCCCC);
    gfx.fillTriangle(16, 4, 15, 6, 17, 6);
    gfx.generateTexture("skeleton_warrior", 20, 20);
  }

  drawVileMother(gfx) {
    gfx.clear();
    gfx.fillStyle(0x8B008B);
    gfx.fillEllipse(12, 12, 14, 12);
    gfx.fillStyle(0x9932CC);
    gfx.fillCircle(12, 5, 6);
    gfx.fillStyle(0x00FF00);
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 / 4) * i;
      gfx.fillCircle(12 + Math.cos(a) * 3, 5 + Math.sin(a) * 2, 1);
    }
    gfx.lineStyle(2, 0x8B008B);
    for (let i = 0; i < 3; i++) {
      const x = 6 + i * 6;
      gfx.lineBetween(x, 16, x + (i - 1) * 3, 20);
    }
    gfx.generateTexture("vile_mother", 24, 24);
  }

  drawMaggot(gfx) {
    gfx.clear();
    gfx.fillStyle(0x90EE90);
    gfx.fillCircle(4, 6, 3);
    gfx.fillCircle(8, 6, 3.5);
    gfx.fillCircle(12, 6, 3);
    gfx.fillStyle(0x7CFC00);
    gfx.fillCircle(14, 6, 2.5);
    gfx.fillStyle(0x000000);
    gfx.fillCircle(15, 6, 1);
    gfx.generateTexture("maggot", 18, 12);
  }

  drawGoatman(gfx) {
    gfx.clear();
    gfx.fillStyle(0x8B4513);
    gfx.fillEllipse(10, 11, 11, 9);
    gfx.fillStyle(0xA0522D);
    gfx.fillEllipse(10, 5, 7, 6);
    gfx.fillStyle(0xFFD700);
    gfx.fillTriangle(6, 3, 4, 0, 8, 2);
    gfx.fillTriangle(14, 3, 16, 0, 12, 2);
    gfx.fillStyle(0xFF0000);
    gfx.fillCircle(8, 5, 1.5);
    gfx.fillCircle(12, 5, 1.5);
    gfx.lineStyle(2, 0x888888);
    gfx.lineBetween(15, 14, 17, 4);
    gfx.fillStyle(0xAAAAAA);
    gfx.fillTriangle(17, 4, 15, 6, 19, 6);
    gfx.generateTexture("goatman", 20, 20);
  }

  drawBloodHawk(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF4444);
    gfx.fillEllipse(12, 10, 10, 6);
    gfx.fillStyle(0xCC0000);
    gfx.fillTriangle(20, 8, 24, 10, 20, 12);
    gfx.fillCircle(18, 10, 3);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(19, 9, 1);
    gfx.fillStyle(0xAA0000);
    gfx.fillTriangle(10, 8, 4, 4, 8, 10);
    gfx.fillTriangle(10, 12, 4, 16, 8, 10);
    gfx.generateTexture("blood_hawk", 26, 20);
  }

  drawFrostZombie(gfx) {
    gfx.clear();
    gfx.fillStyle(0x87CEEB);
    gfx.fillEllipse(10, 12, 11, 10);
    gfx.fillStyle(0xB0E0E6);
    gfx.fillTriangle(4, 8, 6, 4, 8, 8);
    gfx.fillTriangle(14, 10, 16, 6, 18, 10);
    gfx.fillStyle(0xADD8E6);
    gfx.fillCircle(10, 5, 6);
    gfx.fillStyle(0x00FFFF);
    gfx.fillCircle(7, 4, 1.5);
    gfx.fillCircle(13, 4, 1.5);
    gfx.generateTexture("frost_zombie", 20, 20);
  }

  drawFrostMaggot(gfx) {
    gfx.clear();
    gfx.fillStyle(0xB0E0E6);
    gfx.fillCircle(4, 6, 3);
    gfx.fillCircle(8, 6, 3.5);
    gfx.fillCircle(12, 6, 3);
    gfx.fillStyle(0xFFFFFF);
    gfx.fillTriangle(6, 3, 8, 1, 10, 3);
    gfx.generateTexture("frost_maggot", 18, 12);
  }

  drawDemonTrooper(gfx) {
    gfx.clear();
    gfx.fillStyle(0x8B0000);
    gfx.fillEllipse(10, 11, 12, 10);
    gfx.fillStyle(0x444444);
    gfx.fillRect(6, 8, 8, 4);
    gfx.fillStyle(0x333333);
    gfx.fillCircle(10, 5, 6);
    gfx.fillStyle(0x666666);
    gfx.fillTriangle(5, 3, 7, 0, 9, 3);
    gfx.fillTriangle(15, 3, 13, 0, 11, 3);
    gfx.fillStyle(0xFF0000);
    gfx.fillCircle(8, 5, 1.5);
    gfx.fillCircle(12, 5, 1.5);
    gfx.lineStyle(2, 0xFF4500);
    gfx.lineBetween(16, 14, 18, 3);
    gfx.fillStyle(0xFF6600);
    gfx.fillTriangle(18, 3, 16, 5, 20, 5);
    gfx.generateTexture("demon_trooper", 22, 22);
  }

  drawWraith(gfx) {
    gfx.clear();
    gfx.fillStyle(0x9370DB);
    gfx.fillTriangle(10, 4, 4, 18, 16, 18);
    gfx.fillStyle(0xBA55D3);
    gfx.fillCircle(10, 6, 4);
    gfx.fillStyle(0xFFFFFF);
    gfx.fillCircle(8, 6, 1.5);
    gfx.fillCircle(12, 6, 1.5);
    gfx.fillStyle(0x9370DB);
    gfx.fillCircle(8, 6, 0.8);
    gfx.fillCircle(12, 6, 0.8);
    gfx.lineStyle(1, 0x9370DB, 0.5);
    gfx.lineBetween(6, 12, 3, 16);
    gfx.lineBetween(14, 12, 17, 16);
    gfx.generateTexture("wraith", 20, 20);
  }

  drawCouncilMember(gfx) {
    gfx.clear();
    gfx.fillStyle(0x4B0082);
    gfx.fillTriangle(10, 4, 4, 18, 16, 18);
    gfx.fillStyle(0x2E0050);
    gfx.fillCircle(10, 6, 5);
    gfx.fillStyle(0xFF00FF);
    gfx.fillCircle(8, 6, 1.5);
    gfx.fillCircle(12, 6, 1.5);
    gfx.lineStyle(2, 0xFFD700);
    gfx.lineBetween(14, 16, 16, 2);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(16, 2, 2);
    gfx.generateTexture("council_member", 20, 20);
  }

  drawHellBovine(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFFFFFF);
    gfx.fillEllipse(14, 12, 14, 10);
    gfx.fillStyle(0xEEEEEE);
    gfx.fillCircle(22, 8, 6);
    gfx.fillStyle(0xCC0000);
    gfx.fillTriangle(18, 4, 20, 0, 22, 4);
    gfx.fillTriangle(26, 4, 24, 0, 22, 4);
    gfx.fillStyle(0xFF0000);
    gfx.fillCircle(20, 7, 1.5);
    gfx.fillCircle(24, 7, 1.5);
    gfx.lineStyle(2, 0x888888);
    gfx.lineBetween(6, 14, 4, 4);
    gfx.lineBetween(2, 6, 6, 6);
    gfx.generateTexture("hell_bovine", 28, 20);
  }

  drawFirebolt(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF4500);
    gfx.fillCircle(6, 6, 5);
    gfx.fillStyle(0xFF6600);
    gfx.fillCircle(6, 5, 3.5);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(6, 4, 2);
    gfx.fillStyle(0xFF4500, 0.5);
    gfx.fillEllipse(2, 6, 3, 4);
    gfx.generateTexture("firebolt", 12, 12);
  }

  drawIceShard(gfx) {
    gfx.clear();
    gfx.fillStyle(0x87CEEB);
    gfx.fillTriangle(6, 1, 2, 10, 10, 10);
    gfx.fillStyle(0xB0E0E6);
    gfx.fillTriangle(6, 3, 3, 9, 9, 9);
    gfx.fillStyle(0xFFFFFF);
    gfx.fillTriangle(6, 5, 4, 8, 8, 8);
    gfx.generateTexture("ice_shard", 12, 12);
  }

  drawArrow(gfx) {
    gfx.clear();
    gfx.lineStyle(1.5, 0x888888);
    gfx.lineBetween(2, 6, 10, 6);
    gfx.fillStyle(0xCCCCCC);
    gfx.fillTriangle(10, 6, 7, 4, 7, 8);
    gfx.fillStyle(0x8B4513);
    gfx.fillTriangle(2, 6, 4, 4, 4, 8);
    gfx.generateTexture("arrow", 12, 12);
  }

  drawLightningBolt(gfx) {
    gfx.clear();
    gfx.lineStyle(2, 0xFFFF00);
    gfx.lineBetween(2, 2, 6, 6);
    gfx.lineBetween(6, 6, 4, 10);
    gfx.lineBetween(4, 10, 10, 10);
    gfx.lineStyle(1, 0xFFFFFF);
    gfx.lineBetween(3, 3, 6, 6);
    gfx.lineBetween(6, 6, 5, 9);
    gfx.generateTexture("lightning_bolt", 12, 12);
  }

  drawPoisonOrb(gfx) {
    gfx.clear();
    gfx.fillStyle(0x32CD32);
    gfx.fillCircle(6, 6, 5);
    gfx.fillStyle(0x7CFC00);
    gfx.fillCircle(6, 6, 3);
    gfx.fillStyle(0x90EE90);
    gfx.fillCircle(4, 4, 1);
    gfx.fillCircle(8, 7, 1);
    gfx.generateTexture("poison_orb", 12, 12);
  }

  drawBoneShard(gfx) {
    gfx.clear();
    gfx.fillStyle(0xDDDDDD);
    gfx.fillTriangle(2, 8, 10, 4, 10, 8);
    gfx.fillStyle(0xEEEEEE);
    gfx.fillTriangle(3, 7, 9, 4, 9, 7);
    gfx.generateTexture("bone_shard", 12, 12);
  }

  drawHolyBolt(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFFD700);
    gfx.fillStar(6, 6, 5, 3);
    gfx.fillStyle(0xFFFF00);
    gfx.fillStar(6, 6, 3, 3);
    gfx.generateTexture("holy_bolt", 12, 12);
  }

  drawMeteor(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF4500);
    gfx.fillCircle(12, 12, 10);
    gfx.fillStyle(0xFF6600);
    gfx.fillCircle(12, 10, 7);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(12, 8, 4);
    gfx.fillStyle(0xFF4500, 0.6);
    gfx.fillTriangle(2, 22, 12, 12, 22, 22);
    gfx.generateTexture("meteor", 24, 24);
  }

  drawFistOfHeavens(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFFD700);
    gfx.fillTriangle(6, 1, 2, 10, 10, 10);
    gfx.fillStyle(0xFFFF00);
    gfx.fillTriangle(6, 3, 3, 9, 9, 9);
    gfx.fillStyle(0xFFFFFF, 0.3);
    gfx.fillCircle(6, 6, 8);
    gfx.generateTexture("fist_of_heavens", 12, 12);
  }

  drawHydraHead(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF6600);
    gfx.fillEllipse(8, 6, 8, 5);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(11, 5, 1.5);
    gfx.fillStyle(0xFF4500);
    gfx.fillTriangle(14, 6, 18, 4, 18, 8);
    gfx.generateTexture("hydra_head", 20, 12);
  }

  drawExplosion(gfx) {
    gfx.clear();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      const d = 4 + Math.random() * 6;
      gfx.fillStyle(0xFF4500);
      gfx.fillCircle(16 + Math.cos(a) * d, 16 + Math.sin(a) * d, 3 + Math.random() * 3);
    }
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(16, 16, 6);
    gfx.generateTexture("explosion", 32, 32);
  }

  drawBloodSplatter(gfx) {
    gfx.clear();
    gfx.fillStyle(0x8B0000);
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * 8;
      gfx.fillCircle(8 + Math.cos(a) * d, 8 + Math.sin(a) * d, 1 + Math.random() * 2);
    }
    gfx.generateTexture("blood_splatter", 16, 16);
  }

  drawIceNova(gfx) {
    gfx.clear();
    gfx.lineStyle(2, 0x87CEEB);
    gfx.strokeCircle(16, 16, 10);
    gfx.lineStyle(1, 0xB0E0E6);
    gfx.strokeCircle(16, 16, 6);
    gfx.fillStyle(0xFFFFFF, 0.3);
    gfx.fillCircle(16, 16, 14);
    gfx.generateTexture("ice_nova", 32, 32);
  }

  drawPoisonPool(gfx) {
    gfx.clear();
    gfx.fillStyle(0x32CD32, 0.6);
    gfx.fillCircle(16, 16, 14);
    gfx.fillStyle(0x7CFC00, 0.4);
    gfx.fillCircle(16, 16, 10);
    gfx.fillStyle(0x90EE90);
    gfx.fillCircle(10, 12, 2);
    gfx.fillCircle(20, 18, 2);
    gfx.fillCircle(14, 20, 1.5);
    gfx.generateTexture("poison_pool", 32, 32);
  }

  drawLightningNova(gfx) {
    gfx.clear();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i;
      gfx.lineStyle(2, 0xFFFF00);
      gfx.lineBetween(16, 16, 16 + Math.cos(a) * 12, 16 + Math.sin(a) * 12);
    }
    gfx.fillStyle(0xFFFFFF, 0.3);
    gfx.fillCircle(16, 16, 8);
    gfx.generateTexture("lightning_nova", 32, 32);
  }

  drawXPGem(gfx) {
    gfx.clear();
    gfx.fillStyle(0x00FFFF);
    gfx.fillTriangle(6, 2, 2, 6, 10, 6);
    gfx.fillTriangle(6, 10, 2, 6, 10, 6);
    gfx.fillStyle(0xFFFFFF);
    gfx.fillTriangle(6, 3, 3, 6, 9, 6);
    gfx.generateTexture("xp_gem", 12, 12);
  }

  drawGoldCoin(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFFD700);
    gfx.fillCircle(6, 6, 5);
    gfx.fillStyle(0xFFFF00);
    gfx.fillCircle(6, 6, 3);
    gfx.fillStyle(0xFFD700);
    gfx.fillCircle(6, 6, 1.5);
    gfx.generateTexture("gold_coin", 12, 12);
  }

  drawHealthPotion(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF0000);
    gfx.fillRect(4, 6, 4, 6);
    gfx.fillRect(3, 8, 6, 4);
    gfx.fillRect(5, 4, 2, 2);
    gfx.fillStyle(0x8B4513);
    gfx.fillRect(5, 3, 2, 1);
    gfx.fillStyle(0xFF6666, 0.3);
    gfx.fillCircle(6, 9, 5);
    gfx.generateTexture("health_potion", 12, 12);
  }

  drawUIPanel(gfx) {
    gfx.clear();
    gfx.fillStyle(0x1A1A2E);
    gfx.fillRect(0, 0, 16, 16);
    gfx.lineStyle(1, 0x3498DB);
    gfx.strokeRect(0, 0, 16, 16);
    gfx.generateTexture("ui_panel", 16, 16);
  }

  drawHealthOrb(gfx) {
    gfx.clear();
    gfx.fillStyle(0x330000);
    gfx.fillCircle(16, 16, 16);
    gfx.fillStyle(0xFF0000);
    gfx.fillCircle(16, 16, 14);
    gfx.generateTexture("health_orb", 32, 32);
  }

  drawWeaponIcon(gfx) {
    gfx.clear();
    gfx.fillStyle(0x666666);
    gfx.fillCircle(8, 8, 7);
    gfx.fillStyle(0x888888);
    gfx.fillCircle(8, 8, 4);
    gfx.generateTexture("weapon_icon", 16, 16);
  }
}
