import { DataBackgroundStars, DataBackgroundType, DataEntityType, PaletteId } from "@spaceshipper/common";
import { ServerText } from "../entity/server-text.ts";
import { Scene } from "../scene.ts";

const background: DataBackgroundStars = {
  type: DataBackgroundType.Stars,

  width: 960,
  height: 540,

  starCount: 200,

  dx: 0,
  dy: -50,
};

const textTitle = new ServerText({
  id: "textTitle",
  type: DataEntityType.Text,

  x: 480,
  y: 200,
  dx: 0,
  dy: 0,

  paletteId: PaletteId.Delta,

  font: "Smoosh Sans",
  fontSize: 72,
  fontWeight: 100,
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

  font: "Oxanium",
  fontSize: 35,
  fontWeight: 400,
  text: "The Spaceshipper Challenge",
});

const textWaiting = new ServerText({
  id: "textWaiting",
  type: DataEntityType.Text,

  x: 480,
  y: 312,
  dx: 0,
  dy: 0,

  paletteId: PaletteId.Gamma,

  font: "Smoosh Sans",
  fontSize: 24,
  fontWeight: 600,
  text: "Waiting for players to join ...",
});

class Intro extends Scene { }

export const intro = new Intro(
  "intro",
  background,
  [
    textTitle,
    textSubtitle,
    textWaiting,
  ]
);