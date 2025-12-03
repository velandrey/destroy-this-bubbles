import { TOnGameOverHandler } from '@game/components/Game';
import { TGameSettings } from '@store/slices/gameSlice';
import { formatDate } from '@utils/formatDate';
import { checkHit } from 'game/logic/circle/hitLogic';
import { SpawnLogic } from 'game/logic/circle/spawnLogic';
import Circle from 'game/objects/circle';

import FloatingText from '../objects/floatingText';

const MILLISECONDS_IN_SECOND = 1000;
const missSound = new Audio('/assets/sounds/miss.wav');

export type GameState = {
    circles: Circle[];
    score: number;
    secondsRemaining: number;
    isRunning: boolean;
    isGameOver: boolean;
    floatingTexts: FloatingText[];
};

export class GameModel {
    private isRunning = false;
    private isGameOver = false;
    private circles: Circle[] = [];
    private score = 0;
    private spawnLogic: SpawnLogic;
    private gameOverHandler: TOnGameOverHandler;
    private floatingTexts: FloatingText[] = [];
    private startTime = 0;
    private lastUpdateTime = 0;
    private circleFullLifecycleMs: number;
    private currentTime = 0;
    private secondsRemaining = 0;

    constructor(
        width: number,
        height: number,
        onGameOver: TOnGameOverHandler,
        private gameSettings: TGameSettings
    ) {
        this.spawnLogic = new SpawnLogic(width, height, this.gameSettings);
        this.gameOverHandler = onGameOver;
        // полный цикл: рост до максимума и обратно до минимума - поэтому умножаем на 2
        this.circleFullLifecycleMs =
            (this.gameSettings.circle.maxRadius /
                this.gameSettings.circle.growthSpeed) *
            2 *
            MILLISECONDS_IN_SECOND;
    }

    start() {
        this.isRunning = true;
        this.isGameOver = false;
        this.circles = [];
        this.score = 0;
        this.floatingTexts = [];

        const now = performance.now();
        this.startTime = now;
        this.lastUpdateTime = now;
        this.secondsRemaining = Math.round(
            this.gameSettings.game.gameDuration / MILLISECONDS_IN_SECOND
        );
    }

    update(currentTime: number) {
        if (!this.isRunning) return;

        this.calculateRemainingTime(currentTime);
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        // проверка на конец игры
        if (this.secondsRemaining === 0) {
            this.endGame();
            return;
        }

        // обновление кругов и вспомогательных текстов
        this.spawnLogic.update(currentTime, this.circles);
        this.circles.forEach((c) => c.update(deltaTime));
        this.circles = this.circles.filter((c) => c.isActive());
        this.floatingTexts = updateFloatingTexts({
            texts: this.floatingTexts,
            deltaTime,
        });
    }

    calculateRemainingTime(currentTime: number) {
        const elapsedMs = currentTime - this.startTime;
        const remainingMs = Math.max(
            0,
            this.gameSettings.game.gameDuration - elapsedMs
        );
        this.secondsRemaining = Math.round(
            remainingMs / MILLISECONDS_IN_SECOND
        );
    }

    processClick(x: number, y: number) {
        if (!this.isRunning) return;

        const hit = checkHit(this.circles, x, y);

        if (!hit.hit) {
            this.registerMiss();
            return;
        }

        const circle = hit.circle!;
        this.registerHit(circle, x, y);
        circle.pop();
    }

    private endGame() {
        this.isRunning = false;
        this.isGameOver = true;
        this.circles = [];
        this.gameOverHandler({
            score: this.score,
            timestamp: formatDate(new Date()),
        });
    }

    get currentGameState(): GameState {
        return {
            circles: this.circles,
            score: this.score,
            secondsRemaining: this.secondsRemaining,
            isRunning: this.isRunning,
            isGameOver: this.isGameOver,
            floatingTexts: this.floatingTexts,
        };
    }

    private registerMiss() {
        const { scoreOnMiss } = this.gameSettings.game;
        this.score = Math.max(0, this.score - scoreOnMiss);
        missSound.currentTime = 0;
        void missSound.play();
    }

    private registerHit(circle: Circle, x: number, y: number) {
        const accuracyLevel = calculateAccuracyLevel({
            circleCenterX: circle.x,
            circleCenterY: circle.y,
            hitX: x,
            hitY: y,
            totalLevels: this.gameSettings.circle.totalLevels,
            circleMaxRadius: this.gameSettings.circle.maxRadius,
        });
        const speedLevel = calculateSpeedLevel({
            circleLifetime: circle.lifetime,
            totalTimeLevels: this.gameSettings.circle.totalTimeLevels,
            circleFullLifecycle: this.circleFullLifecycleMs,
        });
        const gained =
            this.gameSettings.game.scoreOnHit + accuracyLevel + speedLevel;

        this.score += gained;

        // всплывающий текст показывает сколько очков получено
        this.floatingTexts.push(
            new FloatingText(circle.x, circle.y, `+${gained}`)
        );
    }
}

export const updateFloatingTexts = ({
    texts,
    deltaTime,
}: {
    texts: FloatingText[];
    deltaTime: number;
}): FloatingText[] => {
    texts.forEach((t) => t.update(deltaTime));
    return texts.filter((t) => t.isAlive());
};

export const calculateAccuracyLevel = ({
    circleCenterX,
    circleCenterY,
    hitX,
    hitY,
    totalLevels,
    circleMaxRadius,
}: {
    circleCenterX: number;
    circleCenterY: number;
    hitX: number;
    hitY: number;
    totalLevels: number;
    circleMaxRadius: number;
}) => {
    // очки за близость к центру (ака точность) не учитывают размер круга в данный момент
    // попасть в край маленького круга так же ценно, как и попасть в большой круг на таком же расстоянии от центра
    const distanceFromCenter = calculateDistance({
        ax: circleCenterX,
        ay: circleCenterY,
        bx: hitX,
        by: hitY,
    });
    // это отношение - distanceFromCenter / circleMaxRadius = level / totalLevels
    const level =
        totalLevels -
        Math.floor((distanceFromCenter / circleMaxRadius) * totalLevels);
    return level;
};

export const calculateSpeedLevel = ({
    circleLifetime,
    totalTimeLevels,
    circleFullLifecycle,
}: {
    circleLifetime: number;
    totalTimeLevels: number;
    circleFullLifecycle: number;
}) => {
    // это отношение - circleLife / circleFullLifecycle = level / totalTimeLevels
    const level =
        totalTimeLevels -
        Math.floor((circleLifetime / circleFullLifecycle) * totalTimeLevels);
    return level;
};

export const calculateDistance = ({
    ax,
    ay,
    bx,
    by,
}: {
    ax: number;
    ay: number;
    bx: number;
    by: number;
}) => {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
};
