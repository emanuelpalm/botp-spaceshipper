import { DataBackground } from "./data-background.ts";
import { DataEntity } from "./data-entity.ts";

export interface DataState {
  worldId: string;
  sceneId: string;
  background: DataBackground;
  entities: DataEntity[];
}
