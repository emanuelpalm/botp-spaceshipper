import { DataBackground } from "./data-background.js";
import { DataEntity } from "./data-entity.js";

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