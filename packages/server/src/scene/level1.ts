import { DataBackgroundStars, DataBackgroundType, DataEntityType, DataPlayer, PaletteId } from "@spaceshipper/common";
import { Scene } from "./scene.ts";
import { directionTo } from "@spaceshipper/common";
import { formatTime } from "../util/format.ts";
import { ServerEntity } from "../entity/server-entity.ts";
import { ServerBlackHole } from "../entity/server-black-hole.ts";
import { ServerPortal } from "../entity/server-portal.ts";
import { ServerText } from "../entity/server-text.ts";
import { ServerPlayer } from "../entity/server-player.ts";

export class Level1 extends Scene {
  override readonly background: DataBackgroundStars = {
    type: DataBackgroundType.Stars,
    width: 960, height: 540,
    starCount: 300,
    dx: 60 * (Math.random() - 0.5), dy: 60 * (Math.random() - 0.5),
  };

  override get isPlaying(): boolean {
    return this.state === LevelState.Playing;
  }

  override get nonPlayerEntities(): ServerEntity[] {
    return [
      ...this.blackHoles,
      ...this.textPlayerScores.values(),
      this.portalTarget,
      this.textCountdown,
      this.textCenter,
      this.textScores,
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
    text: "Avoid the black holes!",
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

  private blackHoles: ServerBlackHole[] = [{ radius: 58 }, { radius: 78 }, { radius: 58 }, { radius: 98 }]
    .map((blackHole, index) => new ServerBlackHole({
      id: `blackHole-${index + 1}`,
      type: DataEntityType.BlackHole,
      x: 480, y: 400,
      dx: 0, dy: 0,
      paletteId: PaletteId.Epsilon,
      enabled: false, opacity: 1,
      radius: blackHole.radius,
    }));

  private deadline: number = 0;
  private mapPlayerIdToStats: Map<DataPlayer["id"], PlayerStats> = new Map();
  private roundIndex: number = 0;
  private state: LevelState = LevelState.Initial;
  private roundPlayersRemaining: number = 0;
  private time: number = 0;

  constructor() {
    super("level1");
  }

  override start(): void {
    this.textCenter.data.enabled = true;
    this.textScores.data.enabled = false;

    this.blackHoles[0].data.x = 480;
    this.blackHoles[0].data.y = 400;
    this.blackHoles[0].data.dx = 0;
    this.blackHoles[0].data.dy = 0;
    this.blackHoles[0].data.enabled = true;

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
    this.roundPlayersRemaining = 0;
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

    for (const blackHole of this.blackHoles) {
      blackHole.data.enabled = false;
    }

    round.blackHoles.forEach((data, index) => {
      const blackHole = this.blackHoles[index];
      blackHole.data.x = data.x;
      blackHole.data.y = data.y;
      blackHole.data.dx = data.dx;
      blackHole.data.dy = data.dy;
      blackHole.data.enabled = true;
    });

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
    this.roundPlayersRemaining = this.players.size;
    this.time = 0;
  }

  private endRound(): void {
    this.textCountdown.data.text = "";
    this.textScores.data.enabled = true;
    this.portalTarget.data.enabled = false;

    for (const blackHole of this.blackHoles) {
      blackHole.data.enabled = false;
    }

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
    this.roundPlayersRemaining -= 1;

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

        // Handle any players reaching the target, falling into a black hole or exiting the screen.
        for (const player of this.players.values()) {
          if (player.data.enabled) {
            if (player.intersectsEntity(this.portalTarget) || !player.intersectsBackground(this.background)) {
              this.endRoundForPlayer(player, true);
            }
            for (const blackHole of this.blackHoles) {
              if (player.intersectsEntity(blackHole)) {
                this.endRoundForPlayer(player, false);
              }
            }
          }
        }

        // Check if the round is over.
        if (this.time >= this.deadline || this.roundPlayersRemaining === 0) {
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

  blackHoles: { x: number, y: number, dx: number, dy: number }[];
}

const ROUNDS: Round[] = [
  {
    deadline: 120,
    scorePerRemainingSecond: 1,
    startX: 60, startY: 270,
    targetX: 900, targetY: 270,
    targetDX: 0, targetDY: 0,
    blackHoles: [
      { x: 480, y: 270, dx: 0, dy: 0 },
    ],
  },
  {
    deadline: 80,
    scorePerRemainingSecond: 2,
    startX: 900, startY: 270,
    targetX: 60, targetY: 270,
    targetDX: 1, targetDY: 2,
    blackHoles: [
      { x: 410, y: 235, dx: 0, dy: 0 },
      { x: 620, y: 375, dx: 0, dy: 0 },
    ],
  },
  {
    deadline: 60,
    scorePerRemainingSecond: 3,
    startX: 60, startY: 60,
    targetX: 900, targetY: 480,
    targetDX: -4, targetDY: -2,
    blackHoles: [
      { x: 120, y: 270, dx: 0, dy: 0 },
      { x: 480, y: 270, dx: 4, dy: 22 },
      { x: 620, y: 270, dx: 0, dy: 0 },
    ],
  },
  {
    deadline: 40,
    scorePerRemainingSecond: 4,
    startX: 900, startY: 480,
    targetX: 60, targetY: 60,
    targetDX: 7, targetDY: -6,
    blackHoles: [
      { x: 120, y: 270, dx: 7, dy: -2 },
      { x: 410, y: 235, dx: 13, dy: -14 },
      { x: 620, y: 375, dx: 6, dy: 12 },
    ],
  },
  {
    deadline: 30,
    scorePerRemainingSecond: 5,
    startX: 60, startY: 480,
    targetX: 900, targetY: 60,
    targetDX: 10, targetDY: 10,
    blackHoles: [
      { x: 120, y: 270, dx: 2, dy: 16 },
      { x: 410, y: 235, dx: 4, dy: -8 },
      { x: 620, y: 375, dx: -8, dy: 4 },
      { x: 480, y: 400, dx: -16, dy: -2 },
    ],
  },
];

