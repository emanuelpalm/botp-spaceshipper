import { DataBackgroundStars, DataBackgroundType, DataEntity, DataEntityType, DataPlayer, getPlayerPaletteId, PaletteId } from "@spaceshipper/common";
import { Scene } from "./scene.js";
import { ServerEntity } from "../entity/server-entity.js";
import { ServerText } from "../entity/server-text.js";
import { ServerPlayer } from "../entity/server-player.js";

export class Lobby extends Scene {
  override readonly background: DataBackgroundStars = {
    type: DataBackgroundType.Stars,
    width: 960, height: 540,
    starCount: 300,
    dx: 0, dy: -50,
  };

  override readonly isPlaying: boolean = false;

  override readonly nonPlayerEntities: ServerEntity[];

  private textTitle = new ServerText({
    id: "textTitle",
    type: DataEntityType.Text,
    x: 480, y: 200,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Smoosh Sans", fontSize: 72, fontWeight: 100,
    text: "Battle of the Prompts",
  });

  private textSubtitle = new ServerText({
    id: "textSubtitle",
    type: DataEntityType.Text,
    x: 480, y: 260,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Gamma,
    font: "Oxanium", fontSize: 35, fontWeight: 400,
    text: "The Spaceshipper Challenge",
  });

  private textWaiting = new ServerText({
    id: "textWaiting",
    type: DataEntityType.Text,
    x: 480, y: 312,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Gamma,
    font: "Smoosh Sans", fontSize: 24, fontWeight: 500,
    text: "Waiting for players to join ...",
  });

  private time: number = 0;

  constructor() {
    super("lobby");

    this.nonPlayerEntities = [
      this.textTitle,
      this.textSubtitle,
      this.textWaiting,
    ];
  }

  override start(): void {
    this.positionPlayers();
  }

  override join(playerId: DataPlayer["id"], name: DataPlayer["name"]): void {
    const player = this.createPlayer(playerId, name);
    this.players.set(playerId, player);
    this.positionPlayers();
  }

  private createPlayer(id: DataPlayer["id"], name: DataPlayer["name"]): ServerPlayer {
    return new ServerPlayer({
      id,
      type: DataEntityType.Player,
      x: 0, y: 0,
      dx: 0, dy: 0,
      ax: 0, ay: 0,
      enabled: false,
      opacity: 1,
      paletteId: getPlayerPaletteId(this.players.size),
      name,
      score: 0,
    });
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

        player.data.x = 480 - (90 * (xLength - 1)) / 2 + (xIndex * 90);
        player.data.y = 394 + (yIndex * 80);

        player.data.dx = 0;
        player.data.dy = 0.0001;

        player.data.enabled = true;
      }
    }
  }

  override update(dt: number) {
    this.time += dt;

    // Make the waiting text blink.
    this.textWaiting.data.enabled = (this.time & 1) === 1;
  }
}