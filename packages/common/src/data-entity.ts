import { PaletteId } from "./palette.ts";

export interface DataEntity {
  id: string;
  type: DataEntityType;

  x: number;
  y: number;

  dx: number;
  dy: number;

  paletteId: PaletteId;
}

export enum DataEntityType {
  Portal = 0,
  Spaceship = 1,
  Text = 2,
}

export interface DataPortal extends DataEntity {
  type: DataEntityType.Portal;
  name: string;
  radius: number;
}

export interface DataSpaceship extends DataEntity {
  type: DataEntityType.Spaceship;
  name: string;
}

export interface DataText extends DataEntity {
  type: DataEntityType.Text;
  text: string;
  fontSize: number;
  fontWeight: number;
}
