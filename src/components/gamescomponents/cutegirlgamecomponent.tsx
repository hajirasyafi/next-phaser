"use client";

import { FC, useEffect, useState } from "react";
import Phaser, { Game as GameType, Types } from "phaser";
import CuteGirl from "@/components/objects/cutegirl";

const CuteGirlGameComponent: FC = () => {
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
            },
          },
          render: { antialias: true, pixelArt:false},
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
  public cuteGirl!: CuteGirl;
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  public isRuningRight!: boolean;
  public isRuningLeft!: boolean;
  public isIdleRight!:boolean;
  public isIdleLeft!:boolean;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init():void {
    this.isRuningRight = false;
    this.isRuningLeft = false;
    this.isIdleRight = true;
    this.isIdleLeft = false;
  }

  preload(): void {
    this.load.image("background", "./room_no_stand.webp");
    this.load.image("ground", "./assets/platform.png");
    this.load.atlas(
      "idleRight",
      "./cutegirl/idleRight.png",
      "./cutegirl/idleRight.json"
    );
    this.load.atlas(
      "idleLeft",
      "./cutegirl/idleLeft.png",
      "./cutegirl/idleLeft.json"
    );
    this.load.atlas(
      "runRight",
      "./cutegirl/runRight.png",
      "./cutegirl/runRight.json"
    );
    this.load.atlas(
      "runLeft",
      "./cutegirl/runLeft.png",
      "./cutegirl/runLeft.json"
    );
  }

  create(): void {
    this.add.image(960, 540, "background").setOrigin(0.5, 0.5);
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(960, 1000, "ground").setScale(5).refreshBody();
    this.cursors =
      this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    this.cuteGirl = new CuteGirl({
      scene: this,
      x: 980,
      y: 100,
      texture: "idleRight",
    });
    const idleRight: Types.Animations.Animation = {
      key: "idleRight",
      frames: this.anims.generateFrameNames("idleRight", {
        prefix: "idleRight",
        suffix: ".png",
        start: 0,
        end: 15,
        zeroPad: 3
      }),
      repeat: -1
    };
    const idleLeft: Types.Animations.Animation = {
      key: "idleLeft",
      frames: this.anims.generateFrameNames("idleLeft", {
        prefix: "idleLeft",
        suffix: ".png",
        start: 0,
        end: 15,
        zeroPad: 3,
      }),
      repeat: -1
    };
    const runRight: Types.Animations.Animation = {
      key: "runRight",
      frames: this.anims.generateFrameNames("runRight", {
        prefix: "runRight",
        suffix: ".png",
        start: 0,
        end: 19,
        zeroPad: 3
      }),
      repeat: -1,
      frameRate: 40
    };
    const runLeft: Types.Animations.Animation = {
      key: "runLeft",
      frames: this.anims.generateFrameNames("runLeft", {
        prefix: "runLeft",
        suffix: ".png",
        start: 0,
        end: 19,
        zeroPad: 3
      }),
      repeat: -1,
      frameRate: 40

    };
    this.anims.create(idleRight);
    this.anims.create(idleLeft);
    this.anims.create(runRight);
    this.anims.create(runLeft);
    this.physics.add.collider(this.cuteGirl, this.platforms);
  }

  update(time: number, delta: number): void {
    if(this.cursors.right.isDown) {
      this.isRuningRight = true;
      this.isIdleRight = true;
      this.isRuningLeft = false;
    } else if(this.cursors.left.isDown) {
      this.isRuningLeft = true;
      this.isRuningRight = false;
      this.isIdleRight = false;
    } else {
      this.isRuningRight = false;
      this.isRuningLeft = false;
    }
    
    if(this.isRuningRight) {
      this.cuteGirl.anims.play("runRight", true)
      this.cuteGirl.x +=10
    } else if(this.isRuningLeft) {
      this.cuteGirl.anims.play("runLeft", true)
      this.cuteGirl.x -=10
    } else {
      if(this.isIdleRight) {
        this.cuteGirl.anims.play("idleRight", true)
      } else {
        this.cuteGirl.anims.play("idleLeft", true)
      }
    }
  }
}
export default CuteGirlGameComponent;
