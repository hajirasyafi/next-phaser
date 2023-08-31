"use client";
import Phaser, { Game as GameType } from "phaser";
import { useEffect, useState } from "react";
import { Ball } from "@/components/objects/ball";
import { Player } from "@/components/objects/player";
import { Brick } from "@/components/objects/brick";

const BRICK_COLORS: number[] = [0xf2e49b, 0xbed996, 0xf2937e, 0xffffff];

const LEVELS = [
  {
    BRICKS: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
    ],
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
        const boot = new BootScene();
        const game = new GameScene();
        const PhaserGame = new Phaser.Game({
          type: Phaser.AUTO,
          parent: "gameContainer",
          width: 480,
          height: 640,
          scene: [boot, game],
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0, x: 0 },
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
      width: 480,
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
      "font",
      `Lives: ${settings.lives}`,
      8
    );
    this.physics.add.collider(this.player, this.ball);
    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.ballBrickCollision,
      undefined,
      this
    );
    this.events.on("scoreChanged", this.updateScore, this);
    this.events.on("livesChanged", this.updateLives, this);
    this.physics.world.checkCollision.down = false;
  }

  update(): void {
    this.player.update();

    if (this.player.body.velocity.x !== 0 && !this.ball.visible) {
      this.ball.setPosition(this.player.x, this.player.y - 200);
      this.ball.applyInitVelocity();
      this.ball.setVisible(true);
    }

    if (this.ball.y > (this.game.config.height as number)) {
      settings.lives -= 1;
      this.events.emit("livesChanged");
      if (settings.lives === 0) {
        // GameOver
        this.gameOver();
      } else {
        this.player.body.setVelocity(0);
        this.player.resetToStartPosition();
        this.ball.setPosition(0, 0);
        this.ball.body.setVelocity(0);
        this.ball.setVisible(false);
      }
    }
  }

  private ballBrickCollision(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    brick.destroy();
    settings.score += 10;
    this.events.emit("scoreChanged");
    if (this.bricks.countActive() === 0) {
      // all bricks are gone
    }
  }

  private gameOver(): void {
    this.scene.restart();
  }

  private updateScore(): void {
    this.scoreText.setText(`Score: ${settings.score}`);
  }

  private updateLives(): void {
    this.livesText.setText(`Lives: ${settings.lives}`);
  }
}

export default BreakOutGameComponent;
