export function intersects(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const sr = r1 + r0;
  return (dx * dx + dy * dy) <= (sr * sr);
}
