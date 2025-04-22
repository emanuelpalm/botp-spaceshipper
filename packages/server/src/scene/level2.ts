import { DataBackgroundStars, DataBackgroundType, DataEntityType, DataPlayer, PaletteId } from "@spaceshipper/common";
import { Scene } from "./scene.ts";
import { directionTo } from "@spaceshipper/common";
import { formatTime } from "../util/format.ts";
import { ServerEntity } from "../entity/server-entity.ts";
import { ServerSentry } from "../entity/server-sentry.ts";
import { ServerPortal } from "../entity/server-portal.ts";
import { ServerText } from "../entity/server-text.ts";
import { ServerPlayer } from "../entity/server-player.ts";

export class Level2 extends Scene {
  override readonly background: DataBackgroundStars = {
    type: DataBackgroundType.Stars,
    width: 960, height: 540,
    starCount: 200,
    dx: 90 * (Math.random() - 0.5), dy: 90 * (Math.random() - 0.5),
  };

  override get isPlaying(): boolean {
    return this.state === LevelState.Playing;
  }

  override get nonPlayerEntities(): ServerEntity[] {
    return [
      this.sentry,
      ...this.sentry.shots,
      this.portalTarget,
      this.textCountdown,
      this.textCenter,
      this.textScores,
      ...this.textPlayerScores.values(),
    ];
  }

  private textCountdown: ServerText = new ServerText({
    id: "textCountdown",
    type: DataEntityType.Text,
    x: 480, y: 30,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Oxanium", fontSize: 24, fontWeight: 300,
    text: "00:00",
  });

  private textCenter: ServerText = new ServerText({
    id: "textCenter",
    type: DataEntityType.Text,
    x: 480, y: 270,
    dx: 0, dy: 0,
    enabled: false,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Oxanium", fontSize: 32, fontWeight: 700,
    text: "Avoid being shot!",
  });

  private textScores: ServerText = new ServerText({
    id: "textScores",
    type: DataEntityType.Text,
    x: 480, y: 90,
    dx: 0, dy: 0,
    enabled: false,
    opacity: 1,
    paletteId: PaletteId.Iota,
    font: "Smoosh Sans", fontSize: 42, fontWeight: 500,
    text: "SCORES",
  });

  private textPlayerScores: ServerText[] = [];

  private portalTarget: ServerPortal = new ServerPortal({
    id: "portal",
    type: DataEntityType.Portal,
    x: 480, y: 400,
    dx: 0, dy: 0,
    paletteId: PaletteId.Target,
    enabled: false,
    opacity: 1,
    name: "TARGET",
    radius: 58,
  });

  private sentry: ServerSentry = new ServerSentry({
    id: "sentry",
    type: DataEntityType.Sentry,
    x: 0, y: 0,
    dx: 0, dy: 0,
    enabled: false,
    opacity: 1,
    paletteId: PaletteId.Alpha,
    angle: 0,
  });

  private deadline: number = 0;
  private mapPlayerIdToStats: Map<DataPlayer["id"], PlayerStats> = new Map();
  private roundIndex: number = 0;
  private state: LevelState = LevelState.Initial;
  private time: number = 0;

  constructor() {
    super("level2");
  }

  override start(): void {
    this.textCenter.data.enabled = true;
    this.textScores.data.enabled = false;

    this.sentry.data.x = 430;
    this.sentry.data.y = 400;
    this.sentry.data.dx = 0;
    this.sentry.data.dy = 0;
    this.sentry.data.angle = 0;
    this.sentry.data.enabled = true;
    this.sentry.potentialTargets = [];

    this.sentry.shots[0].data.x = 540;
    this.sentry.shots[0].data.y = 400;
    this.sentry.shots[0].data.dx = 0.0001;
    this.sentry.shots[0].data.dy = 0;
    this.sentry.shots[0].data.enabled = true;

    for (const textScore of this.textPlayerScores) {
      textScore.data.enabled = false;
    }

    this.textPlayerScores = [];

    this.deadline = 10;

    this.mapPlayerIdToStats.clear();
    for (const [playerId, player] of this.players) {
      player.data.enabled = false;

      this.mapPlayerIdToStats.set(playerId, { rounds: [] });

      this.textPlayerScores.push(new ServerText({
        id: `textScore-${playerId}`,
        type: DataEntityType.Text,
        x: 480, y: 146 + (this.textPlayerScores.length * 33),
        dx: 0, dy: 0,
        enabled: false,
        opacity: 1,
        paletteId: player.data.paletteId,
        font: "Smoosh Sans", fontSize: 24, fontWeight: 400,
        text: "",
      }));
    }

    this.roundIndex = 0;
    this.state = LevelState.Initial;
    this.time = 0;
  }

  private playRound(index: number): void {
    const round = ROUNDS[index];

    this.textCountdown.data.text = "";
    this.textCenter.data.enabled = false;
    this.textScores.data.enabled = false;

    for (const textScore of this.textPlayerScores.values()) {
      textScore.data.enabled = false;
    }

    this.sentry.reset();
    this.sentry.data.x = round.sentryX;
    this.sentry.data.y = round.sentryY;
    this.sentry.data.enabled = true;
    this.sentry.potentialTargets = [...this.players.values()];

    this.portalTarget.data.x = round.targetX;
    this.portalTarget.data.y = round.targetY;
    this.portalTarget.data.dx = round.targetDX;
    this.portalTarget.data.dy = round.targetDY;
    this.portalTarget.data.enabled = true;

    for (const player of this.players.values()) {
      player.data.x = round.startX + (Math.random() - 0.5) * 60;
      player.data.y = round.startY + (Math.random() - 0.5) * 60;
      player.data.dx = 0;
      player.data.dy = 0;
      player.data.ax = 0;
      player.data.ay = 0;

      [player.data.ax, player.data.ay] = directionTo(player.data.x, player.data.y, round.targetX, round.targetY);

      player.data.enabled = true;
    }

    this.deadline = round.deadline;
    this.roundIndex = index;
    this.state = LevelState.Playing;
    this.time = 0;
  }

