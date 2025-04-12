import { DataPortal } from "@spaceshipper/common";
import { ServerEntity } from "./server-entity.ts";

export class ServerPortal implements ServerEntity {
  data: DataPortal;

  constructor(data: DataPortal) {
    this.data = data;
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}
