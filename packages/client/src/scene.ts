import Renderer from './renderer';
import { Entity } from './entity/entity';

export class Scene {
    private entities: Entity[];
    private stars: Star[];

    constructor(entities: Entity[]) {
        this.entities = entities;
        this.stars = [];
    }

    private generateStars(renderer: Renderer, count: number): Star[] {
        const stars: Star[] = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * renderer.width,
                y: Math.random() * renderer.height,
                size: Math.random() * 2 + 1
            });
        }
        return stars;
    }

    draw(renderer: Renderer, dt: number): void {
        if (this.stars.length === 0) {
            this.stars = this.generateStars(renderer, 200);
        }
        
        this.drawBackground(renderer);
        this.drawFps(renderer, 1 / dt);

        for (const entity of this.entities) {
            entity.draw(renderer.context);
        }
    }

    private drawBackground(renderer: Renderer): void {
        renderer.clear('#000033');

        for (const star of this.stars) {
            renderer.drawCircle(star.x, star.y, star.size, '#ffffff');
        }
    }

    private drawFps(renderer: Renderer, fps: number): void {
        renderer.drawText(
            `FPS: ${fps.toFixed(2)}`,
            10, 24,
            { color: '#ffffff80', font: '14px Arial' }
        );
    }
}

interface Star {
    x: number;
    y: number;
    size: number;
}