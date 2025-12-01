import { defaultGameSettings } from '@store/slices/gameSlice';

import { GameState } from '../model/gameModel';

export class GameRenderer {
    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D
    ) {}

    clear() {
        this.ctx.fillStyle = defaultGameSettings.game.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderGame(state: GameState) {
        this.clear();

        // круги
        state.circles.forEach((c) => c.draw(this.ctx));
        // очки за шарик
        state.floatingTexts.forEach((t) => t.draw(this.ctx));

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
}
