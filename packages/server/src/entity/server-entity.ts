import { DataBackground,  DataEntity } from "@spaceshipper/common";
import { intersects } from "@spaceshipper/common";

export abstract class ServerEntity {
  abstract data: DataEntity;
  abstract collisionRadius: number;

  abstract update(dt: number): void;

  intersectsEntity(other: ServerEntity): boolean {
    return this.data.enabled && other.data.enabled && intersects(
      this.data.x, this.data.y, this.collisionRadius,
      other.data.x, other.data.y, other.collisionRadius);
  }

  intersectsBackground(background: DataBackground, slack: number = 10) {
    return this.data.enabled && (this.data.x >= -slack && this.data.x <= background.width + slack && this.data.y >= -slack && this.data.y <= background.height + slack);
  }
}
