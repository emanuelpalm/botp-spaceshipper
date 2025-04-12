import { DataPortal, getPalette, Palette } from "@spaceshipper/common";
import { ClientEntity } from "./client-entity";

export class ClientPortal implements ClientEntity {
  public data: DataPortal;

  private clock: number = 0;
  private outerDashLength: number;
  private innerDashLength: number;
  private palette: Palette;

  constructor(data: DataPortal) {
    this.data = data;

    this.outerDashLength = (Math.PI * this.data.radius * 2) / 80;
    this.innerDashLength = (Math.PI * this.data.radius * 2) / 120;
    this.palette = getPalette(data.paletteId);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Draw name.
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `12px Oxanium`;
    ctx.fillStyle = this.palette.primary;
    ctx.fillText(this.data.name, 0, -26);

    // Draw cross in the middle
    ctx.strokeStyle = this.palette.secondary;
    ctx.lineWidth = 2;

    const crossSize = Math.min(this.data.radius, 10); // Cross size is 20% of radius
    ctx.beginPath();
    // Horizontal line
    ctx.moveTo(-crossSize, 0);
    ctx.lineTo(crossSize, 0);
    // Vertical line
    ctx.moveTo(0, -crossSize);
    ctx.lineTo(0, crossSize);
    ctx.stroke();

    // Draw outer dashed circle
    ctx.rotate(this.clock / 2 + Math.random() * 0.01);
    ctx.fillStyle = `${this.palette.tint}${Math.floor(18 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.strokeStyle = `${this.palette.primary}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 2;
    ctx.setLineDash([this.outerDashLength, this.outerDashLength]); // Create dashed line pattern

    ctx.beginPath();
    ctx.arc(0, 0, this.data.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw inner dashed circle
    ctx.rotate(this.clock / 4 + Math.random() * 0.01);
    ctx.fillStyle = `${this.palette.tint}${Math.floor(24 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.strokeStyle = `${this.palette.secondary}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 1;
    ctx.setLineDash([this.innerDashLength, this.innerDashLength]); // Create dashed line pattern

    ctx.beginPath();
    ctx.arc(0, 0, this.data.radius * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
    this.clock += dt;
  }
}