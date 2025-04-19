import { DataSentryShot, getPalette } from "@spaceshipper/common";
import { ClientEntity } from "./client-entity";

export class ClientSentryShot implements ClientEntity {
  public data: DataSentryShot;

  constructor(data: DataSentryShot) {
    this.data = data;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const palette = getPalette(this.data.paletteId);

    const angle = Math.atan2(this.data.dy, this.data.dx);

    ctx.rotate(angle);

    ctx.save();
    ctx.translate((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.lineTo(1, 2);
    ctx.lineTo(-16 + Math.random() * 2, 0);
    ctx.lineTo(1, -2);
    ctx.closePath();
    ctx.globalAlpha = 0.1 + Math.random() * 0.2;
    
    ctx.lineWidth = 5;
    ctx.strokeStyle = palette.secondary;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.lineTo(0, 2);
    ctx.lineTo(-16 + Math.random() * 2, 0);
    ctx.lineTo(0, -2);
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = palette.primary;
    ctx.stroke();
    ctx.restore();

    ctx.lineWidth = 3;
    ctx.strokeStyle = palette.tint;
    ctx.globalAlpha = 0.06 + Math.random() * 0.05;

    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}