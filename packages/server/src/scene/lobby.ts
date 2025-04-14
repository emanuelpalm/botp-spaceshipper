import { DataBackgroundStars, DataBackgroundType, DataEntityType, PaletteId } from "@spaceshipper/common";
import { ServerText } from "../entity/server-text.ts";
import { Scene } from "./scene.ts";
import { ServerPlayer } from "../entity/server-player.ts";

const background: DataBackgroundStars = {
  type: DataBackgroundType.Stars,

  width: 960, height: 540,

  starCount: 400,

  dx: 0, dy: -50,
};

const textTitle = new ServerText({
  id: "textTitle",
  type: DataEntityType.Text,

  x: 480, y: 200,
  dx: 0, dy: 0,

  opacity: 1,
  paletteId: PaletteId.Delta,

  font: "Smoosh Sans",
  fontSize: 72,
  fontWeight: 100,
  text: "Battle of the Prompts",
});

const textSubtitle = new ServerText({
  id: "textSubtitle",
  type: DataEntityType.Text,

  x: 480, y: 260,
  dx: 0, dy: 0,

  opacity: 1,
  paletteId: PaletteId.Gamma,

  font: "Oxanium",
  fontSize: 35,
  fontWeight: 400,
  text: "The Spaceshipper Challenge",
});

const textWaiting = new ServerText({
  id: "textWaiting",
  type: DataEntityType.Text,

  x: 480, y: 312,
  dx: 0, dy: 0,

  opacity: 0,
  paletteId: PaletteId.Gamma,

  font: "Smoosh Sans", fontSize: 24, fontWeight: 500,
  text: "Waiting for players to join ...",
});

class Lobby extends Scene {
  private clock: number = 0;

  override update(dt: number) {
    this.clock += dt;

    textWaiting.data.opacity = (this.clock & 1) === 1 ? 1 : 0;

    super.update(dt);
  }

  override join(player: ServerPlayer): void {
    this.entities.set(player.data.id, player);

    // Collect existing players
    const players = [];
    for (const entity of this.entities.values()) {
      if (entity instanceof ServerPlayer) {
        players.push(entity);
      }
    }

    // Calculate grid position (8 players per row)
    const PLAYERS_PER_ROW = 8;

    outer:
    for (let yIndex = 0, yEnd = Math.floor(players.length / PLAYERS_PER_ROW); yIndex <= yEnd; yIndex++) {
      const xLength = yIndex === yEnd
        ? (players.length - yIndex * PLAYERS_PER_ROW)
        : PLAYERS_PER_ROW;

      for (let xIndex = 0; xIndex < xLength; xIndex++) {
        const i = yIndex * PLAYERS_PER_ROW + xIndex;
        if (i >= players.length) {
          break outer;
        }

        const player = players[i];

        player.data.x = 480 - (90 * (xLength - 1)) / 2 + (xIndex * 90);
        player.data.y = 394 + (yIndex * 80);

        player.data.dx = 0;
        player.data.dy = 0.0001;
      }
    }
  }
}

export const lobby = new Lobby(
  "lobby",
  background,
  [
    textTitle,
    textSubtitle,
    textWaiting,
  ]
);