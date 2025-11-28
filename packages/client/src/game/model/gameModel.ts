import { TOnGameOverHandler } from '@game/components/Game';
import { TGameSettings } from '@store/slices/gameSlice';
import { checkHit } from 'game/logic/circle/hitLogic';
import { SpawnLogic } from 'game/logic/circle/spownLogic';
import Circle from 'game/objects/circle';

const missSound = new Audio('/assets/sounds/miss.wav');

export type GameState = {
    circles: Circle[];
    score: number;
    timeRemaining: number;
    isRunning: boolean;
    isGameOver: boolean;
};

export class GameModel {
    private circles: Circle[] = [];
    private score = 0;
    private spawnLogic: SpawnLogic;
    private gameOverHandler: TOnGameOverHandler;

    private isRunning = false;
    private startTime = 0;
    private lastTime = 0;
    private isGameOver = false;

    constructor(
        width: number,
        height: number,
        onGameOver: TOnGameOverHandler,
        private gameSettings: TGameSettings
    ) {
        this.spawnLogic = new SpawnLogic(width, height, this.gameSettings);
        this.gameOverHandler = onGameOver;
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
        if (elapsed >= this.gameSettings.game.gameDuration) {
            this.endGame();
            return;
        }

        // обновление кругов
        this.spawnLogic.update(currentTime, this.circles);
        this.circles.forEach((c) => c.update(deltaTime));
        this.circles = this.circles.filter((c) => c.isActive());
    }

    processClick(x: number, y: number) {
        if (!this.isRunning) return;

        const hit = checkHit(this.circles, x, y);

        if (!hit.hit) {
            this.score = Math.max(0, this.score - 1);
            missSound.currentTime = 0;
            missSound.play();
        } else {
            this.score++;

            // может появиться новый круг
            const maxCircles = this.gameSettings.spawn.maxCircles;
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
        this.gameOverHandler({
            score: this.score,
        });
    }

    getState(currentTime: number): GameState {
        const elapsed = this.isRunning
            ? (currentTime - this.startTime) / 1000
            : 0;

        const timeRemaining = Math.max(
            0,
            this.gameSettings.game.gameDuration / 1000 - Math.round(elapsed)
        );

        return {
            circles: this.circles,
            score: this.score,
            timeRemaining,
            isRunning: this.isRunning,
            isGameOver: this.isGameOver,
        };
    }
}
