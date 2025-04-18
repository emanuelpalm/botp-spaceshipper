import { DataBackground, DataEntity } from '@spaceshipper/common';
import { ClientEntity, createOrUpdateClientEntity } from './entity/client-entity';
import { ClientBackground, createClientBackground } from './background/client-background';

export class ClientStage {
  private readonly _background: ClientBackground;

  set background(value: DataBackground) {
    this._background.data = value;
  }

  private readonly mapEntityIdToEntity: Map<DataEntity["id"], ClientEntity> = new Map();

  private dt: number = 1;

  set entities(value: DataEntity[]) {
    for (const entity of value) {
      createOrUpdateClientEntity(entity, this.mapEntityIdToEntity);
    }
  }

  constructor(background: DataBackground) {
    this._background = createClientBackground(background);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this._background.draw(ctx);

    for (const entity of this.mapEntityIdToEntity.values()) {
      if (entity.data.enabled) {
        ctx.save();
        ctx.globalAlpha = entity.data.opacity;
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
    ctx.fillText(`FPS: ${fps.toFixed(2)}`, this._background.data.width - 20, this._background.data.height - 20);
  }

  update(dt: number) {
    this.dt = dt;

    this._background.update(dt);

    for (const entity of this.mapEntityIdToEntity.values()) {
      entity.update(dt);
    }
  }
}