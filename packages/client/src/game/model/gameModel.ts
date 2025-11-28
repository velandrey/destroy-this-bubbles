import { gameSettings } from 'game/config/gameSettings';
import { checkHit } from 'game/logic/circle/hitLogic';
import { SpawnLogic } from 'game/logic/circle/spownLogic';
import Circle from 'game/objects/circle';

import FloatingText from '../objects/floatingText';

const missSound = new Audio('/assets/sounds/miss.wav');

export type GameState = {
    circles: Circle[];
    score: number;
    timeRemaining: number;
    isRunning: boolean;
    isGameOver: boolean;
    floatingTexts: FloatingText[];
};

export class GameModel {
    private circles: Circle[] = [];
    private score = 0;
    private spawnLogic: SpawnLogic;
    private floatingTexts: FloatingText[] = [];
    private isRunning = false;
    private startTime = 0;
    private lastTime = 0;
    private isGameOver = false;
    private t_total: number;

    constructor(private width: number, private height: number) {
        this.spawnLogic = new SpawnLogic(width, height);
        this.t_total =
            (gameSettings.circle.maxRadius / gameSettings.circle.growthSpeed) *
            2 *
            1000;
    }

    start() {
        this.isRunning = true;
        this.isGameOver = false;
        this.circles = [];
        this.score = 0;

        this.startTime = performance.now();
        this.lastTime = this.startTime;
    }

    update(currentTime: number) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        const elapsed = currentTime - this.startTime;

        // проверка на конец игры
        if (elapsed >= gameSettings.game.gameDuration) {
            this.endGame();
            return;
        }

        // обновление кругов
        this.spawnLogic.update(currentTime, this.circles);
        this.circles.forEach((c) => c.update(deltaTime));
        this.circles = this.circles.filter((c) => c.isActive());

        // очки на канвасе
        this.floatingTexts.forEach((t) => t.update(deltaTime));
        this.floatingTexts = this.floatingTexts.filter((t) => t.isAlive());
    }
    processClick(x: number, y: number) {
        if (!this.isRunning) return;

        const hit = checkHit(this.circles, x, y);

        if (!hit.hit) {
            this.score = Math.max(0, this.score - 10);
            missSound.currentTime = 0;
            missSound.play();
        } else {
            const circle = hit.circle!;

            // Расстояние до центра круга
            const dx = x - circle.x;
            const dy = y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Множитель за точность
            const totalRadiusLevels = gameSettings.circle.totalLevels;
            const hitLevel = circle.radius / totalRadiusLevels;
            let radiusLevel =
                totalRadiusLevels - Math.floor(distance / hitLevel);
            radiusLevel = Math.max(1, radiusLevel);

            const totalTimeLevels = gameSettings.circle.totalTimeLevels;
            const elapsed = performance.now() - circle.createdAt;
            let speedLevel =
                totalTimeLevels -
                Math.floor((elapsed / this.t_total) * totalTimeLevels);
            speedLevel = Math.max(1, speedLevel);

            // Начисляем очки: базовые 10 + уровень по скорости + уровень по центру

            const gained = 10 + radiusLevel + speedLevel;

            this.score += gained;
            console.log(`
                Базовые очки - 10 
                Очки за радиус попадания - ${radiusLevel}
                Очки за время попадания - ${speedLevel}
                Суммарно за шарик - ${gained}
                Итоговый счет - ${this.score}
                
                `);
            // Всплывающий текст
            this.floatingTexts.push(
                new FloatingText(circle.x, circle.y, `+${gained}`)
            );

            circle.pop();

            // Спавн нового круга
            const maxCircles = gameSettings.spawn.maxCircles;
            const active = this.circles.filter((c) => c.isActive()).length;
            if (active < maxCircles) {
                this.circles.push(this.spawnLogic.spawnCircle());
            }
        }
    }

    private endGame() {
        this.isRunning = false;
        this.isGameOver = true;
        this.circles = [];
    }

    getState(currentTime: number): GameState {
        const elapsed = this.isRunning
            ? (currentTime - this.startTime) / 1000
            : 0;

        const timeRemaining = Math.max(
            0,
            gameSettings.game.gameDuration / 1000 - Math.round(elapsed)
        );

        return {
            circles: this.circles,
            score: this.score,
            timeRemaining,
            isRunning: this.isRunning,
            isGameOver: this.isGameOver,
            floatingTexts: this.floatingTexts, // ← добавили
        };
    }
}
