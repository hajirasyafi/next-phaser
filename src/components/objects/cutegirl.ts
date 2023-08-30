import Phaser from "phaser";

interface iCuteGirl {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: Phaser.Textures.Texture | string;
  frame?: string | number | undefined;
}

export default class CuteGirl extends Phaser.GameObjects.Sprite {
  public body!: Phaser.Physics.Arcade.Body;
  constructor(params: iCuteGirl) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.initPhysic();
    this.setScale(0.5);
    this.scene.add.existing(this);
  }
  private initPhysic(): void {
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds();
  }
}
