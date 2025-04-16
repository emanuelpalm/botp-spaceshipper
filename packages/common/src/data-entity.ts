import { PaletteId } from "./palette.ts";

export interface DataEntity {
  id: string;
  type: DataEntityType;

  x: number;
  y: number;

  dx: number;
  dy: number;

  enabled: boolean;
  opacity: number;
  paletteId: PaletteId;
}

export interface DataEntityMap {
  [DataEntityType.Player]: DataPlayer;
  [DataEntityType.Portal]: DataPortal;
  [DataEntityType.Text]: DataText;
}

export enum DataEntityType {
  Player = 0,
  Portal = 1,
  Text = 2,
}

export interface DataPlayer extends DataEntity {
  type: DataEntityType.Player;
  name: string;
  score: number;
}

export interface DataPortal extends DataEntity {
  type: DataEntityType.Portal;
  name: string;
  radius: number;
}

export interface DataText extends DataEntity {
  type: DataEntityType.Text;
  text: string;
  font: string;
  fontSize: number;
  fontWeight: number;
}

export function isDataEntityOfType<K extends DataEntityType>(entity: DataEntity, type: K): entity is DataEntityMap[K] {
  return entity.type === type;
}