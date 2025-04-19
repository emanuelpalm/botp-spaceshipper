export function directionTo(x0: number, y0: number, x1: number, y1: number): [number, number] {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.sqrt(dx * dx + dy * dy);
  return [dx / length, dy / length];
}

export function intersects(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const sr = r1 + r0;
  return (dx * dx + dy * dy) <= (sr * sr);
}

export function resize(x: number, y: number, s: number): [number, number] {
  const length = Math.sqrt(x * x + y * y);
  return [x / length * s, y / length * s];
}
