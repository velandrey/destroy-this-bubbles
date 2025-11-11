import Circle from './Circle';
export default class GameEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private animationId: number | null = null;
    private lastTime = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }
    //старн игры
    start() {
        this.lastTime = performance.now();
        const loop = (time: number) => {
            const deltaTime = (time - this.lastTime) / 1000; // секунды
            this.lastTime = time;
            this.update(deltaTime);
            this.draw();
            this.animationId = requestAnimationFrame(loop);
        };
        this.animationId = requestAnimationFrame(loop);
    }
    //стоп игры
    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }

    private update(deltaTime: number) {
        // Обновление состояния игры с учётом deltaTime
    }

    private draw() {
        //очистка канваса
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const circle = new Circle(100, 100, 50, 'red');
        circle.draw(this.ctx);
    }
}
