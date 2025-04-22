import { ServerEntity } from "./server-entity.ts";
import { DataEntityType, DataSentry } from "@spaceshipper/common";
import { ServerSentryShot } from "./server-sentry-shot.ts";
import { directionTo } from "@spaceshipper/common";

export class ServerSentry extends ServerEntity {
  static readonly SHOT_VELOCITY = 200;

  data: DataSentry;

  shots: ServerSentryShot[] = [];
  shotIndex: number = 0;

  cooldown: number = 1.5;
  cooldownRemaining: number = this.cooldown;

  currentTarget: ServerEntity | undefined;
  potentialTargets: ServerEntity[] = [];

  get collisionRadius(): number {
    return 20;
  }

  constructor(data: DataSentry, shots: number = 8) {
    super();

    this.data = data;

    this.shots = Array.from({ length: shots }, (_, i) => new ServerSentryShot({
      id: `${data.id}-shot-${i}`,
      type: DataEntityType.SentryShot,
      x: 0, y: 0,
      dx: 0, dy: 0,
      enabled: false,
      opacity: 1,
      paletteId: data.paletteId,
    }));
  }

  intersectsShot(entity: ServerEntity): boolean {
    return this.shots.some(shot => shot.data.enabled && shot.intersectsEntity(entity));
  }

  reset(): void {
    this.data.dx = 0;
    this.data.dy = 0;
    this.data.angle = 0;
    this.data.enabled = false;

    for (const shot of this.shots) {
      shot.data.enabled = false;
    }

    this.cooldownRemaining = this.cooldown;

    this.currentTarget = undefined;
  }

  update(dt: number): void {
    if (this.data.enabled) {
      this.data.x += this.data.dx * dt;
      this.data.y += this.data.dy * dt;

      for (const shot of this.shots) {
        shot.update(dt);
      }

      // Fire shot, if cooldown is over.
      if (this.currentTarget) {
        this.cooldownRemaining -= dt;
        if (this.cooldownRemaining <= 0) {
          this.cooldownRemaining = this.cooldown;

          // Allocate and fire shot.
          const shot = this.shots[this.shotIndex];
          this.shotIndex = (this.shotIndex + 1) % this.shots.length;

          shot.data.x = this.data.x + 70 * Math.cos(this.data.angle);
          shot.data.y = this.data.y + 70 * Math.sin(this.data.angle);
          shot.data.dx = ServerSentry.SHOT_VELOCITY * Math.cos(this.data.angle);
          shot.data.dy = ServerSentry.SHOT_VELOCITY * Math.sin(this.data.angle);
          shot.data.enabled = true;

          this.currentTarget = undefined;
        }
      }

      // Find a new target.
      if (!this.currentTarget && this.potentialTargets.length > 0) {
        let start = Math.floor(Math.random() * this.potentialTargets.length);
        for (let i = 0; i < this.potentialTargets.length; i++, start++) {
          const potentialTarget = this.potentialTargets[i];
          if (potentialTarget.data.enabled) {
            this.currentTarget = potentialTarget;
            break;
          }
        }
      }

      // Aim sentry at target.
      if (this.currentTarget) {
        const [dx, dy] = directionTo(this.data.x, this.data.y, this.currentTarget.data.x, this.currentTarget.data.y);
        this.data.angle = Math.atan2(dy, dx);
      }
    }
  }
}
