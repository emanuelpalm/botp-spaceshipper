import { DataBackground, DataEntity } from '@spaceshipper/common';
import { ClientEntity, createOrUpdateClientEntity } from './entity/client-entity';
import { ClientBackground, createClientBackground } from './background/client-background';

export class ClientStage {
  private readonly background: ClientBackground;
  private readonly entities: Map<DataEntity["id"], ClientEntity> = new Map();

  private dt: number = 1;

  set data(value: DataEntity[]) {
    for (const entity of value) {
      createOrUpdateClientEntity(entity, this.entities);
    }
  }

  constructor(background: DataBackground) {
    this.background = createClientBackground(background);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.background.draw(ctx);

    for (const entity of this.entities.values()) {
      if (entity.data.opacity > 0) {
        ctx.save();
        ctx.translate(entity.data.x, entity.data.y);
        entity.draw(ctx);
        ctx.restore();
      }
    }

    this.drawFps(ctx, 1 / this.dt);
  }

  private drawFps(ctx: CanvasRenderingContext2D, fps: number): void {
    ctx.fillStyle = '#ffffff80';
    ctx.font = '12px Oxanium';
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(`FPS: ${fps.toFixed(2)}`, this.background.data.width - 20, this.background.data.height - 20);
  }

  update(dt: number) {
    this.dt = dt;

    this.background.update(dt);

    for (const entity of this.entities.values()) {
      entity.update(dt);
    }
  }
}