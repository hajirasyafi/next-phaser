import Phaser from "phaser";
export class Knight extends Phaser.GameObjects.Sprite {
  public body!: Phaser.Physics.Arcade.Body;

  constructor(params: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame?: string | number;
  }) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.setScale(5);
    this.initPhysic();
    this.scene.add.existing(this);
  }

  create(): void {
    // this.scene.anims.create({
    //   key: "left",
    //   frames: this.scene.anims.generateFrameNumbers("knight", {
    //     start: 0,
    //     end: 9,
    //   }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
    // this.scene.anims.create({
    //   key: "right",
    //   frames: this.scene.anims.generateFrameNumbers("knight", {
    //     start: 0,
    //     end: 9,
    //   }),
    //   frameRate: 10,
    //   repeat: -1,
    // });
  }

  // update(): void {
  //   // if (this.cursors.left.isDown) {
  //   //   this.body.setVelocityX(-160);
  //   //   this.anims.play("left", true);
  //   // } else if (this.cursors.right.isDown) {
  //   //   this.body.setVelocityX(160);
  //   //   this.anims.play("right", true);
  //   // }
  // }

  private initPhysic(): void {
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds();
  }
}
