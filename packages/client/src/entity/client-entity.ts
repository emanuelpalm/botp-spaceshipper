import { DataEntity, DataEntityType, DataPortal, DataPlayer, DataText, DataBlackHole, DataSentry, DataSentryShot } from "@spaceshipper/common";
import { ClientPortal } from "./client-portal";
import { ClientPlayer } from "./client-player";
import { ClientText } from "./client-text";
import { ClientBlackHole } from "./client-black-hole";
import { ClientSentry } from "./client-sentry";
import { ClientSentryShot } from "./client-sentry-shot";

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

      case DataEntityType.BlackHole:
        entity = new ClientBlackHole(data as DataBlackHole);
        break;

      case DataEntityType.Sentry:
        entity = new ClientSentry(data as DataSentry);
        break;

      case DataEntityType.SentryShot:
        entity = new ClientSentryShot(data as DataSentryShot);
        break;

      default:
        throw new Error(`unsupported data entity type ${data.type}`);
    }
    map.set(data.id, entity);
  }
  entity.data = data;
}