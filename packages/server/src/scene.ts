import { ServerEntity } from "./entity/server-entity.ts";
import { DataBackground, DataState } from "@spaceshipper/common";

export class Scene {
  public id: string;
  public background: DataBackground;
  public entities: ServerEntity[];

  constructor(id: string, background: DataBackground, entities: ServerEntity[]) {
    this.id = id;
    this.background = background;
    this.entities = entities;
  }

  getState(): DataState {
    return {
      sceneId: this.id,
      background: this.background,
      entities: this.entities.map(entity => entity.data),
    };
  }

  update(dt: number) {
    for (const entity of this.entities) {
      entity.update(dt);
    }
  }
}