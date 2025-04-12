import { DataEntity } from '@spaceshipper/common';
import { ClientEntity } from './entity/client-entity';
import { ClientBackground } from './background/client-background';

export class Scene {
  private background: ClientBackground;
  private entities: Map<DataEntity["id"], ClientEntity>;

  constructor(background: ClientBackground, entities: Map<DataEntity["id"], ClientEntity>) {
    this.background = background;
    this.entities = entities;
  }

  draw(ctx: CanvasRenderingContext2D, dt: number): void {
    this.background.draw(ctx);

    for (const entity of this.entities.values()) {
      ctx.save();
      ctx.translate(entity.data.x, entity.data.y);
      entity.draw(ctx);
      ctx.restore();
    }

    this.drawFps(ctx, 1 / dt);
  }

  private drawFps(ctx: CanvasRenderingContext2D, fps: number): void {
    ctx.fillStyle = '#ffffff80';
    ctx.font = '12px Oxanium';
    ctx.fillText(`FPS: ${fps.toFixed(2)}`, 10, 24);
  }
}