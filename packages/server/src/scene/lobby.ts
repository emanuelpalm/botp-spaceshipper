import { DataBackgroundStars, DataBackgroundType, DataEntity, DataEntityType, DataPlayer, getPlayerPaletteId, PaletteId } from "@spaceshipper/common";
import { Scene } from "./scene.ts";

export class Lobby extends Scene {
  override readonly background: DataBackgroundStars = {
    type: DataBackgroundType.Stars,
    width: 960, height: 540,
    starCount: 400,
    dx: 0, dy: -50,
  };

  override readonly nonPlayerEntities: DataEntity[];

  private textTitle = {
    id: "textTitle",
    type: DataEntityType.Text,
    x: 480, y: 200,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Smoosh Sans", fontSize: 72, fontWeight: 100,
    text: "Battle of the Prompts",
  };

  private textSubtitle = {
    id: "textSubtitle",
    type: DataEntityType.Text,
    x: 480, y: 260,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Gamma,
    font: "Oxanium", fontSize: 35, fontWeight: 400,
    text: "The Spaceshipper Challenge",
  };

  private textWaiting = {
    id: "textWaiting",
    type: DataEntityType.Text,
    x: 480, y: 312,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Gamma,
    font: "Smoosh Sans", fontSize: 24, fontWeight: 500,
    text: "Waiting for players to join ...",
  };

  private time: number = 0;

  constructor() {
    super("lobby");

    this.nonPlayerEntities = [
      this.textTitle,
      this.textSubtitle,
      this.textWaiting,
    ];
  }

  override start(): void {}

  override join(playerId: DataPlayer["id"], name: DataPlayer["name"]): void {
    const player = this.createPlayer(playerId, name);
    this.players.set(playerId, player);
    this.positionPlayers();
  }

  private createPlayer(id: DataPlayer["id"], name: DataPlayer["name"]): DataPlayer {
    return {
      id,
      type: DataEntityType.Player,
      x: 0, y: 0,
      dx: 0, dy: 0,
      enabled: false,
      opacity: 1,
      paletteId: getPlayerPaletteId(this.players.size),
      name,
      score: 0,
    };
  }

  positionPlayers(playersPerRow: number = 8) {
    const players = [...this.players.values()];

    outer:
    for (let yIndex = 0, yEnd = Math.floor(players.length / playersPerRow); yIndex <= yEnd; yIndex++) {
      const xLength = yIndex === yEnd
        ? (players.length - yIndex * playersPerRow)
        : playersPerRow;

      for (let xIndex = 0; xIndex < xLength; xIndex++) {
        const i = yIndex * playersPerRow + xIndex;
        if (i >= players.length) {
          break outer;
        }

        const player = players[i];

        player.x = 480 - (90 * (xLength - 1)) / 2 + (xIndex * 90);
        player.y = 394 + (yIndex * 80);

        player.dx = 0;
        player.dy = 0.0001;

        player.enabled = true;
      }
    }
  }

  override update(dt: number) {
    this.time += dt;

    // Make the waiting text blink.
    this.textWaiting.enabled = (this.time & 1) === 1;
  }
}