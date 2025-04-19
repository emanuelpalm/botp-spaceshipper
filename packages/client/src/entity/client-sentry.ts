import { DataSentry, getPalette } from "@spaceshipper/common";
import { ClientEntity } from "./client-entity";

export class ClientSentry implements ClientEntity {
  public data: DataSentry;

  private static readonly OUTER_RADIUS = 20;
  private static readonly OUTER_DASH_LENGTH = (Math.PI * this.OUTER_RADIUS * 2) / 50;

  private static readonly INNER_RADIUS = 14;

  private time: number = 0;

  constructor(data: DataSentry) {
    this.data = data;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const palette = getPalette(this.data.paletteId);

    // Draw outer dashed circle
    ctx.save();
    ctx.rotate(this.time / 2 + Math.random() * 0.01);
    ctx.fillStyle = `${palette.tint}${Math.floor(18 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.strokeStyle = `${palette.primary}${Math.floor(90 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 2;
    ctx.setLineDash([ClientSentry.OUTER_DASH_LENGTH, ClientSentry.OUTER_DASH_LENGTH]); // Create dashed line pattern

    ctx.beginPath();
    ctx.arc(0, 0, ClientSentry.OUTER_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Draw inner solid circle
    ctx.fillStyle = `${palette.tint}${Math.floor(24 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.strokeStyle = `${palette.secondary}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, ClientSentry.INNER_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw canon
    ctx.rotate(this.data.angle);
    ctx.beginPath();
    ctx.moveTo(ClientSentry.INNER_RADIUS + 10, 0);
    ctx.lineTo(ClientSentry.INNER_RADIUS + 26, 0);
    ctx.stroke();
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
    this.time += dt;
  }
}