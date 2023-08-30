import { IRectangleConstructor } from "@/interfaces/rectangel.interface";

export class Ball extends Phaser.GameObjects.Rectangle {
  public body!: Phaser.Physics.Arcade.Body;

  constructor(params: IRectangleConstructor) {
    super(
      params.scene,
      params.x,
      params.y,
      params.width,
      params.height,
      params.fillAlpha,
      params.fillColor
    );
    this.initReactangle();
    this.initPhysic();
    this.scene.add.existing(this);
  }

  private initReactangle(): void {
    this.setOrigin(0);
    this.width = 10;
    this.height = 10;
    this.setFillStyle(0xffffff);
  }

  private initPhysic(): void {
    this.scene.physics.world.enable(this);
    this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds();
  }

  public applyInitVelocity(): void {
    this.body.setVelocity(Phaser.Math.RND.between(-200, 200), 200);
    this.body.speed = 3000;
  }
}
