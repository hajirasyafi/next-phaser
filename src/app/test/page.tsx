"use client";
import { NextPage } from "next";
import { useEffect, useCallback, useState, useRef } from "react";
import Phaser, { Game as GameType } from "phaser";
import Bird from "@/components/objects/bird";
import { Pipe } from "@/components/objects/pipe";
// import GameScenes from "@/components/scenes/flappy-bird/gamescene";
// import BootScene from "@/components/scenes/flappy-bird/bootscene";
// import MainMenuScene from "@/components/scenes/flappy-bird/mainmenuscene";

class BootScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super({
      key: "BootScene",
    });
  }

  preload(): void {
    this.cameras.main.setBackgroundColor(0x98d687);
    this.createLoadingBar();

    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xfff6d3, 1);
      this.progressBar.fillRect(
        this.cameras.main.width / 4,
        this.cameras.main.height / 2 - 16,
        (this.cameras.main.width / 2) * value,
        16
      );
    });

    this.load.on("complete", () => {
      this.progressBar.destroy();
      this.loadingBar.destroy();
    });

    this.load.pack("prelaod", "flappy-bird/pack.json", "preload");
  }

  update(): void {
    this.scene.start("MainMenuScene");
  }

  private createLoadingBar(): void {
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

class MainMenuScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  public titleBitmapText!: Phaser.GameObjects.BitmapText;
  public playBitmapText!: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: "MainMenuScene",
    });
  }

  init(): void {
    this.startKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    ) as Phaser.Input.Keyboard.Key;
    this.startKey.isDown = false;
    this.titleBitmapText = this.add.bitmapText(
      0,
      200,
      "font",
      "QYUBIT GAMES",
      30
    );
    this.titleBitmapText = this.add.bitmapText(
      0,
      300,
      "font",
      "PRESS S TO PLAY",
      20
    );
  }
  preload(): void {}
  create(): void {
    // console.log(this.sys.canvas.width / 2 - 200 / 2);
    // this.playBitmapText.x = 95;
    // this.titleBitmapText.x = this.getCenterXPositionOfBitmapText(
    //   this.titleBitmapText.width
    // );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start("GameScene");
    }
  }

  getCenterXPositionOfBitmapText(width: number): number {
    return this.sys.canvas.width / 2 - width / 2;
  }
}

class GameScenes extends Phaser.Scene {
  private bird!: Bird;
  private pipes!: Phaser.GameObjects.Group;
  private background!: Phaser.GameObjects.TileSprite;
  private textScore!: Phaser.GameObjects.BitmapText;
  private timer!: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {
    this.registry.set("score", -1);
  }

  create(): void {
    this.background = this.add
      .tileSprite(0, 0, 390, 600, "background")
      .setOrigin(0, 0);

    this.textScore = this.add
      .bitmapText(
        this.sys.canvas.width / 2 - 14,
        30,
        "font",
        this.registry.values.score
      )
      .setDepth(2);

    this.pipes = this.add.group({});

    this.bird = new Bird({
      scene: this,
      x: 50,
      y: 100,
      texture: "bird",
    });

    this.addNewRowOfPipes();

    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addNewRowOfPipes,
      callbackScope: this,
      loop: true,
    });
  }

  update(): void {
    if (!this.bird.getDead()) {
      this.background.tilePositionX += 4;
      this.bird.update();
      this.physics.overlap(
        this.bird,
        this.pipes,
        () => {
          this.bird.setDead(true);
        },
        undefined,
        this
      );
    } else {
      Phaser.Actions.Call(
        this.pipes.getChildren(),
        (pipe: Pipe) => {
          pipe.body.setVelocityX(0);
          console.log(pipe.body.velocity);
        },
        this
      );

      if (this.bird.y > this.sys.canvas.height) {
        this.scene.start("MainMenuScene");
      }
    }
  }

  setVeloPipes(pipe: Pipe) {
    pipe.body.setVelocityX(-200);
  }

  private addNewRowOfPipes(): void {
    // update the score
    this.registry.values.score += 1;
    this.textScore.setText(this.registry.values.score);

    // randomly pick a number between 1 and 5
    let hole = Math.floor(Math.random() * 6) + 1;

    // add 6 pipes with one big hole at position hole and hole + 1
    for (let i = 0; i < 10; i++) {
      if (i !== hole && i !== hole + 1 && i !== hole + 2) {
        if (i === hole - 1) {
          this.addPipe(400, i * 60, 0);
        } else if (i === hole + 3) {
          this.addPipe(400, i * 60, 1);
        } else {
          this.addPipe(400, i * 60, 2);
        }
      }
    }
  }

  private addPipe(x: number, y: number, frame: number): void {
    // create a new pipe at the position x and y and add it to group
    this.pipes.add(
      new Pipe({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        texture: "pipe",
      })
    );
  }
}

const TestPage: NextPage = () => {
  const [game, setGame] = useState<GameType>();
  useEffect(() => {
    if (!game) {
      const initPhaser = async () => {
        const Phaser = await import("phaser");
        const boot = await new BootScene();
        const mainmenu = await new MainMenuScene();
        const PhaserGame = new Phaser.Game({
          type: Phaser.AUTO,
          parent: "gameContainer",
          width: 390,
          height: 600,
          scene: [boot, mainmenu, GameScenes],
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

export default TestPage;
