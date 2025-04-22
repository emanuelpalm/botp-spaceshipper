import { ServerEntity } from "./server-entity.ts";
import { DataBlackHole } from "@spaceshipper/common";

export class ServerBlackHole extends ServerEntity {
  data: DataBlackHole;

  get collisionRadius(): number {
    return this.data.radius;
  }

  constructor(data: DataBlackHole) {
    super();

    this.data = data;
  }

  update(dt: number): void {
    if (this.data.enabled) {
      this.data.x += this.data.dx * dt;
      this.data.y += this.data.dy * dt;
    }
  }
}
