import { DataSpaceship } from "@spaceshipper/common";
import { ServerEntity } from "./server-entity.ts";

export class ServerSpaceship implements ServerEntity {
  data: DataSpaceship;

  constructor(data: DataSpaceship) {
    this.data = data;
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}
