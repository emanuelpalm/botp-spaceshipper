import { DataBackground, DataEntity, DataPlayer } from "@spaceshipper/common";
import { ProtocolError } from "../error.ts";

export abstract class Scene {
  readonly id: string;
  readonly players: Map<DataPlayer["id"], DataPlayer> = new Map();

  abstract readonly background: DataBackground;

  protected abstract readonly nonPlayerEntities: DataEntity[];

  get entities(): DataEntity[] {
    return [...this.nonPlayerEntities, ...this.players.values()];
  }

  constructor(id: Scene["id"]) {
    this.id = id;
  }

  abstract start(): void;

  join(_playerId: DataPlayer["id"], _name: DataPlayer["name"]): void {
    throw new ProtocolError("It is not permitted to join at this time.");
  }

  leave(playerId: DataPlayer["id"]): void {
    const player = this.players.get(playerId);
    if (player) {
      player.opacity = 0;
      player.dx = 0;
      player.dy = 0;
    }
  }

  abstract update(dt: number): void;
}