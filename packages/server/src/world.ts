import { DataState } from '@spaceshipper/common';
import { Scene } from './scene.ts';

export class World {
  private level: Scene;

  constructor(level: Scene) {
    this.level = level;
  }

  getState(): DataState {
    return this.level.getState();
  }

  update(dt: number) {
    for (const entity of this.level.entities) {
      entity.update(dt);
    }
  }
}
