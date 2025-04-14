import { DataState } from '@spaceshipper/common';
import { Scene } from './scene.ts';

export class World {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  getState(): DataState {
    return this.scene.getState();
  }

  update(dt: number) {
    this.scene.update(dt);
  }
}
