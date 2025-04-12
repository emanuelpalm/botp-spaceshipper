import { Palette } from "./palette.ts";

export interface DataEntity {
  id: string;
  type: DataEntityType;

  x: number;
  y: number;

  dx: number;
  dy: number;

  palette: Palette;
}

export enum DataEntityType {
  Spaceship = 0,
  Portal = 1,
}

export interface DataSpaceship extends DataEntity {
  type: DataEntityType.Spaceship;
  name: string;
}

export interface DataPortal extends DataEntity {
  type: DataEntityType.Portal;
  name: string;
  radius: number;
}