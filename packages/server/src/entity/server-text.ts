import { ServerEntity } from "./server-entity.js";
import { DataText } from "@spaceshipper/common";

export class ServerText extends ServerEntity {
  public data: DataText;

  get collisionRadius(): number {
    return 0;
  }

  constructor(data: DataText) {
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
