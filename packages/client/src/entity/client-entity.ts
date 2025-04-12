import { DataEntity, DataEntityType, DataPortal, DataSpaceship, DataText } from "@spaceshipper/common";
import { ClientPortal } from "./client-portal";
import { ClientSpaceship } from "./client-spaceship";
import { ClientText } from "./client-text";

export interface ClientEntity {
  data: DataEntity

  draw(ctx: CanvasRenderingContext2D): void;

  update(dt: number): void;
}

export function createOrUpdateClientEntity(data: DataEntity, map: Map<DataEntity["id"], ClientEntity>): void {
  let entity = map.get(data.id);
  if (!entity) {
    switch (data.type) {
      case DataEntityType.Spaceship:
        entity = new ClientSpaceship(data as DataSpaceship);
        break;

      case DataEntityType.Portal:
        entity = new ClientPortal(data as DataPortal);
        break;

      case DataEntityType.Text:
        entity = new ClientText(data as DataText);
        break;

      default:
        throw new Error(`unsupported data entity type ${data.type}`);
    }
    map.set(data.id, entity);
  }
  entity.data = data;
}