  private endRound(): void {
    this.textCountdown.data.text = "";
    this.textScores.data.enabled = true;
    this.portalTarget.data.enabled = false;

    const playerScores: [PaletteId, string, number, number][] = [];
    for (const [playerId, player] of this.players) {
      const playerRound = this.mapPlayerIdToStats.get(playerId)!.rounds?.[this.roundIndex];

      if (playerRound?.finished) {
        const round = ROUNDS[this.roundIndex];
        const roundScore = Math.round((round.deadline - playerRound.finishedAfter) * round.scorePerRemainingSecond);
        player.data.score += roundScore;
        playerScores.push([player.data.paletteId, player.data.name, player.data.score, roundScore]);
      } else {
        playerScores.push([player.data.paletteId, player.data.name, player.data.score, 0]);
      }
    }

    this.sentry.reset();

    playerScores.sort((a, b) => b[2] - a[2]);
    playerScores.forEach(([paletteId, name, totalScore, roundScore], index) => {
      const textScore = this.textPlayerScores[index];
      textScore.data.enabled = true;
      textScore.data.paletteId = paletteId;
      textScore.data.text = `${index + 1}.${name}: ${totalScore} ${roundScore !== 0 ? `(+${roundScore})` : ""}`;
    });

    if (this.roundIndex < ROUNDS.length - 1) {
      this.deadline = 10;
      this.state = LevelState.ShowingScores;
      this.time = 0;
    } else {
      this.textCountdown.data.text = "LEVEL COMPLETE";
      this.state = LevelState.End;
    }
  }

  private endRoundForPlayer(player: ServerPlayer, finished: boolean): void {
    const stats = this.mapPlayerIdToStats.get(player.data.id)!;
    if (finished) {
      stats.rounds.push({ finished: true, finishedAfter: this.time });
    } else {
      stats.rounds.push({ finished: false });
    }

    player.data.enabled = false;
  }

  override update(dt: number) {
    this.time += dt;

    // Update all entities.
    for (const entity of this.entities) {
      entity.update(dt);
    }

    switch (this.state) {
      case LevelState.Initial:
        // Show countdown.
        this.textCountdown.data.text = `ROUND 1/${ROUNDS.length} STARTS IN ${formatTime(this.deadline - this.time)}`;

        // Check if the countdown is over.
        if (this.time >= this.deadline) {
          this.playRound(0);
        }
        break;

      case LevelState.Playing:
        // Show countdown.
        this.textCountdown.data.text = `ROUND ${this.roundIndex + 1}/${ROUNDS.length} ENDS IN ${formatTime(this.deadline - this.time)}`;

        // Handle any players reaching the target, exiting the screen or being shot.
        for (const player of this.players.values()) {
          if (player.data.enabled) {
            if (player.intersectsEntity(this.portalTarget)) {
              this.endRoundForPlayer(player, true);
            }
            if (!player.intersectsBackground(this.background) || this.sentry.intersectsShot(player)) {
              this.endRoundForPlayer(player, false);
            }
          }
        }

        // Check if the round is over.
        if (this.time >= this.deadline || [...this.players.values()].every(player => !player.data.enabled)) {
          this.endRound();
        }
        break;

      case LevelState.ShowingScores:
        // Show countdown.
        this.textCountdown.data.text = `ROUND ${this.roundIndex + 2}/${ROUNDS.length} STARTS IN ${formatTime(this.deadline - this.time)}`;

        // Check if the countdown is over.
        if (this.time >= this.deadline) {
          this.playRound(this.roundIndex + 1);
        }
        break;

      case LevelState.End:
        break;
    }
  }
}

enum LevelState {
  Initial,
  Playing,
  ShowingScores,
  End,
}

interface PlayerStats {
  rounds: ({ finished: true, finishedAfter: number } | { finished: false })[],
}

interface Round {
  deadline: number;
  scorePerRemainingSecond: number;

  startX: number;
  startY: number;

  targetX: number;
  targetY: number;

  targetDX: number;
  targetDY: number;

  sentryX: number;
  sentryY: number;
}

const ROUNDS: Round[] = [
  {
    deadline: 120,
    scorePerRemainingSecond: 1,
    startX: 60, startY: 270,
    targetX: 900, targetY: 270,
    targetDX: 0, targetDY: 0,
    sentryX: 480, sentryY: 510,
  },
  {
    deadline: 80,
    scorePerRemainingSecond: 2,
    startX: 900, startY: 270,
    targetX: 60, targetY: 270,
    targetDX: 1, targetDY: 2,
    sentryX: 480, sentryY: 270,
  },
  {
    deadline: 60,
    scorePerRemainingSecond: 3,
    startX: 60, startY: 60,
    targetX: 900, targetY: 480,
    targetDX: -4, targetDY: -2,
    sentryX: 600, sentryY: 250,
  },
  {
    deadline: 40,
    scorePerRemainingSecond: 4,
    startX: 900, startY: 480,
    targetX: 60, targetY: 60,
    targetDX: 7, targetDY: -6,
    sentryX: 600, sentryY: 250,
  },
  {
    deadline: 30,
    scorePerRemainingSecond: 5,
    startX: 60, startY: 480,
    targetX: 60, targetY: 60,
    targetDX: 57, targetDY: 27,
    sentryX: 600, sentryY: 250,
  },
];
