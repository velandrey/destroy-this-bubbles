import { gameSettings } from "../config/gameSettings";

const popSound = new Audio("/assets/sounds/pop.mp3"); // путь от public
export default class Circle {
  public radius: number;
  private growing = true;
  private active = true;

  constructor(
    public x: number,
    public y: number,
    initialRadius: number,
    public color: string
  ) {
    this.radius = initialRadius;
  }

  update(deltaTime: number) {
    const { growthSpeed, maxRadius, minRadius } = gameSettings.circle;
    if (!this.active) return;

    if (this.growing) {
      this.radius += (growthSpeed * deltaTime) / 1000;
      if (this.radius >= maxRadius) {
        this.radius = maxRadius;
        this.growing = false;
      }
    } else {
      this.radius -= (growthSpeed * deltaTime) / 1000;
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
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }

  pop() {
    this.active = false;
    popSound.currentTime = 0;  // сброс проигрывания
    popSound.play();
  }
}
