import { ServerEntity } from "./entity/server-entity.ts";
import { DataState } from "@spaceshipper/common";

export class Scene {
  public entities: ServerEntity[];

  constructor(entities: ServerEntity[]) {
    this.entities = entities;
  }

  getState(): DataState {
    return {
      entities: this.entities.map(entity => entity.data),
    };
  }
}