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
      const intensity = 0.25 + Math.pow(Math.random() * 0.75, 2);
      stars.push({
        x: Math.random() * this.data.width,
        y: Math.random() * this.data.height,
        size: intensity * 1.5 + 0.5,
        color: generateColor(intensity),
        alpha: intensity * 0.9,
        velocity: 0.2 + Math.random() * 0.8,
      });
    }
    return stars;

    function generateColor(intensity: number): string {
      const base = intensity * 175;
      const r = Math.floor(base + Math.random() * 80).toString(16).padStart(2, "0");
      const g = Math.floor(base + Math.random() * 80).toString(16).padStart(2, "0");
      const b = Math.floor(base + Math.random() * 80).toString(16).padStart(2, "0");
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
      if (Math.random() > 0.05) {
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      } else {
        const s1 = star.size + Math.random() * 0.5;
        const s2 = s1 * 2;
        ctx.fillRect(star.x + Math.random() - s1, star.y + Math.random() - s1, s2, s2);
      }
      ctx.fill();
    }
  }

  update(dt: number): void {
    for (const star of this.stars) {
      star.x += star.velocity * this.data.dx * dt;
      star.y += star.velocity * this.data.dy * dt;

      while (star.x < 0) {
        star.x += this.data.width;
      }
      while (star.x > this.data.width) {
        star.x -= this.data.width;
      }
      while (star.y < 0) {
        star.y += this.data.height;
      }
      while (star.y > this.data.height) {
        star.y -= this.data.height;
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