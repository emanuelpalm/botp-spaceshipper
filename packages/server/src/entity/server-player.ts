import { accelerate, clamp } from "@spaceshipper/common";
import { ServerEntity } from "./server-entity.ts";
import { DataPlayer } from "@spaceshipper/common";

export class ServerPlayer extends ServerEntity {
  static readonly MAX_VELOCITY = 200;
  static readonly MAX_ACCELERATION = 200;

  data: DataPlayer;

  get collisionRadius(): number {
    return 15;
  }

  constructor(data: DataPlayer) {
    super();

    this.data = data;
  }

  update(dt: number): void {
    if (this.data.enabled) {
      [this.data.ax, this.data.ay] = clamp(this.data.ax, this.data.ay, 0, 1);
      [this.data.dx, this.data.dy] = accelerate(this.data.dx, this.data.dy, this.data.ax, this.data.ay, ServerPlayer.MAX_VELOCITY, ServerPlayer.MAX_ACCELERATION * dt);

      this.data.x += this.data.dx * dt;
      this.data.y += this.data.dy * dt;
    }
  }
}
