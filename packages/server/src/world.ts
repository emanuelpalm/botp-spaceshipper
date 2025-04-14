import { DataStateScene } from '@spaceshipper/common';
import { Scene } from './scene/scene.ts';

export class World {
  private readonly worldId: string = `world-${Math.random().toString(36).substring(2, 9)}`;

  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  getState(): DataStateScene {
    return this.scene.getState(this.worldId);
  }

  execute(action: string) {
    console.log(action);
  }

  join(playerId: string, name: string): void {
    this.scene.join(playerId, name);
  }

  leave(playerId: string): void {
    this.scene.leave(playerId);
  }

  update(dt: number) {
    this.scene.update(dt);
  }
}
