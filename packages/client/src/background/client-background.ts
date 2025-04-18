import { DataBackground, DataBackgroundEmpty, DataBackgroundStars, DataBackgroundType, } from "@spaceshipper/common";
import { ClientBackgroundStars } from "./client-background-stars";
import { ClientBackgroundEmpty } from "./client-background-empty";

export interface ClientBackground {
  data: DataBackground

  draw(ctx: CanvasRenderingContext2D): void;

  update(dt: number): void;
}

export function createClientBackground(data: DataBackground): ClientBackground {
  switch (data.type) {
    case DataBackgroundType.Empty:
      return new ClientBackgroundEmpty(data as DataBackgroundEmpty);

    case DataBackgroundType.Stars:
      return new ClientBackgroundStars(data as DataBackgroundStars);

    default:
      throw new Error(`unsupported data background type ${data.type}`);
  }
}