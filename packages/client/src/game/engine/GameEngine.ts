import { gameSettings } from 'game/config/gameSettings';
import { checkHit } from 'game/logic/circle/hitLogic';
import { SpawnLogic } from 'game/logic/circle/spownLogic';
import Circle from 'game/objects/сircle';

const missSound = new Audio('/assets/sounds/miss.wav'); // путь от public

export class GameEngine {
    private ctx: CanvasRenderingContext2D;
    private circles: Circle[] = [];
    private spawnLogic: SpawnLogic;
    private lastTime = 0;
    private score = 0;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.spawnLogic = new SpawnLogic(canvas.width, canvas.height);
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    // 🔹 обработка клика мышью
    private handleClick(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const result = checkHit(this.circles, x, y);
        if (!result.hit) {
            console.log('Промах!');
            missSound.currentTime = 0;
            missSound.play();
        }

        if (result.hit) {
            console.log('Попадание!');
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

    // 🔹 старт игры
    start() {
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    // 🔹 основной цикл игры
    private loop(currentTime: number) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime, currentTime); // обновляем состояние
        this.draw(); // отрисовываем

        requestAnimationFrame((time) => this.loop(time));
    }

    // 🔹 обновление состояния всех объектов
    private update(deltaTime: number, currentTime: number) {
        // спавн новых кругов
        this.spawnLogic.update(currentTime, this.circles);

        // обновляем все круги
        this.circles.forEach((circle) => circle.update(deltaTime));

        // удаляем неактивные круги
        this.circles = this.circles.filter((circle) => circle.isActive());
    }

    // 🔹 очистка холста
    private clear() {
        this.ctx.fillStyle = gameSettings.game.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 🔹 отрисовка всех кругов
    private draw() {
        this.clear();
        this.circles.forEach((circle) => circle.draw(this.ctx));
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 20, 30);
    }
}
