import { TGameSettings } from '@store/slices/gameSlice';
import Circle from 'game/objects/circle';

export class SpawnLogic {
    private lastSpawnTime = 0;
    private gameSettings: TGameSettings;

    constructor(
        private canvasWidth: number,
        private canvasHeight: number,
        gameSettings: TGameSettings
    ) {
        this.gameSettings = gameSettings;
    }

    update(currentTime: number, circles: Circle[]) {
        const { interval } = this.gameSettings.spawn;

        if (currentTime - this.lastSpawnTime > interval) {
            this.lastSpawnTime = currentTime;

            const circle = this.spawnCircle();
            circles.push(circle);
        }
    }

    public spawnCircle(): Circle {
        const { minRadius, maxRadius, color } = this.gameSettings.circle;

        const x =
            Math.random() * (this.canvasWidth - maxRadius * 2) + maxRadius;
        const y =
            Math.random() * (this.canvasHeight - maxRadius * 2) + maxRadius;

        return new Circle(x, y, minRadius, color, this.gameSettings.circle);
    }
}
