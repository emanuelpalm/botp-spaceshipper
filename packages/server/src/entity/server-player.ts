import { DataEntityType, DataPlayer, getPlayerPaletteId, PaletteId } from "@spaceshipper/common";
import { ServerEntity } from "./server-entity.ts";

let paletteIdCounter = 0;

export class ServerPlayer implements ServerEntity {
  data: DataPlayer;

  static create(id: string, name: string): ServerPlayer {
    return new ServerPlayer({
      id,
      type: DataEntityType.Player,

      x: 0, y: 0,
      dx: 0, dy: 0,

      opacity: 1,
      paletteId: getPlayerPaletteId(paletteIdCounter++),

      name,
      score: 0,
    });
  }

  constructor(data: DataPlayer) {
    this.data = data;
  }

  update(dt: number): void {
    this.data.x += this.data.dx * dt;
    this.data.y += this.data.dy * dt;
  }
}
