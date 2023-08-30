"use client";

import { FC, useEffect, useState } from "react";
import Phaser, { Game as GameType, Types } from "phaser";
import { Knight } from "../objects/knight";

const KnightGameComponent: FC = () => {
  const [game, setGame] = useState<GameType>();
  useEffect(() => {
    console.log(game);
  }, [game]);
  useEffect(() => {
    if (!game) {
      const initPhaser = async () => {
        const Phaser = await import("phaser");
        const gamescene = new GameScene();
        const PhaserGame = new Phaser.Game({
          type: Phaser.AUTO,
          parent: "gameContainer",
          width: 1920,
          height: 1080,
          scene: [gamescene],
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 300 },
              debug: true,
            },
          },
          render: { antialias: true, pixelArt: true },
        });
        setGame(PhaserGame);
      };
      initPhaser();
    }
  }, [game]);

  return <div id="gameContainer" key={"gameContainer"}></div>;
};
class GameScene extends Phaser.Scene {
  public platforms!: Phaser.GameObjects.Group;
  public player!: Knight;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  preload(): void {
    this.load.image("background", "./room_no_stand.webp");
    this.load.image("ground", "./assets/platform.png");
    this.load.spritesheet(
      "knight",
      "./knight/Colour2/NoOutline/120x80_PNGSheets/_Run2.png",
      {
        frameHeight: 37,
        frameWidth: 30,
      }
    );
  }

  create(): void {
    this.add.image(960, 540, "background").setOrigin(0.5, 0.5);
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(960, 1000, "ground").setScale(5).refreshBody();
    this.cursors =
      this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    this.player = new Knight({
      scene: this,
      x: 980,
      y: 100,
      texture: "knight",
      frame: 1,
    });
    const leftAnim: Types.Animations.Animation = {
      key: "right",
      frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 9 }),
      frameRate: 20,
      repeat: -1,
    };
    this.anims.create(leftAnim);
    this.physics.add.collider(this.player, this.platforms);
  }

  update(time: number, delta: number): void {
    if (this.cursors.right.isDown) {
      this.player.anims.play("right");
      this.player.body.setVelocityX(160);
    }
  }
}
export default KnightGameComponent;
