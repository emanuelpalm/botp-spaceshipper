export interface DataBackground {
  type: DataBackgroundType;

  width: number;
  height: number;
}

export enum DataBackgroundType {
  Stars,
}

export interface DataBackgroundStars extends DataBackground {
  type: DataBackgroundType.Stars;

  starCount: number;

  dx: number;
  dy: number;
}