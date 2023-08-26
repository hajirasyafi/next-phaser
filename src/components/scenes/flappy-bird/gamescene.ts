import Bird from "@/components/objects/bird";
import { Scene, Types } from "phaser";
import { Pipe } from "@/components/objects/pipe";

export default class GameScenes extends Scene {
  private bird!: Bird;
  private pipes!: Phaser.GameObjects.Group;
  private background!: Phaser.GameObjects.TileSprite;
  private textScore!: Phaser.GameObjects.BitmapText;
  private timer!: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {
    this.registry.set("score", -1);
  }

  create(): void {
    this.background = this.add
      .tileSprite(0, 0, 390, 600, "background")
      .setOrigin(0, 0);

    this.textScore = this.add
      .bitmapText(
        this.sys.canvas.width / 2 - 14,
        30,
        "font",
        this.registry.values.score
      )
      .setDepth(2);

    this.pipes = this.add.group({});

    this.bird = new Bird({
      scene: this,
      x: 50,
      y: 100,
      texture: "bird",
    });

    this.addNewRowOfPipes();

    this.timer = this.time.addEvent({
      delay: 1500,
      callback: this.addNewRowOfPipes,
      callbackScope: this,
      loop: true,
    });
  }

  update(): void {
    console.log(this.pipes.getChildren());
    if (!this.bird.getDead()) {
      this.background.tilePositionX += 4;
      this.bird.update();
      this.physics.overlap(
        this.bird,
        this.pipes,
        () => {
          this.bird.setDead(true);
        },
        undefined,
        this
      );
    } else {
      Phaser.Actions.Call(
        this.pipes.getChildren(),
        (pipe: Pipe) => {
          pipe.body.setVelocityX(0);
        },
        this
      );

      if (this.bird.y > this.sys.canvas.height) {
        this.scene.start("MainMenuScene");
      }
    }
  }

  setVeloPipes(pipe: Pipe) {
    pipe.body.setVelocityX(-200);
  }

  private addNewRowOfPipes(): void {
    // update the score
    this.registry.values.score += 1;
    this.textScore.setText(this.registry.values.score);

    // randomly pick a number between 1 and 5
    let hole = Math.floor(Math.random() * 5) + 1;

    // add 6 pipes with one big hole at position hole and hole + 1
    for (let i = 0; i < 10; i++) {
      if (i !== hole && i !== hole + 1 && i !== hole + 2) {
        if (i === hole - 1) {
          this.addPipe(400, i * 60, 0);
        } else if (i === hole + 3) {
          this.addPipe(400, i * 60, 1);
        } else {
          this.addPipe(400, i * 60, 2);
        }
      }
    }
  }

  private addPipe(x: number, y: number, frame: number): void {
    // create a new pipe at the position x and y and add it to group
    this.pipes.add(
      new Pipe({
        scene: this,
        x: x,
        y: y,
        frame: frame,
        texture: "pipe",
      })
    );
  }
}
