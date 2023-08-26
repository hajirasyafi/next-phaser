import { IImageConstructor } from "@/interfaces/image.interface";
import Phaser from "phaser";

export default class Bird extends Phaser.GameObjects.Image {
  public body!: Phaser.Physics.Arcade.Body;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private isDead!: boolean;
  private isFlapping!: boolean;

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead: boolean): void {
    this.isDead = dead;
  }

  constructor(params: IImageConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.setScale(3);
    this.setOrigin(0, 0);

    this.isDead = false;
    this.isFlapping = false;

    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(17, 12);

    this.jumpKey = this.scene.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ) as Phaser.Input.Keyboard.Key;
    this.scene.add.existing(this);
  }

  update(...args: any[]): void {
    if (this.angle < 30) {
      this.angle += 2;
    }

    if (this.jumpKey.isDown && !this.isFlapping) {
      this.isFlapping = true;
      this.body.setVelocityY(-350);
      this.scene.tweens.add({
        targets: this,
        props: { angle: -20 },
        duration: 150,
        ease: "Power0",
      });
    } else if (this.jumpKey.isUp && this.isFlapping) {
      this.isFlapping = false;
    }

    if (this.y + this.height > this.scene.sys.canvas.height) {
      this.isDead = true;
    }
  }
}
