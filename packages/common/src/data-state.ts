import { DataBackground } from "./data-background.ts";
import { DataEntity } from "./data-entity.ts";

export interface DataState {
  worldId: string;
  sceneId: string;
  isPlaying: boolean;
  background: DataBackground;
  entities: DataEntity[];
}

export interface DataStateSimplified {
  worldId: string;
  sceneId: string;
  isPlaying: boolean;
}