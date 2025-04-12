export enum EntityType {
  Spaceship,
  Portal,
}

export interface DataEntity {
  id: string;
  type: EntityType;

  x: number;
  y: number;

  dx: number;
  dy: number;

  primaryColor: string;
  secondaryColor: string;
  tintColor: string;
}

export interface DataSpaceship extends DataEntity {
  type: EntityType.Spaceship;
  name: string;
}

export interface DataPortal extends DataEntity {
  type: EntityType.Portal;
  name: string;
  radius: number;
}
