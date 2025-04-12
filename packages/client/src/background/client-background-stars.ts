import { DataBackgroundStars } from "@spaceshipper/common";
import { ClientBackground } from "./client-background";

export class ClientBackgroundStars implements ClientBackground {
  public data: DataBackgroundStars;

  private stars: Star[];

  constructor(data: DataBackgroundStars) {
    this.data = data;
    this.stars = this.generateStars(data.starCount);
  }

  private generateStars(count: number): Star[] {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.data.width,
        y: Math.random() * this.data.height,
        size: Math.random() * 2 + 1,
        color: generateColor(),
        alpha: Math.random() * 0.9,
        velocity: Math.random(),
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

  draw(ctx: CanvasRenderingContext2D): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.data.height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#000033');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.data.width, this.data.height);

    for (const star of this.stars) {
      const alpha = Math.floor((star.alpha + Math.random() * 0.1) * 255).toString(16).padStart(2, "0");
      ctx.fillStyle = `${star.color}${alpha}`;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  update(dt: number): void {
    for (const star of this.stars) {
      star.x += star.velocity * this.data.dz * dt;
      star.y += star.velocity * this.data.dy * dt;

      if (star.x < 0) {
        star.x = this.data.width;
      } else if (star.x > this.data.width) {
        star.x = 0;
      }
      if (star.y < 0) {
        star.y = this.data.height;
      } else if (star.y > this.data.height) {
        star.y = 0;
      }
    }
  }
}

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  velocity: number;
}