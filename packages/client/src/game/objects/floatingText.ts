export default class FloatingText {
    constructor(
        public x: number,
        public y: number,
        public text: string,
        public opacity = 1,
        public lifetime = 1000 // ms
    ) {}

    update(dt: number) {
        this.lifetime -= dt;
        this.opacity = Math.max(0, this.lifetime / 1000);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.opacity <= 0) return;

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }

    isAlive() {
        return this.lifetime > 0;
    }
}
