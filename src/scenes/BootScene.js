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

    try {
      // ========== ENEMIES ==========
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

      // ========== PROJECTILES ==========
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

      // ========== EFFECTS ==========
      this.drawExplosion(gfx);
      this.drawBloodSplatter(gfx);
      this.drawIceNova(gfx);
      this.drawPoisonPool(gfx);
      this.drawLightningNova(gfx);

      // ========== PICKUPS ==========
      this.drawXPGem(gfx);
      this.drawGoldCoin(gfx);
      this.drawHealthPotion(gfx);

      // ========== PLAYERS ==========
      this.drawPlayerBarbarian(gfx);
      this.drawPlayerSorceress(gfx);
      this.drawPlayerNecromancer(gfx);
      this.drawPlayerAmazon(gfx);

      // ========== OBSTACLES ==========
      this.drawDeadTree(gfx);
      this.drawPillar(gfx);
      this.drawRock(gfx);
      this.drawDemonStatue(gfx);
      this.drawBurningDebris(gfx);
      this.drawFrostZone(gfx);
      this.drawLightningStrike(gfx);
      this.drawFirePit(gfx);

      // ========== UI ==========
      this.drawUIPanel(gfx);
      this.drawHealthOrb(gfx);
      this.drawWeaponIcon(gfx);

      gfx.destroy();
      this.scene.start("PreloadScene");
    } catch (err) {
      console.error("BootScene error:", err);
      const debug = this.add.text(10, 10, "ERROR: " + err.message, { fontSize: "12px", color: "#ff0000" });
    }
  }

  // ========== ENEMIES (24x24 for more detail) ==========
  drawFallen(gfx) {
    gfx.clear();
    // Body
    gfx.fillStyle(0x8B0000, 1);
    gfx.fillEllipse(12, 16, 10, 8, 16);
    // Head
    gfx.fillStyle(0xCC4444, 1);
    gfx.fillCircle(12, 8, 6);
    // Horns
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillTriangle(7, 4, 9, 0, 11, 4);
    gfx.fillTriangle(17, 4, 15, 0, 13, 4);
    // Eyes
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(9, 8, 1.5);
    gfx.fillCircle(15, 8, 1.5);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 8, 0.7);
    gfx.fillCircle(15, 8, 0.7);
    // Sword
    gfx.lineStyle(2, 0x888888, 1);
    gfx.beginPath();
    gfx.moveTo(17, 14);
    gfx.lineTo(20, 4);
    gfx.strokePath();
    gfx.fillStyle(0xCCCCCC, 1);
    gfx.fillTriangle(20, 4, 18, 7, 22, 7);
    gfx.generateTexture("fallen", 24, 24);
  }

  drawFallenShaman(gfx) {
    gfx.clear();
    gfx.fillStyle(0x660000, 1);
    gfx.fillEllipse(12, 17, 12, 9, 16);
    gfx.fillStyle(0xFF6600, 1);
    gfx.fillCircle(12, 8, 7);
    // Horns
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillTriangle(6, 4, 9, 0, 11, 4);
    gfx.fillTriangle(18, 4, 15, 0, 13, 4);
    // Glowing green eyes
    gfx.fillStyle(0x00FF00, 1);
    gfx.fillCircle(9, 8, 2);
    gfx.fillCircle(15, 8, 2);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 8, 1);
    gfx.fillCircle(15, 8, 1);
    // Staff
    gfx.lineStyle(2, 0x8B4513, 1);
    gfx.beginPath();
    gfx.moveTo(18, 18);
    gfx.lineTo(20, 3);
    gfx.strokePath();
    gfx.fillStyle(0xFF4500, 1);
    gfx.fillCircle(20, 3, 3);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(20, 3, 1.5);
    gfx.generateTexture("fallen_shaman", 24, 24);
  }

  drawCarver(gfx) {
    gfx.clear();
    // Hunched body
    gfx.fillStyle(0xAA2222, 1);
    gfx.fillEllipse(12, 15, 9, 8, 16);
    // Pointed head
    gfx.fillStyle(0xCC0000, 1);
    gfx.fillTriangle(12, 4, 6, 10, 18, 10);
    // White eyes
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillCircle(9, 8, 2);
    gfx.fillCircle(15, 8, 2);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 8, 1);
    gfx.fillCircle(15, 8, 1);
    // Claws
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillTriangle(4, 14, 1, 18, 6, 16);
    gfx.fillTriangle(20, 14, 23, 18, 18, 16);
    gfx.generateTexture("carver", 24, 24);
  }

  drawZombie(gfx) {
    gfx.clear();
    // Rotting body
    gfx.fillStyle(0x556B2F, 1);
    gfx.fillEllipse(12, 17, 11, 9, 16);
    // Decaying head
    gfx.fillStyle(0x6B8E23, 1);
    gfx.fillCircle(12, 8, 7);
    // Mouth
    gfx.fillStyle(0x000000, 1);
    gfx.fillEllipse(12, 10, 5, 2, 8);
    // Dead eyes
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillCircle(9, 7, 1.5);
    gfx.fillCircle(15, 7, 1.5);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 7, 0.5);
    gfx.fillCircle(15, 7, 0.5);
    // Arms
    gfx.lineStyle(2, 0x556B2F, 1);
    gfx.beginPath();
    gfx.moveTo(5, 14);
    gfx.lineTo(2, 10);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(19, 14);
    gfx.lineTo(22, 10);
    gfx.strokePath();
    gfx.generateTexture("zombie", 24, 24);
  }

  drawSkeleton(gfx) {
    gfx.clear();
    // Spine
    gfx.lineStyle(2, 0xDDDDDD, 1);
    gfx.beginPath();
    gfx.moveTo(12, 7);
    gfx.lineTo(12, 18);
    gfx.strokePath();
    // Ribs
    gfx.beginPath();
    gfx.moveTo(8, 10);
    gfx.lineTo(16, 10);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(8, 13);
    gfx.lineTo(16, 13);
    gfx.strokePath();
    // Skull
    gfx.fillStyle(0xEEEEEE, 1);
    gfx.fillCircle(12, 6, 6);
    // Eye sockets
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 5, 2);
    gfx.fillCircle(15, 5, 2);
    // Sword
    gfx.lineStyle(2, 0xAAAAAA, 1);
    gfx.beginPath();
    gfx.moveTo(17, 16);
    gfx.lineTo(20, 4);
    gfx.strokePath();
    gfx.fillStyle(0xCCCCCC, 1);
    gfx.fillTriangle(20, 4, 18, 7, 22, 7);
    gfx.generateTexture("skeleton_warrior", 24, 24);
  }

  drawVileMother(gfx) {
    gfx.clear();
    // Bulbous body
    gfx.fillStyle(0x8B008B, 1);
    gfx.fillEllipse(12, 16, 13, 10, 16);
    // Many eyes
    gfx.fillStyle(0x9932CC, 1);
    gfx.fillCircle(12, 7, 7);
    gfx.fillStyle(0x00FF00, 1);
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 / 5) * i;
      gfx.fillCircle(12 + Math.cos(a) * 3, 7 + Math.sin(a) * 2, 1.2);
    }
    // Tentacle legs
    gfx.lineStyle(2, 0x8B008B, 1);
    gfx.beginPath();
    gfx.moveTo(6, 18);
    gfx.lineTo(4, 22);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(12, 19);
    gfx.lineTo(12, 23);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(18, 18);
    gfx.lineTo(20, 22);
    gfx.strokePath();
    gfx.generateTexture("vile_mother", 24, 24);
  }

  drawMaggot(gfx) {
    gfx.clear();
    // Segmented body
    gfx.fillStyle(0x90EE90, 1);
    gfx.fillCircle(5, 10, 4);
    gfx.fillCircle(10, 10, 4.5);
    gfx.fillCircle(15, 10, 4);
    gfx.fillCircle(19, 10, 3);
    // Mandibles
    gfx.fillStyle(0x7CFC00, 1);
    gfx.fillTriangle(21, 8, 23, 10, 21, 12);
    // Black eye
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(20, 9, 1);
    gfx.generateTexture("maggot", 24, 20);
  }

  drawGoatman(gfx) {
    gfx.clear();
    // Furry body
    gfx.fillStyle(0x8B4513, 1);
    gfx.fillEllipse(12, 16, 11, 9, 16);
    // Goat head
    gfx.fillStyle(0xA0522D, 1);
    gfx.fillEllipse(12, 7, 8, 7, 16);
    // Curved horns
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillTriangle(7, 4, 5, 0, 9, 3);
    gfx.fillTriangle(17, 4, 19, 0, 15, 3);
    // Red eyes
    gfx.fillStyle(0xFF0000, 1);
    gfx.fillCircle(9, 7, 1.5);
    gfx.fillCircle(15, 7, 1.5);
    // Axe
    gfx.lineStyle(2, 0x888888, 1);
    gfx.beginPath();
    gfx.moveTo(18, 16);
    gfx.lineTo(21, 4);
    gfx.strokePath();
    gfx.fillStyle(0xAAAAAA, 1);
    gfx.fillTriangle(21, 4, 19, 7, 23, 7);
    gfx.generateTexture("goatman", 24, 24);
  }

  drawBloodHawk(gfx) {
    gfx.clear();
    // Body
    gfx.fillStyle(0xFF4444, 1);
    gfx.fillEllipse(12, 12, 10, 6, 16);
    // Head
    gfx.fillStyle(0xCC0000, 1);
    gfx.fillTriangle(20, 10, 24, 12, 20, 14);
    gfx.fillCircle(18, 12, 3);
    // Yellow eye
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(19, 11, 1);
    // Wings
    gfx.fillStyle(0xAA0000, 1);
    gfx.fillTriangle(10, 10, 2, 4, 8, 12);
    gfx.fillTriangle(10, 14, 2, 20, 8, 12);
    gfx.generateTexture("blood_hawk", 26, 24);
  }

  drawFrostZombie(gfx) {
    gfx.clear();
    // Ice-covered body
    gfx.fillStyle(0x87CEEB, 1);
    gfx.fillEllipse(12, 17, 11, 9, 16);
    // Icicles
    gfx.fillStyle(0xB0E0E6, 1);
    gfx.fillTriangle(5, 10, 7, 4, 9, 10);
    gfx.fillTriangle(15, 12, 17, 6, 19, 12);
    // Frozen head
    gfx.fillStyle(0xADD8E6, 1);
    gfx.fillCircle(12, 7, 7);
    // Cyan eyes
    gfx.fillStyle(0x00FFFF, 1);
    gfx.fillCircle(9, 6, 2);
    gfx.fillCircle(15, 6, 2);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 6, 0.8);
    gfx.fillCircle(15, 6, 0.8);
    gfx.generateTexture("frost_zombie", 24, 24);
  }

  drawFrostMaggot(gfx) {
    gfx.clear();
    gfx.fillStyle(0xB0E0E6, 1);
    gfx.fillCircle(5, 10, 4);
    gfx.fillCircle(10, 10, 4.5);
    gfx.fillCircle(15, 10, 4);
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillTriangle(8, 6, 10, 3, 12, 6);
    gfx.fillTriangle(13, 7, 15, 4, 17, 7);
    gfx.generateTexture("frost_maggot", 24, 20);
  }

  drawDemonTrooper(gfx) {
    gfx.clear();
    // Armored body
    gfx.fillStyle(0x8B0000, 1);
    gfx.fillEllipse(12, 16, 12, 10, 16);
    // Chest plate
    gfx.fillStyle(0x444444, 1);
    gfx.fillRect(7, 11, 10, 5);
    // Horned helmet
    gfx.fillStyle(0x333333, 1);
    gfx.fillCircle(12, 7, 7);
    gfx.fillStyle(0x666666, 1);
    gfx.fillTriangle(6, 4, 9, 0, 11, 4);
    gfx.fillTriangle(18, 4, 15, 0, 13, 4);
    // Glowing red eyes
    gfx.fillStyle(0xFF0000, 1);
    gfx.fillCircle(9, 7, 2);
    gfx.fillCircle(15, 7, 2);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(9, 7, 0.8);
    gfx.fillCircle(15, 7, 0.8);
    // Flame sword
    gfx.lineStyle(2, 0xFF4500, 1);
    gfx.beginPath();
    gfx.moveTo(18, 16);
    gfx.lineTo(21, 3);
    gfx.strokePath();
    gfx.fillStyle(0xFF6600, 1);
    gfx.fillTriangle(21, 3, 19, 6, 23, 6);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(21, 3, 2);
    gfx.generateTexture("demon_trooper", 24, 24);
  }

  drawWraith(gfx) {
    gfx.clear();
    // Ghostly body
    gfx.fillStyle(0x9370DB, 1);
    gfx.fillTriangle(12, 4, 4, 20, 20, 20);
    // Hood
    gfx.fillStyle(0xBA55D3, 1);
    gfx.fillCircle(12, 7, 5);
    // Glowing eyes
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillCircle(9, 7, 2);
    gfx.fillCircle(15, 7, 2);
    gfx.fillStyle(0x9370DB, 1);
    gfx.fillCircle(9, 7, 1);
    gfx.fillCircle(15, 7, 1);
    // Ethereal arms
    gfx.lineStyle(1, 0x9370DB, 0.5);
    gfx.beginPath();
    gfx.moveTo(7, 13);
    gfx.lineTo(3, 18);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(17, 13);
    gfx.lineTo(21, 18);
    gfx.strokePath();
    gfx.generateTexture("wraith", 24, 24);
  }

  drawCouncilMember(gfx) {
    gfx.clear();
    // Robed body
    gfx.fillStyle(0x4B0082, 1);
    gfx.fillTriangle(12, 4, 5, 20, 19, 20);
    // Hooded head
    gfx.fillStyle(0x2E0050, 1);
    gfx.fillCircle(12, 7, 6);
    // Pink eyes
    gfx.fillStyle(0xFF00FF, 1);
    gfx.fillCircle(9, 7, 2);
    gfx.fillCircle(15, 7, 2);
    // Golden staff
    gfx.lineStyle(2, 0xFFD700, 1);
    gfx.beginPath();
    gfx.moveTo(17, 18);
    gfx.lineTo(19, 3);
    gfx.strokePath();
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(19, 3, 2);
    gfx.generateTexture("council_member", 24, 24);
  }

  drawHellBovine(gfx) {
    gfx.clear();
    // White cow body
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillEllipse(14, 15, 14, 10, 16);
    // Head
    gfx.fillStyle(0xEEEEEE, 1);
    gfx.fillCircle(20, 9, 7);
    // Red horns
    gfx.fillStyle(0xCC0000, 1);
    gfx.fillTriangle(15, 5, 17, 0, 19, 5);
    gfx.fillTriangle(25, 5, 23, 0, 21, 5);
    // Angry eyes
    gfx.fillStyle(0xFF0000, 1);
    gfx.fillCircle(18, 8, 2);
    gfx.fillCircle(22, 8, 2);
    // Pitchfork
    gfx.lineStyle(2, 0x888888, 1);
    gfx.beginPath();
    gfx.moveTo(6, 16);
    gfx.lineTo(4, 4);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(2, 6);
    gfx.lineTo(6, 6);
    gfx.strokePath();
    gfx.generateTexture("hell_bovine", 28, 24);
  }

  // ========== PROJECTILES (16x16) ==========
  drawFirebolt(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF4500, 1);
    gfx.fillCircle(8, 8, 6);
    gfx.fillStyle(0xFF6600, 1);
    gfx.fillCircle(8, 7, 4);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(8, 6, 2);
    gfx.fillStyle(0xFF4500, 0.5);
    gfx.fillEllipse(3, 8, 4, 6, 8);
    gfx.generateTexture("firebolt", 16, 16);
  }

  drawIceShard(gfx) {
    gfx.clear();
    gfx.fillStyle(0x87CEEB, 1);
    gfx.fillTriangle(8, 1, 2, 14, 14, 14);
    gfx.fillStyle(0xB0E0E6, 1);
    gfx.fillTriangle(8, 3, 4, 12, 12, 12);
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillTriangle(8, 6, 5, 11, 11, 11);
    gfx.generateTexture("ice_shard", 16, 16);
  }

  drawArrow(gfx) {
    gfx.clear();
    gfx.lineStyle(2, 0x888888, 1);
    gfx.beginPath();
    gfx.moveTo(2, 8);
    gfx.lineTo(13, 8);
    gfx.strokePath();
    gfx.fillStyle(0xCCCCCC, 1);
    gfx.fillTriangle(13, 8, 9, 5, 9, 11);
    gfx.fillStyle(0x8B4513, 1);
    gfx.fillTriangle(2, 8, 5, 5, 5, 11);
    gfx.generateTexture("arrow", 16, 16);
  }

  drawLightningBolt(gfx) {
    gfx.clear();
    gfx.lineStyle(3, 0xFFFF00, 1);
    gfx.beginPath();
    gfx.moveTo(2, 2);
    gfx.lineTo(7, 7);
    gfx.lineTo(4, 12);
    gfx.lineTo(13, 12);
    gfx.strokePath();
    gfx.lineStyle(1, 0xFFFFFF, 1);
    gfx.beginPath();
    gfx.moveTo(3, 3);
    gfx.lineTo(7, 7);
    gfx.lineTo(5, 11);
    gfx.strokePath();
    gfx.generateTexture("lightning_bolt", 16, 16);
  }

  drawPoisonOrb(gfx) {
    gfx.clear();
    gfx.fillStyle(0x32CD32, 1);
    gfx.fillCircle(8, 8, 6);
    gfx.fillStyle(0x7CFC00, 1);
    gfx.fillCircle(8, 8, 4);
    gfx.fillStyle(0x90EE90, 1);
    gfx.fillCircle(5, 5, 1.5);
    gfx.fillCircle(11, 10, 1.5);
    gfx.generateTexture("poison_orb", 16, 16);
  }

  drawBoneShard(gfx) {
    gfx.clear();
    gfx.fillStyle(0xDDDDDD, 1);
    gfx.fillTriangle(2, 11, 13, 5, 13, 11);
    gfx.fillStyle(0xEEEEEE, 1);
    gfx.fillTriangle(3, 10, 12, 5, 12, 10);
    gfx.generateTexture("bone_shard", 16, 16);
  }

  drawHolyBolt(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillTriangle(8, 1, 5, 7, 11, 7);
    gfx.fillTriangle(8, 15, 5, 9, 11, 9);
    gfx.fillTriangle(1, 8, 7, 5, 7, 11);
    gfx.fillTriangle(15, 8, 9, 5, 9, 11);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(8, 8, 2.5);
    gfx.generateTexture("holy_bolt", 16, 16);
  }

  drawMeteor(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF4500, 1);
    gfx.fillCircle(16, 16, 12);
    gfx.fillStyle(0xFF6600, 1);
    gfx.fillCircle(16, 14, 9);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(16, 11, 5);
    gfx.fillStyle(0xFF4500, 0.6);
    gfx.fillTriangle(4, 28, 16, 16, 28, 28);
    gfx.generateTexture("meteor", 32, 32);
  }

  drawFistOfHeavens(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillTriangle(8, 1, 2, 14, 14, 14);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillTriangle(8, 3, 4, 12, 12, 12);
    gfx.fillStyle(0xFFFFFF, 0.3);
    gfx.fillCircle(8, 8, 10);
    gfx.generateTexture("fist_of_heavens", 16, 16);
  }

  drawHydraHead(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF6600, 1);
    gfx.fillEllipse(10, 8, 10, 6, 16);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(14, 6, 2);
    gfx.fillStyle(0xFF4500, 1);
    gfx.fillTriangle(16, 8, 20, 5, 20, 11);
    gfx.generateTexture("hydra_head", 24, 16);
  }

  // ========== EFFECTS ==========
  drawExplosion(gfx) {
    gfx.clear();
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 / 10) * i;
      const d = 5 + Math.random() * 8;
      gfx.fillStyle(0xFF4500, 1);
      gfx.fillCircle(16 + Math.cos(a) * d, 16 + Math.sin(a) * d, 3 + Math.random() * 4);
    }
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(16, 16, 7);
    gfx.generateTexture("explosion", 32, 32);
  }

  drawBloodSplatter(gfx) {
    gfx.clear();
    gfx.fillStyle(0x8B0000, 1);
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * 10;
      gfx.fillCircle(8 + Math.cos(a) * d, 8 + Math.sin(a) * d, 1 + Math.random() * 3);
    }
    gfx.generateTexture("blood_splatter", 16, 16);
  }

  drawIceNova(gfx) {
    gfx.clear();
    gfx.lineStyle(3, 0x87CEEB, 1);
    gfx.strokeCircle(16, 16, 12);
    gfx.lineStyle(2, 0xB0E0E6, 1);
    gfx.strokeCircle(16, 16, 7);
    gfx.fillStyle(0xFFFFFF, 0.3);
    gfx.fillCircle(16, 16, 16);
    gfx.generateTexture("ice_nova", 32, 32);
  }

  drawPoisonPool(gfx) {
    gfx.clear();
    gfx.fillStyle(0x32CD32, 0.6);
    gfx.fillCircle(16, 16, 15);
    gfx.fillStyle(0x7CFC00, 0.4);
    gfx.fillCircle(16, 16, 11);
    gfx.fillStyle(0x90EE90, 1);
    gfx.fillCircle(10, 12, 2.5);
    gfx.fillCircle(22, 18, 2.5);
    gfx.fillCircle(14, 21, 2);
    gfx.generateTexture("poison_pool", 32, 32);
  }

  drawLightningNova(gfx) {
    gfx.clear();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      gfx.lineStyle(2, 0xFFFF00, 1);
      gfx.beginPath();
      gfx.moveTo(16, 16);
      gfx.lineTo(16 + Math.cos(a) * 14, 16 + Math.sin(a) * 14);
      gfx.strokePath();
    }
    gfx.fillStyle(0xFFFFFF, 0.3);
    gfx.fillCircle(16, 16, 10);
    gfx.generateTexture("lightning_nova", 32, 32);
  }

  // ========== PICKUPS ==========
  drawXPGem(gfx) {
    gfx.clear();
    gfx.fillStyle(0x00FFFF, 1);
    gfx.fillTriangle(8, 2, 2, 8, 14, 8);
    gfx.fillTriangle(8, 14, 2, 8, 14, 8);
    gfx.fillStyle(0xFFFFFF, 1);
    gfx.fillTriangle(8, 3, 3, 8, 13, 8);
    gfx.generateTexture("xp_gem", 16, 16);
  }

  drawGoldCoin(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillCircle(8, 8, 6);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(8, 8, 4);
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillCircle(8, 8, 2);
    gfx.generateTexture("gold_coin", 16, 16);
  }

  drawHealthPotion(gfx) {
    gfx.clear();
    gfx.fillStyle(0xFF0000, 1);
    gfx.fillRect(5, 7, 6, 8);
    gfx.fillRect(4, 9, 8, 6);
    gfx.fillRect(6, 5, 4, 2);
    gfx.fillStyle(0x8B4513, 1);
    gfx.fillRect(6, 4, 4, 1);
    gfx.fillStyle(0xFF6666, 0.3);
    gfx.fillCircle(8, 10, 6);
    gfx.generateTexture("health_potion", 16, 16);
  }

  // ========== PLAYERS (24x24 detailed) ==========
  drawPlayerBarbarian(gfx) {
    gfx.clear();
    // Muscular body
    gfx.fillStyle(0x8B0000, 1);
    gfx.fillEllipse(12, 17, 11, 8, 16);
    // Skin
    gfx.fillStyle(0xCC4444, 1);
    gfx.fillCircle(12, 7, 7);
    // Horned helmet
    gfx.fillStyle(0x888888, 1);
    gfx.fillTriangle(7, 3, 9, 0, 11, 3);
    gfx.fillTriangle(17, 3, 15, 0, 13, 3);
    gfx.fillRect(9, 3, 6, 4);
    // Fierce eyes
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(9, 7, 1.5);
    gfx.fillCircle(15, 7, 1.5);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 7, 0.7);
    gfx.fillCircle(15, 7, 0.7);
    // Giant axe
    gfx.lineStyle(3, 0x666666, 1);
    gfx.beginPath();
    gfx.moveTo(18, 16);
    gfx.lineTo(22, 2);
    gfx.strokePath();
    gfx.fillStyle(0x888888, 1);
    gfx.fillTriangle(22, 2, 19, 5, 25, 5);
    gfx.fillStyle(0xCCCCCC, 1);
    gfx.fillTriangle(22, 2, 20, 4, 24, 4);
    gfx.generateTexture("player_barbarian", 24, 24);
  }

  drawPlayerSorceress(gfx) {
    gfx.clear();
    // Flowing robes
    gfx.fillStyle(0x4B0082, 1);
    gfx.fillEllipse(12, 17, 10, 9, 16);
    gfx.fillStyle(0x663399, 1);
    gfx.fillTriangle(12, 8, 5, 18, 19, 18);
    // Hood
    gfx.fillStyle(0x9932CC, 1);
    gfx.fillCircle(12, 7, 7);
    // Glowing cyan eyes
    gfx.fillStyle(0x00FFFF, 1);
    gfx.fillCircle(9, 7, 2);
    gfx.fillCircle(15, 7, 2);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 7, 0.8);
    gfx.fillCircle(15, 7, 0.8);
    // Magic staff
    gfx.lineStyle(2, 0x8A2BE2, 1);
    gfx.beginPath();
    gfx.moveTo(4, 18);
    gfx.lineTo(2, 2);
    gfx.strokePath();
    gfx.fillStyle(0x9400D3, 1);
    gfx.fillCircle(2, 2, 3);
    gfx.fillStyle(0x00FFFF, 1);
    gfx.fillCircle(2, 2, 1.5);
    gfx.generateTexture("player_sorceress", 24, 24);
  }

  drawPlayerNecromancer(gfx) {
    gfx.clear();
    // Dark robes
    gfx.fillStyle(0x2F2F2F, 1);
    gfx.fillEllipse(12, 17, 10, 9, 16);
    gfx.fillStyle(0x444444, 1);
    gfx.fillTriangle(12, 8, 5, 18, 19, 18);
    // Skull-like hood
    gfx.fillStyle(0x555555, 1);
    gfx.fillCircle(12, 7, 7);
    // Glowing green eyes
    gfx.fillStyle(0x00FF00, 1);
    gfx.fillCircle(9, 7, 2);
    gfx.fillCircle(15, 7, 2);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 7, 0.8);
    gfx.fillCircle(15, 7, 0.8);
    // Bone staff
    gfx.lineStyle(2, 0x666666, 1);
    gfx.beginPath();
    gfx.moveTo(18, 18);
    gfx.lineTo(21, 2);
    gfx.strokePath();
    gfx.fillStyle(0x888888, 1);
    gfx.fillCircle(21, 2, 2.5);
    gfx.fillStyle(0x00FF00, 1);
    gfx.fillCircle(21, 2, 1);
    gfx.generateTexture("player_necromancer", 24, 24);
  }

  drawPlayerAmazon(gfx) {
    gfx.clear();
    // Athletic build
    gfx.fillStyle(0x228B22, 1);
    gfx.fillEllipse(12, 17, 10, 8, 16);
    // Skin
    gfx.fillStyle(0x32CD32, 1);
    gfx.fillCircle(12, 7, 7);
    // Tiara
    gfx.fillStyle(0xFFD700, 1);
    gfx.fillTriangle(7, 3, 9, 0, 11, 3);
    gfx.fillTriangle(17, 3, 15, 0, 13, 3);
    // Determined eyes
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(9, 7, 1.5);
    gfx.fillCircle(15, 7, 1.5);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(9, 7, 0.7);
    gfx.fillCircle(15, 7, 0.7);
    // Spear
    gfx.lineStyle(2, 0x8B4513, 1);
    gfx.beginPath();
    gfx.moveTo(4, 18);
    gfx.lineTo(1, 2);
    gfx.strokePath();
    gfx.fillStyle(0xA0522D, 1);
    gfx.fillTriangle(1, 2, 3, 5, 5, 5);
    // Shield
    gfx.fillStyle(0xFFD700, 0.3);
    gfx.fillCircle(18, 14, 4);
    gfx.generateTexture("player_amazon", 24, 24);
  }

  // ========== UI ==========
  drawUIPanel(gfx) {
    gfx.clear();
    gfx.fillStyle(0x1A1A2E, 1);
    gfx.fillRect(0, 0, 16, 16);
    gfx.lineStyle(1, 0x3498DB, 1);
    gfx.strokeRect(0, 0, 16, 16);
    gfx.generateTexture("ui_panel", 16, 16);
  }

  drawHealthOrb(gfx) {
    gfx.clear();
    gfx.fillStyle(0x330000, 1);
    gfx.fillCircle(16, 16, 16);
    gfx.fillStyle(0xFF0000, 1);
    gfx.fillCircle(16, 16, 14);
    gfx.generateTexture("health_orb", 32, 32);
  }

  drawWeaponIcon(gfx) {
    gfx.clear();
    gfx.fillStyle(0x666666, 1);
    gfx.fillCircle(8, 8, 7);
    gfx.fillStyle(0x888888, 1);
    gfx.fillCircle(8, 8, 4);
    gfx.generateTexture("weapon_icon", 16, 16);
  }

  // ========== OBSTACLES (48x48 for tile-based world) ==========
  drawDeadTree(gfx) {
    gfx.clear();
    // Trunk
    gfx.fillStyle(0x4A3728, 1);
    gfx.fillRect(20, 24, 8, 24);
    // Branches
    gfx.lineStyle(3, 0x4A3728, 1);
    gfx.beginPath();
    gfx.moveTo(24, 30);
    gfx.lineTo(10, 18);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(24, 28);
    gfx.lineTo(38, 16);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(24, 34);
    gfx.lineTo(8, 26);
    gfx.strokePath();
    // Dead leaves
    gfx.fillStyle(0x2F1B14, 1);
    gfx.fillCircle(10, 16, 5);
    gfx.fillCircle(38, 14, 4);
    gfx.fillCircle(8, 24, 4);
    gfx.fillStyle(0x1A0F0A, 1);
    gfx.fillCircle(12, 14, 3);
    gfx.fillCircle(36, 12, 2.5);
    gfx.generateTexture("dead_tree", 48, 48);
  }

  drawPillar(gfx) {
    gfx.clear();
    // Stone pillar
    gfx.fillStyle(0x666666, 1);
    gfx.fillRect(16, 8, 16, 32);
    // Top and bottom caps
    gfx.fillStyle(0x777777, 1);
    gfx.fillRect(14, 6, 20, 4);
    gfx.fillRect(14, 38, 20, 4);
    // Cracks
    gfx.lineStyle(1, 0x444444, 1);
    gfx.beginPath();
    gfx.moveTo(20, 12);
    gfx.lineTo(22, 20);
    gfx.lineTo(19, 28);
    gfx.strokePath();
    gfx.beginPath();
    gfx.moveTo(28, 15);
    gfx.lineTo(26, 25);
    gfx.strokePath();
    // Moss
    gfx.fillStyle(0x228B22, 0.4);
    gfx.fillCircle(18, 36, 3);
    gfx.fillCircle(30, 34, 2);
    gfx.generateTexture("pillar", 48, 48);
  }

  drawRock(gfx) {
    gfx.clear();
    // Main rock
    gfx.fillStyle(0x808080, 1);
    gfx.fillEllipse(24, 30, 18, 14, 32);
    // Highlight
    gfx.fillStyle(0x999999, 1);
    gfx.fillEllipse(22, 28, 12, 10, 24);
    // Shadow
    gfx.fillStyle(0x555555, 1);
    gfx.fillEllipse(26, 34, 14, 8, 28);
    // Cracks
    gfx.lineStyle(1, 0x444444, 1);
    gfx.beginPath();
    gfx.moveTo(18, 26);
    gfx.lineTo(22, 32);
    gfx.lineTo(20, 36);
    gfx.strokePath();
    gfx.generateTexture("rock", 48, 48);
  }

  drawDemonStatue(gfx) {
    gfx.clear();
    // Pedestal
    gfx.fillStyle(0x444444, 1);
    gfx.fillRect(12, 36, 24, 8);
    // Body
    gfx.fillStyle(0x333333, 1);
    gfx.fillEllipse(24, 24, 10, 14, 20);
    // Head
    gfx.fillStyle(0x222222, 1);
    gfx.fillCircle(24, 12, 7);
    // Horns
    gfx.fillStyle(0x8B0000, 1);
    gfx.fillTriangle(18, 8, 14, 2, 20, 6);
    gfx.fillTriangle(30, 8, 34, 2, 28, 6);
    // Glowing eyes
    gfx.fillStyle(0xFF0000, 1);
    gfx.fillCircle(21, 12, 1.5);
    gfx.fillCircle(27, 12, 1.5);
    gfx.generateTexture("demon_statue", 48, 48);
  }

  drawBurningDebris(gfx) {
    gfx.clear();
    // Burnt wood
    gfx.fillStyle(0x2F2F2F, 1);
    gfx.fillRect(14, 28, 20, 8);
    gfx.fillRect(18, 22, 8, 12);
    // Embers
    gfx.fillStyle(0xFF4500, 1);
    gfx.fillCircle(16, 30, 2);
    gfx.fillCircle(24, 28, 1.5);
    gfx.fillCircle(30, 32, 2);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillCircle(18, 29, 1);
    gfx.fillCircle(28, 30, 1);
    // Smoke wisps
    gfx.fillStyle(0x666666, 0.3);
    gfx.fillCircle(20, 18, 3);
    gfx.fillCircle(26, 14, 2);
    gfx.generateTexture("burning_debris", 48, 48);
  }

  drawFrostZone(gfx) {
    gfx.clear();
    gfx.fillStyle(0x87CEEB, 0.4);
    gfx.fillCircle(24, 24, 20);
    gfx.fillStyle(0xB0E0E6, 0.3);
    gfx.fillCircle(24, 24, 14);
    // Ice crystals
    gfx.fillStyle(0xFFFFFF, 0.6);
    gfx.fillTriangle(24, 8, 20, 16, 28, 16);
    gfx.fillTriangle(12, 20, 8, 28, 16, 28);
    gfx.fillTriangle(32, 20, 28, 28, 36, 28);
    gfx.generateTexture("frost_zone", 48, 48);
  }

  drawLightningStrike(gfx) {
    gfx.clear();
    gfx.fillStyle(0x444444, 0.3);
    gfx.fillCircle(24, 40, 8);
    gfx.lineStyle(3, 0xFFFF00, 1);
    gfx.beginPath();
    gfx.moveTo(24, 4);
    gfx.lineTo(20, 16);
    gfx.lineTo(28, 24);
    gfx.lineTo(22, 32);
    gfx.lineTo(26, 40);
    gfx.strokePath();
    gfx.lineStyle(1, 0xFFFFFF, 1);
    gfx.beginPath();
    gfx.moveTo(25, 6);
    gfx.lineTo(22, 14);
    gfx.lineTo(26, 22);
    gfx.strokePath();
    gfx.generateTexture("lightning_strike", 48, 48);
  }

  drawFirePit(gfx) {
    gfx.clear();
    // Pit
    gfx.fillStyle(0x330000, 1);
    gfx.fillCircle(24, 28, 14);
    // Fire
    gfx.fillStyle(0xFF4500, 1);
    gfx.fillTriangle(24, 10, 16, 28, 32, 28);
    gfx.fillStyle(0xFF6600, 1);
    gfx.fillTriangle(24, 14, 18, 26, 30, 26);
    gfx.fillStyle(0xFFFF00, 1);
    gfx.fillTriangle(24, 18, 20, 24, 28, 24);
    // Glow
    gfx.fillStyle(0xFF4500, 0.2);
    gfx.fillCircle(24, 24, 20);
    gfx.generateTexture("fire_pit", 48, 48);
  }
}
