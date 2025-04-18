export interface DataBackground {
  type: DataBackgroundType;

  width: number;
  height: number;
}

export enum DataBackgroundType {
  Empty,
  Stars,
}

export interface DataBackgroundEmpty extends DataBackground {
  type: DataBackgroundType.Empty;
}

export interface DataBackgroundStars extends DataBackground {
  type: DataBackgroundType.Stars;

  starCount: number;

  dx: number;
  dy: number;
}