"use client";
import Phaser, { Game as GameType } from "phaser";
import { useEffect, useState } from "react";
import { Ball } from "./objects/ball";
import { Player } from "./objects/player";
import { Brick } from "./objects/brick";

const BRICK_COLORS: number[] = [0xf2e49b, 0xbed996, 0xf2937e, 0xffffff];

const LEVELS = [
  {
    BRICKS: [],
    HEIGHT: 8,
    WIDTH: 14,
  },
];

let settings = {
  BRICK: { HEIGHT: 10, MARGIN_TOP: 50, SPACING: 10, WIDTH: 25 },
  LEVELS,
  currentLevel: 0,
  highScore: 0,
  lives: 3,
  score: 0,
};

const BreakOutGameComponent = () => {
  const [game, setGame] = useState<GameType>();
  useEffect(() => {
    if (!game) {
      const initPhaser = async () => {
        const Phaser = await import("phaser");
        const PhaserGame = new Phaser.Game({
          type: Phaser.AUTO,
          parent: "gameContainer",
          width: 480,
          height: 640,
          scene: [],
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0, x: 0 },
              debug: true,
            },
          },
          backgroundColor: "#98d687",
          render: { pixelArt: true, antialias: true },
        });
        setGame(PhaserGame);
      };
      initPhaser();
    }
  }, [game]);
  return <div id="gameContainer" key={"gameContainer"}></div>;
};

class BootScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload(): void {
    this.createLoadingBar();
    this.load.on(
      "progress",
      (value: number) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xfff6d3);
        this.progressBar.fillRect(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );
    this.load.on(
      "complete",
      () => {
        this.progressBar.destroy();
        this.loadingBar.destroy();
      },
      this
    );
    this.load.pack("preload", "./breakout/pack.json", "preload");
  }
  update(): void {
    this.scene.start("GameScene");
  }

  createLoadingBar(): void {
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x5dae47, 1);
    this.loadingBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}

class GameScene extends Phaser.Scene {
  private ball!: Ball;
  private bricks!: Phaser.GameObjects.Group;
  private player!: Player;
  private scoreText!: Phaser.GameObjects.BitmapText;
  private highScoreText!: Phaser.GameObjects.BitmapText;
  private livesText!: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {
    settings.highScore = settings.score;
    settings.score = 0;
    settings.lives = 3;
  }

  create(): void {
    this.bricks = this.add.group();

    const BRICKS = settings.LEVELS[settings.currentLevel].BRICKS;
    const WIDTH = settings.LEVELS[settings.currentLevel].WIDTH;
    const HEIGHT = settings.LEVELS[settings.currentLevel].HEIGHT;

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        this.bricks.add(
          new Brick({
            scene: this,
            x: (settings.BRICK.WIDTH + settings.BRICK.SPACING) * x,
            y:
              settings.BRICK.MARGIN_TOP +
              y * (settings.BRICK.HEIGHT + settings.BRICK.SPACING),
            width: settings.BRICK.WIDTH,
            height: settings.BRICK.HEIGHT,
            fillColor: BRICK_COLORS[BRICKS[y * 14 + x]],
          })
        );
      }
    }
    this.player = new Player({
      scene: this,
      x: +this.game.config.width / 2 - 20,
      y: +this.game.config.height - 50,
      width: 50,
      height: 10,
    });
    this.ball = new Ball({ scene: this, x: 0, y: 0 }).setVisible(false);

    this.scoreText = this.add.bitmapText(
      10,
      10,
      "font",
      `Score: ${settings.score}`
    );
    this.livesText = this.add.bitmapText(
      10,
      30,
      'font',
      `Lives: ${settings.lives}`,
      8
    );
  }
}

export default BreakOutGameComponent;
