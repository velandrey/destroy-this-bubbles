export default class Circle {
    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public color: string
    ) {}

    // метод отрисовки круга
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath(); // начинаем новый путь
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // рисуем круг
        ctx.fillStyle = this.color; // задаём цвет
        ctx.fill(); // закрашиваем
    }
}
