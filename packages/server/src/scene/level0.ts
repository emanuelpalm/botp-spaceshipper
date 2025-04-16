import { DataBackgroundStars, DataBackgroundType, DataEntity, DataEntityType, DataPlayer, DataPortal, DataText, PaletteId } from "@spaceshipper/common";
import { Scene } from "./scene.ts";
import { intersects } from "../util/math2d.ts";

export class Level0 extends Scene {
  override readonly background: DataBackgroundStars = {
    type: DataBackgroundType.Stars,
    width: 960, height: 540,
    starCount: 200,
    dx: 10 * (Math.random() - 0.5), dy: 10 * (Math.random() - 0.5),
  };

  override get nonPlayerEntities(): DataEntity[] {
    return [
      this.textCountdown,
      this.textScores,
      ...this.textScorePerPlayer,
      this.portalTarget,
    ];
  }

  private textCountdown: DataText = {
    id: "textCountdown",
    type: DataEntityType.Text,
    x: 480, y: 30,
    dx: 0, dy: 0,
    enabled: true,
    opacity: 1,
    paletteId: PaletteId.Delta,
    font: "Oxanium", fontSize: 24, fontWeight: 300,
    text: "00:00",
  };

  private textScores: DataText = {
    id: "textScores",
    type: DataEntityType.Text,
    x: 480, y: 90,
    dx: 0, dy: 0,
    enabled: false,
    opacity: 1,
    paletteId: PaletteId.Iota,
    font: "Smoosh Sans", fontSize: 42, fontWeight: 500,
    text: "SCORES",
  }

  private textScorePerPlayer: DataText[] = [];

  private portalTarget: DataPortal = {
    id: "portal",
    type: DataEntityType.Portal,
    x: 900, y: 270,
    dx: 0, dy: 0,
    paletteId: PaletteId.Target,
    enabled: true,
    opacity: 1,
    name: "TARGET",
    radius: 58,
  };

  private deadline: number = 0;
  private mapPlayerIdToStats: Map<DataPlayer["id"], PlayerStats> = new Map();
  private roundIndex: number = 0;
  private roundIsLive: boolean = false;
  private roundPlayersRemaining: number = 0;
  private time: number = 0;

  constructor() {
    super("level0");
  }

  override start(): void {
    this.mapPlayerIdToStats.clear();
    for (const playerId of this.players.keys()) {
      this.mapPlayerIdToStats.set(playerId, { rounds: [] });
    }

    this.setRound(this.roundIndex);
  }

  private setRound(index: number): void {
    const round = ROUNDS[index];

    this.deadline = round.deadline;
    this.portalTarget.x = round.targetX;
    this.portalTarget.y = round.targetY;
    this.roundIsLive = true;
    this.time = 0;
    this.textScores.enabled = false;
    this.textScorePerPlayer = [];

    this.roundPlayersRemaining = 0;
    for (const player of this.players.values()) {
      this.roundPlayersRemaining += 1;

      player.x = round.startX + (Math.random() - 0.5) * 60;
      player.y = round.startY + (Math.random() - 0.5) * 60;
      player.dx = (Math.random() - 0.5) * 0.001 + 200;
      player.dy = (Math.random() - 0.5) * 0.001;
    }
  }

  override update(dt: number) {
    this.time += dt;

    // Update all entities.
    for (const entity of this.entities) {
      entity.x += entity.dx * dt;
      entity.y += entity.dy * dt;
    }

    // Update the countdown.
    const timeLeft = this.deadline - this.time;
    this.textCountdown.text = this.roundIsLive ? "ROUND ENDS IN " : "NEXT ROUND IN ";
    this.textCountdown.text += `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${Math.floor(timeLeft % 60).toString().padStart(2, "0")}`;

    // If a round is ongoing.
    if (this.roundIsLive) {
      // Handle any players reaching the target.
      for (const player of this.players.values()) {
        if (intersects(player.x, player.y, 10, this.portalTarget.x, this.portalTarget.y, this.portalTarget.radius - 10)) {
          this.roundPlayersRemaining -= 1;
          this.mapPlayerIdToStats.get(player.id)!
            .rounds.push({ finished: true, finishedAfter: this.time });

          player.enabled = false;
        }
      }

      // Check if the round is over.
      if (timeLeft <= 0 || this.roundPlayersRemaining === 0) {
        this.roundIsLive = false;
        this.deadline = 20;
        this.time = 0;
        this.textScores.enabled = true;

        for (const [playerId, player] of this.players) {
          const round = this.mapPlayerIdToStats.get(playerId)!.rounds[this.roundIndex];

          let text;
          if (round.finished) {
            const roundScore = Math.round(round.finishedAfter * ROUNDS[this.roundIndex].scorePerRemainingSecond);
            player.score += roundScore;
            text = `${player.name}: ${player.score} (+${roundScore})`;
          } else {
            text = `${player.name}: ${player.score}`;
          }

          this.textScorePerPlayer.push({
            id: `textScore-${playerId}`,
            type: DataEntityType.Text,
            x: 480, y: 130 + (this.textScorePerPlayer.length * 30),
            dx: 0, dy: 0,
            enabled: true,
            opacity: 1,
            paletteId: PaletteId.Iota,
            font: "Smoosh Sans", fontSize: 24, fontWeight: 500,
            text,
          });
        }
      }
    } else if (timeLeft <= 0) {
      this.roundIndex += 1;
      this.setRound(this.roundIndex);
    }
  }
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
}

const ROUNDS: Round[] = [
  {
    deadline: 120,
    scorePerRemainingSecond: 1,
    startX: 60, startY: 270,
    targetX: 900, targetY: 270,
  },
  {
    deadline: 80,
    scorePerRemainingSecond: 2,
    startX: 900, startY: 270,
    targetX: 60, targetY: 270,
  },
  {
    deadline: 40,
    scorePerRemainingSecond: 4,
    startX: 60, startY: 60,
    targetX: 900, targetY: 480,
  },
  {
    deadline: 20,
    scorePerRemainingSecond: 8,
    startX: 900, startY: 480,
    targetX: 60, targetY: 60,
  },
];
