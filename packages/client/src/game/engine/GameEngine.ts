import { gameSettings } from 'game/config/gameSettings';
import { checkHit } from 'game/logic/circle/hitLogic';
import { SpawnLogic } from 'game/logic/circle/spownLogic';
import Circle from 'game/objects/сircle';

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

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.spawnLogic = new SpawnLogic(canvas.width, canvas.height);
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    // 🔹 обработка клика мышью
    private handleClick(event: MouseEvent) {
        // если игра не запущена — обрабатываем только кнопку
        if (!this.isRunning) {
            if (this.restartButton) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                const x = (event.clientX - rect.left) * scaleX;
                const y = (event.clientY - rect.top) * scaleY;

                if (
                    x >= this.restartButton.x &&
                    x <= this.restartButton.x + this.restartButton.width &&
                    y >= this.restartButton.y &&
                    y <= this.restartButton.y + this.restartButton.height
                ) {
                    this.start(); // перезапуск игры
                }
            }
            return; // клики вне кнопки не обрабатываем
        }

        // -----------------------------
        // Далее обработка кликов по кругам только если игра запущена
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

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

    // 🔹 старт игры
    start() {
        this.clear();
        this.startTime = performance.now();
        this.lastTime = this.startTime;
        this.isRunning = true;
        requestAnimationFrame((time) => this.loop(time));
    }

    // 🔹 основной цикл игры
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
        // Используем реальные размеры canvas
        this.ctx.fillStyle = gameSettings.game.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 🔹 отрисовка всех кругов
    private draw(currentTime: number) {
        this.clear();
        this.circles.forEach((circle) => circle.draw(this.ctx));

        this.ctx.save(); // сохраняем состояние
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // Score
        this.ctx.fillText(`Score: ${this.score}`, 20, 20);

        // Таймер
        const elapsed = (currentTime - this.startTime) / 1000;
        const remaining =
            gameSettings.game.gameDuration / 1000 - Math.round(elapsed);
        const text = `Time: ${remaining}s`;
        this.ctx.fillText(
            text,
            this.canvas.width - 20 - this.ctx.measureText(text).width,
            20
        );

        this.ctx.restore(); // восстанавливаем состояние
    }

    private endGame() {
        this.clear();
        this.isRunning = false;
        this.score = 0;
        this.circles = [];

        // Настройки текста
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center'; // горизонтальное выравнивание по центру
        this.ctx.textBaseline = 'middle'; // вертикальное выравнивание по центру

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Рисуем основной текст
        this.ctx.fillText('Игра окончена', centerX, centerY);

        // Параметры кнопки
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = centerX - buttonWidth / 2;
        const buttonY = centerY + 50; // смещаем чуть ниже текста

        // Рисуем кнопку
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Текст на кнопке
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Начать заново', centerX, buttonY + buttonHeight / 2);

        // Сохраняем область кнопки для клика
        this.restartButton = {
            x: buttonX,
            y: buttonY,
            width: buttonWidth,
            height: buttonHeight,
        };
    }
}
