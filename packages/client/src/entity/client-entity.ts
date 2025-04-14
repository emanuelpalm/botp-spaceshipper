import { DataEntity, DataEntityType, DataPortal, DataPlayer, DataText } from "@spaceshipper/common";
import { ClientPortal } from "./client-portal";
import { ClientPlayer } from "./client-player";
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
      case DataEntityType.Player:
        entity = new ClientPlayer(data as DataPlayer);
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