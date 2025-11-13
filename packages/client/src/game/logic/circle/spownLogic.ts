import { gameSettings } from "game/config/gameSettings";
import Circle from "game/objects/сircle";

export class SpawnLogic {
  private lastSpawnTime = 0;

  constructor(private canvasWidth: number, private canvasHeight: number) {}

  // 🔹 Проверяем, пора ли спавнить новый круг
  update(currentTime: number, circles: Circle[]) {
    const { interval } = gameSettings.spawn;

    if (currentTime - this.lastSpawnTime > interval) {
      this.lastSpawnTime = currentTime;

      // создаём новый круг
      const circle = this.spawnCircle();
      circles.push(circle);
    }
  }

  // 🔹 Метод для создания нового круга
  public spawnCircle(): Circle {
    const { minRadius, maxRadius, color } = gameSettings.circle;

    const x = Math.random() * (this.canvasWidth - maxRadius * 2) + maxRadius;
    const y = Math.random() * (this.canvasHeight - maxRadius * 2) + maxRadius;

    return new Circle(x, y, minRadius, color);
  }
}
