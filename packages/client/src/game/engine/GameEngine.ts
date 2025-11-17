import { gameSettings } from 'game/config/gameSettings';
import { checkHit } from 'game/logic/circle/hitLogic';
import { SpawnLogic } from 'game/logic/circle/spownLogic';
import Circle from 'game/objects/circle';

const missSound = new Audio('/assets/sounds/miss.wav'); // путь от public

type ButtonRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private circles: Circle[] = [];
    private spawnLogic: SpawnLogic;
    private lastTime = 0;
    private startTime = 0;
    private isRunning = false;
    private score = 0;
    private restartButton: ButtonRect | null = null;
    private rect: DOMRect;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.spawnLogic = new SpawnLogic(canvas.width, canvas.height);
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.rect = this.canvas.getBoundingClientRect();
    }

    private handleClick(event: MouseEvent) {
        if (!this.isRunning) {
            if (this.restartButton) {
                const scaleX = this.canvas.width / this.rect.width;
                const scaleY = this.canvas.height / this.rect.height;
                const x = (event.clientX - this.rect.left) * scaleX;
                const y = (event.clientY - this.rect.top) * scaleY;

                if (
                    x >= this.restartButton.x &&
                    x <= this.restartButton.x + this.restartButton.width &&
                    y >= this.restartButton.y &&
                    y <= this.restartButton.y + this.restartButton.height
                ) {
                    this.start();
                }
            }
            return;
        }

        const scaleX = this.canvas.width / this.rect.width;
        const scaleY = this.canvas.height / this.rect.height;
        const x = (event.clientX - this.rect.left) * scaleX;
        const y = (event.clientY - this.rect.top) * scaleY;

        const result = checkHit(this.circles, x, y);
        if (!result.hit) {
            if (this.score > 0) this.score -= 1;
            missSound.currentTime = 0;
            missSound.play();
        } else {
            this.score += 1;

            const { maxCircles } = gameSettings.spawn;
            const activeCircles = this.circles.filter((c) =>
                c.isActive()
            ).length;
            if (activeCircles < maxCircles) {
                this.circles.push(this.spawnLogic.spawnCircle());
            }
        }
    }

    start() {
        this.clear();
        this.startTime = performance.now();
        this.lastTime = this.startTime;
        this.isRunning = true;
        requestAnimationFrame((time) => this.loop(time));
    }

    private loop(currentTime: number) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        const elapsedTime = currentTime - this.startTime;

        this.lastTime = currentTime;

        if (elapsedTime >= gameSettings.game.gameDuration) {
            this.endGame();

            return;
        }

        this.update(deltaTime, currentTime);
        this.draw(currentTime);

        requestAnimationFrame((time) => this.loop(time));
    }

    private update(deltaTime: number, currentTime: number) {
        this.spawnLogic.update(currentTime, this.circles);

        this.circles.forEach((circle) => circle.update(deltaTime));

        this.circles = this.circles.filter((circle) => circle.isActive());
    }

    private clear() {
        this.ctx.fillStyle = gameSettings.game.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private draw(currentTime: number) {
        this.clear();
        this.circles.forEach((circle) => circle.draw(this.ctx));
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(`Score: ${this.score}`, 20, 20);

        const elapsed = (currentTime - this.startTime) / 1000;
        const remaining =
            gameSettings.game.gameDuration / 1000 - Math.round(elapsed);
        const text = `Time: ${remaining}s`;
        this.ctx.fillText(
            text,
            this.canvas.width - 20 - this.ctx.measureText(text).width,
            20
        );

        this.ctx.restore();
    }

    private endGame() {
        this.clear();
        this.isRunning = false;
        this.score = 0;
        this.circles = [];
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.fillText('Игра окончена', centerX, centerY);

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY + 50;

        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Начать заново', centerX, buttonY + buttonHeight / 2);

        this.restartButton = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
        };
    }
}
