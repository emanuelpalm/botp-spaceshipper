import { DataText, getPalette, Palette } from "@spaceshipper/common";
import { ClientEntity } from "./client-entity";

export class ClientText implements ClientEntity {
  public data: DataText;

  private palette: Palette;

  constructor(data: DataText) {
    this.data = data;
    this.palette = getPalette(data.paletteId);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw tint.
    ctx.font = `${Math.min(this.data.fontWeight * 1.2, 900)} ${this.data.fontSize}px Oxanium`;
    ctx.fillStyle = `${this.palette.tint}60`;
    ctx.fillText(this.data.text, this.data.fontSize * 0.025, Math.random());

    // Draw primary.
    ctx.font = `${this.data.fontWeight} ${this.data.fontSize}px Oxanium`;
    ctx.fillStyle = this.palette.primary;
    ctx.fillText(this.data.text, 0, 0);

    // Draw secondary.
    ctx.font = `${this.data.fontWeight * 0.8} ${this.data.fontSize}px Oxanium`;
    ctx.fillStyle = `${this.palette.secondary}70`;
    ctx.fillText(this.data.text, 0, this.data.fontSize * 0.025);

    ctx.restore();
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}