import { GameModel } from 'game/model/gameModel';
import { GameRenderer } from 'game/view/gameRenderer';

export class GameEngine {
    private model: GameModel;
    private renderer: GameRenderer;

    private isRunning = false;
    private rect: DOMRect;

    constructor(private canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('2D context not supported');
        }
        this.model = new GameModel(canvas.width, canvas.height);
        this.renderer = new GameRenderer(canvas, ctx);

        this.rect = canvas.getBoundingClientRect();

        canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    start() {
        this.model.start();
        this.isRunning = true;
        requestAnimationFrame((t) => this.loop(t));
    }

    private loop(time: number) {
        if (!this.isRunning) return;

        this.model.update(time);

        const state = this.model.getState(time);

        if (state.isGameOver) {
            this.renderer.renderGameOver();
            this.isRunning = false;
            return;
        }

        this.renderer.renderGame(state);

        requestAnimationFrame((t) => this.loop(t));
    }

    private handleClick(event: MouseEvent) {
        if (!this.isRunning) {
            // обработка кнопки рестарта
            const btn = this.renderer.getRestartButton();
            if (btn) {
                const { x, y } = this.getScaledPos(event);

                if (
                    x >= btn.x &&
                    x <= btn.x + btn.width &&
                    y >= btn.y &&
                    y <= btn.y + btn.height
                ) {
                    this.start();
                }
            }
            return;
        }

        // обычный клик — передать модели
        const { x, y } = this.getScaledPos(event);
        this.model.processClick(x, y);
    }

    private getScaledPos(event: MouseEvent) {
        const scaleX = this.canvas.width / this.rect.width;
        const scaleY = this.canvas.height / this.rect.height;

        return {
            x: (event.clientX - this.rect.left) * scaleX,
            y: (event.clientY - this.rect.top) * scaleY,
        };
    }
}
