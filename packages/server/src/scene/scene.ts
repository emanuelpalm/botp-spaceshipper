import { DataBackground, DataEntity, DataPlayer } from "@spaceshipper/common";
import { ProtocolError } from "../error.ts";
import { ServerPlayer } from "../entity/server-player.ts";
import { ServerEntity } from "../entity/server-entity.ts";

export abstract class Scene {
  readonly id: string;
  readonly players: Map<DataPlayer["id"], ServerPlayer> = new Map();

  abstract readonly background: DataBackground;

  abstract readonly isPlaying: boolean;

  protected abstract readonly nonPlayerEntities: ServerEntity[];

  get entities(): ServerEntity[] {
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
      player.data.enabled = false;
    }
  }

  abstract update(dt: number): void;
}