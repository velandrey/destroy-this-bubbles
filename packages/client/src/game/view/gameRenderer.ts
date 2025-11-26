import { gameSettings } from '../config/gameSettings';
import { GameState } from '../model/gameModel';

export class GameRenderer {
    private restartButton = null as null | {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D
    ) {}

    clear() {
        this.ctx.fillStyle = gameSettings.game.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderGame(state: GameState) {
        this.clear();

        // круги
        state.circles.forEach((c) => c.draw(this.ctx));

        // очки
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${state.score}`, 20, 20);

        // оставшееся время
        const text = `Time: ${state.timeRemaining}s`;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(text, this.canvas.width - 20, 20);
    }

    renderGameOver() {
        this.clear();

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('Игра окончена', w / 2, h / 2);

        // кнопка рестарта
        const width = 200;
        const height = 50;
        const x = w / 2 - width / 2;
        const y = h / 2 + 60;

        ctx.fillStyle = 'blue';
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Начать заново', w / 2, y + height / 2);

        this.restartButton = { x, y, width, height };
    }

    getRestartButton() {
        return this.restartButton;
    }
}
