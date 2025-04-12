import { DataBackground } from "./data-background.ts";
import { DataEntity } from "./data-entity.ts";

export interface DataState {
  sceneId: string;
  background: DataBackground;
  entities: DataEntity[];
}