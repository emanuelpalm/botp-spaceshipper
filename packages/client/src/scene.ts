import { DataEntity } from '@spaceshipper/common';
import { ClientEntity } from './entity/entity';

export class Scene {
  private width: number;
  private height: number;

  private entities: Map<DataEntity["id"], ClientEntity>;
  private stars: Star[];

  constructor(entities: Map<DataEntity["id"], ClientEntity>, width: number, height: number) {
    this.width = width;
    this.height = height;

    this.entities = entities;
    this.stars = this.generateStars(200);
  }

  private generateStars(count: number): Star[] {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 1,
        color: generateColor(),
        alpha: Math.random() * 0.9,
      });
    }
    return stars;

    function generateColor(): string {
      const r = Math.floor(175 + Math.random() * 80).toString(16).padStart(2, "0");
      const g = Math.floor(175 + Math.random() * 80).toString(16).padStart(2, "0");
      const b = Math.floor(175 + Math.random() * 80).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
  }

  draw(ctx: CanvasRenderingContext2D, dt: number): void {
    this.drawBackground(ctx);
    this.drawFps(ctx, 1 / dt);

    for (const entity of this.entities.values()) {
      ctx.save();
      ctx.translate(entity.data.x, entity.data.y);
      entity.draw(ctx);
      ctx.restore();
    }
  }

  private drawBackground(ctx: CanvasRenderingContext2D): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#000033');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    for (const star of this.stars) {
      const alpha = Math.floor((star.alpha + Math.random() * 0.1) * 255).toString(16).padStart(2, "0");
      ctx.fillStyle = `${star.color}${alpha}`;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawFps(ctx: CanvasRenderingContext2D, fps: number): void {
    ctx.fillStyle = '#ffffff80';
    ctx.font = '12px Arial';
    ctx.fillText(`FPS: ${fps.toFixed(2)}`, 10, 24);
  }
}

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
}