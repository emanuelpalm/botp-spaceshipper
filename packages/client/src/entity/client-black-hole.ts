import { DataBlackHole, getPalette, Palette } from "@spaceshipper/common";
import { ClientEntity } from "./client-entity";

export class ClientBlackHole implements ClientEntity {
  public data: DataBlackHole;

  private ringDashLengths: number[];
  private time: number = 0;

  constructor(data: DataBlackHole) {
    this.data = data;

    const pr2 = Math.PI * this.data.radius * 2;
    this.ringDashLengths = [
      pr2 / 120,
      pr2 / 140,
      pr2 / 160,
      pr2 / 180,
    ];
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const palette = getPalette(this.data.paletteId);
    
    // Draw triangle in the middle
    ctx.strokeStyle = palette.secondary;
    ctx.lineWidth = 2;

    const triangleSize = Math.max(this.data.radius * 0.25, 10); // Triangle size is 25% of radius
    const triangleHalf = triangleSize / 2;

    ctx.beginPath();
    ctx.moveTo(triangleHalf, triangleHalf);
    ctx.lineTo(-triangleHalf, triangleHalf);
    ctx.lineTo(0, -triangleHalf);
    ctx.closePath();
    ctx.stroke();

    // Draw four concentric circles (rings)
    for (let i = 0; i < 4; i++) {
      ctx.save();

      ctx.rotate(this.time / (4 - i) + Math.random() * 0.01);
      ctx.fillStyle = `${palette.tint}${Math.floor(18 + 2 * Math.random()).toString(16).padStart(2, "0")}`;

      const color = (i & 1) === 1 ? palette.primary : palette.secondary;
      ctx.strokeStyle = `${color}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = i + 1;
      ctx.setLineDash([this.ringDashLengths[i], this.ringDashLengths[i]]); // Create dashed line pattern

      ctx.beginPath();
      ctx.arc(0, 0, this.data.radius * (1 - i * 0.18), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
    this.time += dt;
  }
}
