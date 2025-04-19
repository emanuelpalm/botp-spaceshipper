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
    {
      ctx.strokeStyle = palette.secondary;
      ctx.lineWidth = Math.abs(Math.sin(this.time)) * 2 + 1;

      // Triangle size is 20% of radius
      const r = Math.max(this.data.radius * 0.2, 10);

      // Draw equilateral triangle inscribed in circle of radius r
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = -Math.PI / 2 + i * (2 * Math.PI / 3); // Start at top, 120° apart
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw four concentric circles (rings)
    for (let i = 0; i < 4; i++) {
      ctx.save();

      ctx.rotate((i & 1 ? -1 : 1) * this.time / (4 - i) + Math.random() * 0.01);
      ctx.fillStyle = `${palette.tint}${Math.floor(18 + 2 * Math.random()).toString(16).padStart(2, "0")}`;

      const color = (i & 1) === 1 ? palette.primary : palette.secondary;
      ctx.strokeStyle = `${color}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = Math.abs(i & 1 ? Math.sin(this.time) : Math.cos(this.time)) * (i + 1) + 1;
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
