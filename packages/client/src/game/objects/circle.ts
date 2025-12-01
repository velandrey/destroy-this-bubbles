import { TGameSettings } from '@store/slices/gameSlice';

const popSound = new Audio('/assets/sounds/pop.mp3');
export default class Circle {
    public radius: number;
    private growing = true;
    private active = true;
    public createdAt: number;

    constructor(
        public x: number,
        public y: number,
        initialRadius: number,
        public color: string,
        private config: TGameSettings['circle']
    ) {
        this.radius = initialRadius;
        this.createdAt = performance.now();
    }

    update(deltaTime: number) {
        const { growthSpeed, maxRadius, minRadius } = this.config;
        if (!this.active) return;

        if (this.growing) {
            this.radius = this.radius + (growthSpeed * deltaTime) / 1000;
            if (this.radius >= maxRadius) {
                this.radius = maxRadius;
                this.growing = false;
            }
        } else {
            this.radius = this.radius - (growthSpeed * deltaTime) / 1000;
            if (this.radius <= minRadius) {
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

        if (distance > this.radius) {
            return false;
        }

        const { totalLevels } = this.config;
        const hitLevel = this.radius / totalLevels;

        let level = totalLevels - Math.floor(distance / hitLevel);
        level = Math.max(1, level);

        return true;
    }

    pop() {
        this.active = false;
        popSound.currentTime = 0;
        popSound.play();
    }
}
