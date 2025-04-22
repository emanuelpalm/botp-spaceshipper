import { ServerEntity } from "./server-entity.ts";
import { DataPortal } from "@spaceshipper/common";

export class ServerPortal extends ServerEntity {
  data: DataPortal;

  get collisionRadius(): number {
    return this.data.radius;
  }
  constructor(data: DataPortal) {
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
