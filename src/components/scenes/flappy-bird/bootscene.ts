import Phaser, { Scene, Types } from "phaser";

export default class BootScene extends Scene {
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

  update(time: number, delta: number): void {
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
