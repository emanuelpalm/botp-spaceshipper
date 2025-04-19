import { DataPortal, getPalette } from "@spaceshipper/common";
import { ClientEntity } from "./client-entity";

export class ClientPortal implements ClientEntity {
  public data: DataPortal;

  private outerDashLength: number;
  private innerDashLength: number;
  private time: number = 0;

  constructor(data: DataPortal) {
    this.data = data;

    this.outerDashLength = (Math.PI * this.data.radius * 2) / 80;
    this.innerDashLength = (Math.PI * this.data.radius * 2) / 120;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const palette = getPalette(this.data.paletteId);

    // Draw name.
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `12px Oxanium`;
    ctx.fillStyle = palette.primary;
    ctx.fillText(this.data.name, 0, -26);

    // Draw cross in the middle
    ctx.strokeStyle = palette.secondary;
    ctx.lineWidth = 2;

    const crossSize = Math.max(this.data.radius * 0.15, 10); // Cross size is 15% of radius
    ctx.beginPath();
    // Horizontal line
    ctx.moveTo(-crossSize, 0);
    ctx.lineTo(crossSize, 0);
    // Vertical line
    ctx.moveTo(0, -crossSize);
    ctx.lineTo(0, crossSize);
    ctx.stroke();

    // Draw outer dashed circle
    ctx.rotate(this.time / 2 + Math.random() * 0.01);
    ctx.fillStyle = `${palette.tint}${Math.floor(18 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.strokeStyle = `${palette.primary}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 2;
    ctx.setLineDash([this.outerDashLength, this.outerDashLength]); // Create dashed line pattern

    ctx.beginPath();
    ctx.arc(0, 0, this.data.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw inner dashed circle
    ctx.rotate(this.time / 4 + Math.random() * 0.01);
    ctx.fillStyle = `${palette.tint}${Math.floor(24 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.strokeStyle = `${palette.secondary}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 1;
    ctx.setLineDash([this.innerDashLength, this.innerDashLength]); // Create dashed line pattern

    ctx.beginPath();
    ctx.arc(0, 0, this.data.radius * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
    this.time += dt;
  }
}