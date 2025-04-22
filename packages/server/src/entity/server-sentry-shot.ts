import { ServerEntity } from "./server-entity.js";
import { DataSentryShot } from "@spaceshipper/common";

export class ServerSentryShot extends ServerEntity {
  data: DataSentryShot;

  get collisionRadius(): number {
    return 3;
  }

  constructor(data: DataSentryShot) {
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
