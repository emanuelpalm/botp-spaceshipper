import { DataText, getPalette, Palette } from "@spaceshipper/common";
import { ClientEntity } from "./client-entity";

export class ClientText implements ClientEntity {
  public data: DataText;

  constructor(data: DataText) {
    this.data = data;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    const palette = getPalette(this.data.paletteId);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw tint.
    ctx.font = `${Math.min(this.data.fontWeight * 1.2, 900)} ${this.data.fontSize}px ${this.data.font}`;
    ctx.fillStyle = `${palette.tint}60`;
    ctx.fillText(this.data.text, this.data.fontSize * 0.025, Math.random());

    const measure = ctx.measureText(this.data.text);
    ctx.fillStyle = "#00000030";
    ctx.fillRect(
      -(measure.width / 2),
      -(this.data.fontSize / 2),
      measure.width,
      this.data.fontSize);

    // Draw primary.
    ctx.font = `${this.data.fontWeight} ${this.data.fontSize}px ${this.data.font}`;
    ctx.fillStyle = palette.primary;
    ctx.fillText(this.data.text, 0, 0);

    // Draw secondary.
    if (this.data.fontSize >= 30) {
      ctx.font = `${this.data.fontWeight * 0.8} ${this.data.fontSize}px ${this.data.font}`;
      ctx.fillStyle = `${palette.secondary}70`;
      ctx.fillText(this.data.text, 0, this.data.fontSize * 0.025);
    }

    ctx.restore();
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}