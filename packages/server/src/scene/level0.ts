import { DataBackgroundStars, DataBackgroundType, DataEntity, DataEntityType, DataPlayer, DataPortal, DataText, PaletteId } from "@spaceshipper/common";
import { Scene } from "./scene.ts";

export class Level0 extends Scene {
  override readonly background: DataBackgroundStars = {
    type: DataBackgroundType.Stars,
    width: 960, height: 540,
    starCount: 200,
    dx: 0 * (Math.random() - 0.5), dy: 10 * (Math.random() - 0.5),
  };

  override readonly nonPlayerEntities: DataEntity[];

  private textCountdown: DataText = {
    id: "textCountdown",
    type: DataEntityType.Text,
    x: 480, y: 30,
    dx: 0, dy: 0,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Oxanium", fontSize: 32, fontWeight: 300,
    text: "t - 60.00",
  };

  private portalTarget: DataPortal = {
    id: "portal",
    type: DataEntityType.Portal,
    x: 100, y: 100,
    dx: 0, dy: 0,
    paletteId: PaletteId.Target,
    opacity: 1,
    name: "TARGET",
    radius: 80,
  };

  private time: number = 0;

  constructor() {
    super("level0");

    this.nonPlayerEntities = [
      this.textCountdown,
      this.portalTarget,
    ];
  }

  override update(dt: number) {
    this.time += dt;
  }
}
