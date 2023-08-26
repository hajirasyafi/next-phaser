import Phaser, { Scene } from "phaser";

export default class MainMenuScene extends Scene {
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
  }

  create(): void {
    this.titleBitmapText = this.add.bitmapText(
      0,
      200,
      "font",
      "Qyubit FLappy Bird",
      17
    );

    this.titleBitmapText = this.add.bitmapText(0, 300, "font", "S to play", 20);
    // this.playBitmapText.x = this.getCenterXPositionOfBitmapText(
    //   this.playBitmapText.width
    // );
    // this.titleBitmapText.x = this.getCenterXPositionOfBitmapText(
    //   this.titleBitmapText.width
    // );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start("GameScene");
    }
  }

  private getCenterXPositionOfBitmapText(width: number): number {
    return this.sys.canvas.width / 2 - width / 2;
  }
}
