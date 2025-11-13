import Circle from "game/objects/сircle";

export function checkHit(
  circles: Circle[],
  x: number,
  y: number
): { hit: boolean; circle?: Circle } {
  for (const circle of circles) {
    if (circle.containsPoint(x, y)) {
      circle.pop();
      return { hit: true, circle };
    }
  }
  return { hit: false };
}
