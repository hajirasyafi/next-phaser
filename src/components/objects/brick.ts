import { IRectangleConstructor } from "@/interfaces/rectangel.interface";

export class Brick extends Phaser.GameObjects.Rectangle {
  public body!: Phaser.Physics.Arcade.Body;

  constructor(params: IRectangleConstructor) {
    super(
      params.scene,
      params.x,
      params.y,
      params.width,
      params.height,
      params.fillColor,
      params.fillAlpha
    );
    this.initPhysic();
    this.initRectangle();
  }
  private initRectangle(): void {
    this.setOrigin(0);
  }
  private initPhysic(): void {
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
  }
}
