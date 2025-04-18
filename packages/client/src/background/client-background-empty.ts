import { DataBackgroundEmpty } from "@spaceshipper/common";
import { ClientBackground } from "./client-background";

export class ClientBackgroundEmpty implements ClientBackground {
  public data: DataBackgroundEmpty;

  constructor(data: DataBackgroundEmpty) {
    this.data = data;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.data.width, this.data.height);
  }

  update(_dt: number): void {}
}
