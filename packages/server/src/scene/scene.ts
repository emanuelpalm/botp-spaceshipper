import { DataBackground, DataStateScene } from "@spaceshipper/common";
import { ProtocolError } from "../protocol-error.ts";
import { ServerEntity } from "../entity/server-entity.ts";

export class Scene {
  public id: string;
  public background: DataBackground;
  public entities: Map<string, ServerEntity>;

  constructor(id: string, background: DataBackground, entities: ServerEntity[]) {
    this.id = id;
    this.background = background;
    this.entities = new Map(entities.map(entity => [entity.data.id, entity]));
  }

  getState(worldId: string): DataStateScene {
    return {
      sceneId: `/${worldId}/${this.id}`,
      background: this.background,
      entities: [...this.entities.values()].map(entity => entity.data),
    };
  }

  join(_playerId: string, name: string): void {
    throw new ProtocolError("It is not permitted to join at this time.");
  }

  leave(playerId: string): void {
    const player = this.entities.get(playerId);
    if (player) {
      player.data.opacity = 0;
      player.data.dx = 0;
      player.data.dy = 0;
    }
  }

  update(dt: number): void {
    for (const entity of this.entities.values()) {
      entity.update(dt);
    }
  }
}