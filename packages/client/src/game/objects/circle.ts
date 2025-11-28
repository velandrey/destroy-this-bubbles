import { gameSettings } from '../config/gameSettings';

const popSound = new Audio('/assets/sounds/pop.mp3'); // путь от public
export default class Circle {
    public radius: number;
    private growing = true;
    private active = true;
    public multiplierScore = 1;
    private growthSpeed = gameSettings.circle.growthSpeed;
    private maxRadius = gameSettings.circle.maxRadius;
    private minRadius = gameSettings.circle.minRadius;
    public createdAt: number;

    constructor(
        public x: number,
        public y: number,
        initialRadius: number,
        public color: string
    ) {
        this.radius = initialRadius;
        this.createdAt = performance.now();
    }

    update(deltaTime: number) {
        if (!this.active) return;

        if (this.growing) {
            this.radius = this.radius + (this.growthSpeed * deltaTime) / 1000;
            if (this.radius >= this.maxRadius) {
                this.radius = this.maxRadius;
                this.growing = false;
            }
        } else {
            this.radius = this.radius - (this.growthSpeed * deltaTime) / 1000;
            if (this.radius <= this.minRadius) {
                this.radius = 0;
                this.active = false;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    isActive() {
        return this.active;
    }

    containsPoint(px: number, py: number): boolean {
        const dx = px - this.x;
        const dy = py - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Промах
        if (distance > this.radius) {
            return false;
        }

        const totalLevels = gameSettings.circle.totalLevels;
        const hitLevel = this.radius / totalLevels;

        // ближе к центру → выше уровень
        let level = totalLevels - Math.floor(distance / hitLevel);
        level = Math.max(1, level);

        this.multiplierScore = level;

        return true;
    }

    pop() {
        this.active = false;
        popSound.currentTime = 0; // сброс проигрывания
        popSound.play();
    }
}
