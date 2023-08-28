import { IRectangleConstructor } from "@/interfaces/rectangel.interface";

export class Player extends Phaser.GameObjects.Rectangle {
  public body!: Phaser.Physics.Arcade.Body;
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
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
    this.initRectangle();
    this.initPhysic();
    this.initInput();
    this.scene.add.existing(this);
  }
  update(): void {
    this.handleInput();
  }

  private initRectangle(): void {
    this.setFillStyle(0x9696c6);
  }

  private initPhysic(): void {
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds();
    this.body.setDragX(300);
    this.body.setImmovable(true);
  }

  private initInput(): void {
    this.cursor =
      this.scene.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  private handleInput(): void {
    if (this.cursor.right.isDown) {
      this.body.setVelocityX(300);
    } else if (this.cursor.left.isDown) {
      this.body.setVelocityX(-300);
    }
  }

  public resetToStartPosition(): void {
    this.x = +this.scene.game.config.width / 2 - 20;
    this.y = +this.scene.game.config.height - 50;
  }
}
