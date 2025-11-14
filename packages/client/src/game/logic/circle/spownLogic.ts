import { gameSettings } from "game/config/gameSettings";
import Circle from "game/objects/сircle";

export class SpawnLogic {
  private lastSpawnTime = 0;

  constructor(private canvasWidth: number, private canvasHeight: number) {}

  update(currentTime: number, circles: Circle[]) {
    const { interval } = gameSettings.spawn;

    if (currentTime - this.lastSpawnTime > interval) {
      this.lastSpawnTime = currentTime;

      const circle = this.spawnCircle();
      circles.push(circle);
    }
  }

  public spawnCircle(): Circle {
    const { minRadius, maxRadius, color } = gameSettings.circle;

    const x = Math.random() * (this.canvasWidth - maxRadius * 2) + maxRadius;
    const y = Math.random() * (this.canvasHeight - maxRadius * 2) + maxRadius;

    return new Circle(x, y, minRadius, color);
  }
}
