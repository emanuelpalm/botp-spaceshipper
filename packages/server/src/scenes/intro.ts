import { DataBackgroundStars, DataBackgroundType, DataEntityType, PaletteId } from "@spaceshipper/common";
import { ServerText } from "../entity/server-text.ts";
import { Scene } from "../scene.ts";

const background: DataBackgroundStars = {
  type: DataBackgroundType.Stars,

  width: 960,
  height: 540,

  starCount: 100,

  dx: 0,
  dy: 0,
  dz: 100,
};

const textTitle = new ServerText({
  id: "textTitle",
  type: DataEntityType.Text,

  x: 480,
  y: 200,
  dx: 0,
  dy: 0,

  paletteId: PaletteId.Delta,

  fontSize: 64,
  fontWeight: 200,
  text: "Battle of the Prompts",
});

const textSubtitle = new ServerText({
  id: "textSubtitle",
  type: DataEntityType.Text,

  x: 480,
  y: 260,
  dx: 0,
  dy: 0,

  paletteId: PaletteId.Gamma,

  fontSize: 32,
  fontWeight: 100,
  text: "The Spaceshipper Challenge",
});

class Intro extends Scene { }

export const intro = new Intro(
  "intro",
  background,
  [
    textTitle,
    textSubtitle,
  ]
);