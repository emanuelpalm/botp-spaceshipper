import { DataBackground } from "./data-background.ts";
import { DataEntity } from "./data-entity.ts";

export interface DataStateScene {
  sceneId: string;
  background: DataBackground;
  entities: DataEntity[];
}

export interface DataStateGame {
  sceneId: string;
  isPlaying: boolean;
}