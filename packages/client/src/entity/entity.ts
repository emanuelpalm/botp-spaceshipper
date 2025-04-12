import { DataEntity, DataPortal, DataSpaceship, EntityType } from "@spaceshipper/common"
import { ClientPortal } from "./portal";
import { ClientSpaceship } from "./spaceship";

export interface ClientEntity {
  data: DataEntity

  draw(ctx: CanvasRenderingContext2D): void;

  update(dt: number): void;
}

export function createOrUpdateClientEntity(data: DataEntity, map: Map<DataEntity["id"], ClientEntity>): void {
  let entity = map.get(data.id);
  if (!entity) {
    switch (data.type) {
      case EntityType.Spaceship:
        entity = new ClientSpaceship(data as DataSpaceship);
        break;
      case EntityType.Portal:
        entity = new ClientPortal(data as DataPortal);
        break;

      default:
        throw new Error(`unsupported data entity type ${data.type}`);
    }
    map.set(data.id, entity);
  }
  entity.data = data;
}