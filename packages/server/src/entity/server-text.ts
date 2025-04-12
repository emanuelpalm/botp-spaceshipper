import { DataText } from "@spaceshipper/common";
import { ServerEntity } from "./server-entity.ts";

export class ServerText implements ServerEntity {
  data: DataText;

  constructor(data: DataText) {
    this.data = data;
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}
