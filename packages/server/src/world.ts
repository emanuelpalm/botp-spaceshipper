import { DataStateScene } from '@spaceshipper/common';
import { Scene } from './scene/scene.ts';
import { ServerPlayer } from './entity/server-player.ts';

export class World {
  private readonly worldId: string = `world-${Math.random().toString(36).substring(2, 9)}`;

  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  getState(): DataStateScene {
    return this.scene.getState(this.worldId);
  }

  join(id: string, name: string): void {
    this.scene.join(ServerPlayer.create(id, name));
  }

  leave(id: string): void {
    this.scene.leave(id);
  }

  update(dt: number) {
    this.scene.update(dt);
  }
}
