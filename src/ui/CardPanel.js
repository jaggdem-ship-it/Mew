export class CardPanel {
  constructor(scene) {
    this.scene = scene;
    this.cards = [];
    this.container = null;
  }

  show(cards, onSelect) {
    this.hide();
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(100);

    const bg = this.scene.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.8);
    this.container.add(bg);

    const title = this.scene.add.text(w / 2, 40, "LEVEL UP!", {
      fontSize: "20px", color: "#ffd700", fontStyle: "bold"
    }).setOrigin(0.5);
    this.container.add(title);

    const cardW = 90;
    const cardH = 120;
    const spacing = 15;
    const startX = w / 2 - (cards.length * cardW + (cards.length - 1) * spacing) / 2 + cardW / 2;

    cards.forEach((card, i) => {
      const cx = startX + i * (cardW + spacing);
      const cy = h / 2;

      const panel = this.scene.add.rectangle(cx, cy, cardW, cardH, 0x1a1a2e);
      panel.setStrokeStyle(2, 0x3498db);
      panel.setInteractive({ useHandCursor: true });
      this.container.add(panel);

      let label = "";
      let desc = "";
      let color = "#ffffff";

      if (card.type === "weapon") {
        const def = this.scene.runState.weaponDefs[card.key];
        label = def.name;
        desc = card.isNew ? "New Weapon" : "Upgrade";
        color = "#ff6666";
      } else if (card.type === "passive") {
        const def = this.scene.runState.passiveDefs[card.key];
        label = def.name;
        desc = card.isNew ? "New Passive" : "Upgrade";
        color = "#66ff66";
      } else if (card.type === "weapon_upgrade") {
        const def = this.scene.runState.weaponDefs[card.key];
        label = def.name;
        desc = card.isEvolution ? "EVOLVE!" : `Lv.${this.scene.runState.weapons[card.key] + 1}`;
        color = card.isEvolution ? "#ffd700" : "#ff6666";
      } else if (card.type === "passive_upgrade") {
        const def = this.scene.runState.passiveDefs[card.key];
        label = def.name;
        desc = `Lv.${this.scene.runState.passives[card.key] + 1}`;
        color = "#66ff66";
      } else if (card.type === "gold") {
        label = "Gold";
        desc = `+${card.amount}`;
        color = "#ffd700";
      }

      const nameText = this.scene.add.text(cx, cy - 30, label, {
        fontSize: "11px", color: color, fontStyle: "bold", wordWrap: { width: cardW - 10 }
      }).setOrigin(0.5);
      this.container.add(nameText);

      const descText = this.scene.add.text(cx, cy + 10, desc, {
        fontSize: "10px", color: "#aaaaaa"
      }).setOrigin(0.5);
      this.container.add(descText);

      panel.on("pointerover", () => {
        panel.setFillStyle(0x2a2a3e);
        panel.setScale(1.05);
      });
      panel.on("pointerout", () => {
        panel.setFillStyle(0x1a1a2e);
        panel.setScale(1);
      });
      panel.on("pointerdown", () => {
        this.scene.audio.playSfx("ui_click");
        onSelect(card);
        this.hide();
      });

      this.cards.push({ panel, nameText, descText });
    });

    // Skip button
    const skip = this.scene.add.text(w / 2, h - 30, "Skip (+Gold)", {
      fontSize: "12px", color: "#888888"
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    skip.on("pointerover", () => skip.setColor("#ffffff"));
    skip.on("pointerout", () => skip.setColor("#888888"));
    skip.on("pointerdown", () => {
      this.scene.runState.gold += 5;
      this.hide();
      onSelect(null);
    });
    this.container.add(skip);
  }

  hide() {
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
    this.cards = [];
  }
}
