export function accelerate(dx: number, dy: number, ax: number, ay: number, maxVelocity: number, acceleration: number): [number, number] {
  // Find the direction to accelerate towards
  const mag = Math.sqrt(ax * ax + ay * ay);
  let targetDx = 0, targetDy = 0;
  if (mag > 1e-8) {
    targetDx = ax / mag * maxVelocity;
    targetDy = ay / mag * maxVelocity;
  }

  // Compute difference vector
  const diffDx = targetDx - dx;
  const diffDy = targetDy - dy;
  const diffMag = Math.sqrt(diffDx * diffDx + diffDy * diffDy);

  if (diffMag > acceleration) {
    // Move towards target by at most acceleration
    return [dx + (diffDx / diffMag) * acceleration, dy + (diffDy / diffMag) * acceleration];
  }

  // Snap to target if within acceleration distance
  return [targetDx, targetDy];
}

export function clamp(dx: number, dy: number, mMin: number, mMax: number): [number, number] {
  const m = Math.sqrt(dx * dx + dy * dy);
  const m0 = Math.max(mMin, Math.min(m, mMax));
  return [dx / m * m0, dy / m * m0];
}

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
