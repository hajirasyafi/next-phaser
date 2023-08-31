"use client";

import { FC, useEffect, useState } from "react";
import Phaser, { Game as GameType, Types } from "phaser";
import CuteGirl from "@/components/objects/cutegirl";

const CuteGirlGameComponent: FC = () => {
  const [game, setGame] = useState<GameType>();
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
              gravity: { y: 980 },
            },
          },
          render: { antialias: true, pixelArt: false },
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
  public facingRight!: boolean;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {
    this.isRuningRight = false;
    this.isRuningLeft = false;
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
    this.load.atlas(
      "jumpRight",
      "./cutegirl/jumpRight.png",
      "./cutegirl/jumpRight.json"
    );
    this.load.atlas(
      "jumpLeft",
      "./cutegirl/jumpLeft.png",
      "./cutegirl/jumpLeft.json"
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
        zeroPad: 3,
      }),
      repeat: -1,
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
      repeat: -1,
    };
    const runRight: Types.Animations.Animation = {
      key: "runRight",
      frames: this.anims.generateFrameNames("runRight", {
        prefix: "runRight",
        suffix: ".png",
        start: 0,
        end: 19,
        zeroPad: 3,
      }),
      repeat: -1,
      frameRate: 45,
    };
    const runLeft: Types.Animations.Animation = {
      key: "runLeft",
      frames: this.anims.generateFrameNames("runLeft", {
        prefix: "runLeft",
        suffix: ".png",
        start: 0,
        end: 19,
        zeroPad: 3,
      }),
      repeat: -1,
      frameRate: 45,
    };
    const jumpRight: Types.Animations.Animation = {
      key: "jumpRight",
      frames: this.anims.generateFrameNames("jumpRight", {
        prefix: "jumpRight",
        suffix: ".png",
        start: 0,
        end: 29,
        zeroPad: 3,
      }),
      repeat: -1,
      frameRate: 30,
    };
    const jumpLeft: Types.Animations.Animation = {
      key: "jumpLeft",
      frames: this.anims.generateFrameNames("jumpLeft", {
        prefix: "jumpLeft",
        suffix: ".png",
        start: 0,
        end: 29,
        zeroPad: 3,
      }),
      repeat: -1,
      frameRate: 30,
    };
    const jumpFallRight: Types.Animations.Animation = {
      key: "jumpFallRight",
      frames: this.anims.generateFrameNames("jumpRight", {
        prefix: "jumpRight",
        suffix: ".png",
        start: 0,
        end: 29,
        zeroPad: 3,
      }),
      repeat: -1,
      frameRate: 30,
    };
    const jumpFallLeft: Types.Animations.Animation = {
      key: "jumpFallLeft",
      frames: this.anims.generateFrameNames("jumpLeft", {
        prefix: "jumpLeft",
        suffix: ".png",
        start: 0,
        end: 29,
        zeroPad: 3,
      }),
      repeat: -1,
      frameRate: 30,
    };
    this.anims.create(idleRight);
    this.anims.create(idleLeft);
    this.anims.create(runRight);
    this.anims.create(runLeft);
    this.anims.create(jumpRight);
    this.anims.create(jumpLeft);
    this.anims.create(jumpFallRight);
    this.anims.create(jumpFallLeft);
    this.physics.add.collider(this.cuteGirl, this.platforms);
  }

  update(): void {
    console.log(this.cuteGirl.anims.currentAnim?.key);
    if (this.cursors.right.isDown) {
      this.isRuningRight = true;
      this.isRuningLeft = false;
      this.facingRight = true;
    } else if (this.cursors.left.isDown) {
      this.isRuningLeft = true;
      this.isRuningRight = false;
      this.facingRight = false;
    } else {
      this.isRuningRight = false;
      this.isRuningLeft = false;
    }

    if (this.cursors.up.isDown && this.cuteGirl.body.onFloor()) {
      this.cuteGirl.body.setVelocityY(-450);
    }

    if (this.isRuningRight && this.cuteGirl.body.onFloor()) {
      this.cuteGirl.anims.play("runRight", true);
      this.cuteGirl.x += 10;
    } else if (this.isRuningLeft && this.cuteGirl.body.onFloor()) {
      this.cuteGirl.anims.play("runLeft", true);
      this.cuteGirl.x -= 10;
    } else if (this.isRuningRight && !this.cuteGirl.body.onFloor()) {
      this.cuteGirl.anims.play("jumpFallRight", true);
      this.cuteGirl.x += 7;
    } else if (this.isRuningLeft && !this.cuteGirl.body.onFloor()) {
      this.cuteGirl.anims.play("jumpFallLeft", true);
      this.cuteGirl.x -= 7;
    } else {
      if (this.cuteGirl.body.onFloor() && this.facingRight) {
        this.cuteGirl.anims.play("idleRight", true);
      } else if (this.cuteGirl.body.onFloor() && !this.facingRight) {
        this.cuteGirl.anims.play("idleLeft", true);
      } else {
        if (this.facingRight) {
          this.cuteGirl.anims.play("jumpFallRight", true);
        } else {
          this.cuteGirl.anims.play("jumpFallLeft", true);
        }
      }
    }
  }
}
export default CuteGirlGameComponent;
