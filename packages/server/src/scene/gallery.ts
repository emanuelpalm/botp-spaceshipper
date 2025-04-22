import { DataBackgroundEmpty, DataBackgroundType, DataBlackHole, DataEntity, DataEntityType, DataPlayer, DataPortal, DataSentry, DataSentryShot, DataText, PaletteId } from "@spaceshipper/common";
import { Scene } from "./scene.ts";
import { ServerEntity } from "../entity/server-entity.ts";
import { ServerText } from "../entity/server-text.ts";
import { ServerPlayer } from "../entity/server-player.ts";
import { ServerPortal } from "../entity/server-portal.ts";
import { ServerBlackHole } from "../entity/server-black-hole.ts";
import { ServerSentry } from "../entity/server-sentry.ts";
import { ServerSentryShot } from "../entity/server-sentry-shot.ts";

export class Gallery extends Scene {
  override readonly background: DataBackgroundEmpty = {
    type: DataBackgroundType.Empty,
    width: 960, height: 540,
  };

  override readonly isPlaying: boolean = false;

  override get entities(): ServerEntity[] {
    return this.nonPlayerEntities;
  }

  override readonly nonPlayerEntities: ServerEntity[];

  private textSmooshSans: ServerText = new ServerText({
    id: "textSmooshSans",
    type: DataEntityType.Text,
    x: 100, y: 100,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Smoosh Sans", fontSize: 32, fontWeight: 100,
    text: "Smoosh Sans",
  });

  private textOxanium: ServerText = new ServerText({
    id: "textOxanium",
    type: DataEntityType.Text,
    x: 100, y: 140,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Oxanium", fontSize: 32, fontWeight: 100,
    text: "Oxanium",
  });

  private playerAlpha: ServerPlayer = new ServerPlayer({
    id: "playerAlpha",
    type: DataEntityType.Player,
    x: 250, y: 100,
    dx: 0, dy: 0,
    ax: 0, ay: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Alpha,
    name: "Alpha",
    score: 0,
  });

  private playerBeta: ServerPlayer = new ServerPlayer({
    id: "playerBeta",
    type: DataEntityType.Player,
    x: 300, y: 100,
    dx: 0, dy: 0,
    ax: 0, ay: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Beta,
    name: "Beta",
    score: 0,
  });

  private playerGamma: ServerPlayer = new ServerPlayer({
    id: "playerGamma",
    type: DataEntityType.Player,
    x: 350, y: 100,
    dx: 0, dy: 0,
    ax: 0, ay: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Gamma,
    name: "Gamma",
    score: 0,
  });

  private playerDelta: ServerPlayer = new ServerPlayer({
    id: "playerDelta",
    type: DataEntityType.Player,
    x: 400, y: 100,
    dx: 0, dy: 0,
    ax: 0, ay: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Delta,
    name: "Delta",
    score: 0,
  });

  private playerEpsilon: ServerPlayer = new ServerPlayer({
    id: "playerEpsilon",
    type: DataEntityType.Player,
    x: 450, y: 100,
    dx: 0, dy: 0,
    ax: 0, ay: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Epsilon,
    name: "Epsilon",
    score: 0,
  });

  private playerIota: ServerPlayer = new ServerPlayer({
    id: "playerIota",
    type: DataEntityType.Player,
    x: 500, y: 100,
    dx: 0, dy: 0,
    ax: 0, ay: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Iota,
    name: "Iota",
    score: 0,
  });

  private playerKappa: ServerPlayer = new ServerPlayer({
    id: "playerKappa",
    type: DataEntityType.Player,
    x: 550, y: 100,
    dx: 0, dy: 0,
    ax: 0, ay: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Kappa,
    name: "Kappa",
    score: 0,
  });

  private portal: ServerPortal = new ServerPortal({
    id: "portal",
    type: DataEntityType.Portal,
    x: 250, y: 250,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Target,
    name: "Portal",
    radius: 74,
  });

  private blackHole: ServerBlackHole = new ServerBlackHole({
    id: "blackHole",
    type: DataEntityType.BlackHole,
    x: 450, y: 250,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Epsilon,
    radius: 74,
  });

  private sentry: ServerSentry = new ServerSentry({
    id: "sentry",
    type: DataEntityType.Sentry,
    x: 600, y: 250,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Alpha,
    angle: 0,
  });

  private sentryShot: ServerSentryShot = new ServerSentryShot({
    id: "sentryShot",
    type: DataEntityType.SentryShot,
    x: 680, y: 250,
    dx: 0.0001, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Alpha,
  });

  constructor() {
    super("gallery");

    this.nonPlayerEntities = [
      this.textSmooshSans,
      this.textOxanium,

      this.playerAlpha,
      this.playerBeta,
      this.playerGamma,
      this.playerDelta,
      this.playerEpsilon,
      this.playerIota,
      this.playerKappa,

      this.portal,
      this.blackHole,

      this.sentry,
      this.sentryShot,
    ];
  }

  start(): void { }

  update(_dt: number): void { }
}