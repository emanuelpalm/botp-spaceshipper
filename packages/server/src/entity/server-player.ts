import { DataPlayer } from "@spaceshipper/common";
import { ServerEntity } from "./server-entity.ts";

export class ServerPlayer implements ServerEntity {
  data: DataPlayer;

  constructor(data: DataPlayer) {
    this.data = data;
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}
