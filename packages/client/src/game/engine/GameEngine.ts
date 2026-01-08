import { TOnGameOverHandler } from '@game/components/Game';
import { TGameSettings } from '@store/slices/gameSlice';

import { GameModel } from '../model/gameModel';
import { GameRenderer } from '../view/gameRenderer';

const CONTEXT_ERROR_MESSAGE = '2D context not supported';

export class GameEngine {
    private model: GameModel;
    private renderer: GameRenderer;
    private isRunning = false;
    private destroyed = false;
    // для отписки от слушателя при вызове destroy()
    private clickHandler: (e: MouseEvent) => void;

    constructor(
        private canvas: HTMLCanvasElement,
        onGameOver: TOnGameOverHandler,
        gameConfig: TGameSettings
    ) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error(CONTEXT_ERROR_MESSAGE);
        }
        this.model = new GameModel(
            canvas.width,
            canvas.height,
            onGameOver,
            gameConfig
        );
        this.renderer = new GameRenderer(canvas, ctx);

        this.clickHandler = (e) => this.handleClick(e);
        canvas.addEventListener('click', this.clickHandler);
    }

    start() {
        this.model.start();
        this.isRunning = true;
        requestAnimationFrame((t) => this.loop(t));
    }

    destroy() {
        this.destroyed = true;
        this.isRunning = false;
        this.canvas.removeEventListener('click', this.clickHandler);
    }

    private loop(time: number) {
        if (!this.isRunning || this.destroyed) return;

        this.model.update(time);

        const state = this.model.currentGameState;

        if (state.isGameOver) {
            if (!this.destroyed) {
                this.isRunning = false;
            }
            return;
        }

        this.renderer.renderGame(state);

        requestAnimationFrame((t) => this.loop(t));
    }

    private handleClick(event: MouseEvent) {
        const { x, y } = this.getScaledPos(event);
        this.model.processClick(x, y);
    }

    // converts viewport click coordinates into canvas space
    private getScaledPos(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY,
        };
    }
}
