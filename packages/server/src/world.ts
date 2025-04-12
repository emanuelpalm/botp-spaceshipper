import { Scene } from './scene.ts';

export class World {
  private level: Scene;

  constructor(level: Scene) {
    this.level = level;
  }

  get state() {
    return this.level;
  }

  update(dt: number) {
    for (const entity of this.level.entities) {
      // Update positions
      entity.x += entity.dx * dt;
      entity.y += entity.dy * dt;
    }
  }
}
