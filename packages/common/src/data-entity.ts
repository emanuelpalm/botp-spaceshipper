import { PaletteId } from "./palette.js";

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
  [DataEntityType.BlackHole]: DataBlackHole;
  [DataEntityType.Sentry]: DataSentry;
  [DataEntityType.SentryShot]: DataSentryShot;
}

export enum DataEntityType {
  Player = 0,
  Portal = 1,
  Text = 2,
  BlackHole = 3,
  Sentry = 4,
  SentryShot = 5,
}

export interface DataPlayer extends DataEntity {
  type: DataEntityType.Player;
  name: string;
  score: number;
  ax: number;
  ay: number;
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

export interface DataBlackHole extends DataEntity {
  type: DataEntityType.BlackHole;
  radius: number;
}

export interface DataSentry extends DataEntity {
  type: DataEntityType.Sentry;
  angle: number;
}

export interface DataSentryShot extends DataEntity {
  type: DataEntityType.SentryShot;
}

export function isDataEntityOfType<K extends DataEntityType>(entity: DataEntity, type: K): entity is DataEntityMap[K] {
  return entity.type === type;
}