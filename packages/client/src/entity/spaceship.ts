import { Entity } from './entity';

export class Spaceship implements Entity {
    public x: number;
    public y: number;
    public dx: number;
    public dy: number;
    public color: string;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 500;
        this.dy = (Math.random() - 0.5) * 500;
        this.color = color;
    }

    private getThrusterColor(t: number): string {
        // Interpolate between red (#FF4400) and cyan (#00FFFF)
        const r = Math.floor((144 - 251) * t + 251);
        const g = Math.floor((250 - 68) * t + 68);
        const b = Math.floor((255 - 156) * t + 156);
        return `rgb(${r},${g},${b})`;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Calculate rotation angle based on velocity
        const angle = Math.atan2(this.dy, this.dx) - Math.PI/2;
        
        // Translate to position and rotate
        ctx.translate(this.x, this.y);
        ctx.scale(1.25, 1.25);
        ctx.rotate(angle);
        
        // Draw body lower wings
        ctx.beginPath();

        // Draw body lower right wing
        ctx.moveTo(3, 14);
        ctx.lineTo(3, 3);
        ctx.lineTo(5, 2);
        ctx.lineTo(6, -1);
        ctx.lineTo(12, 2);
        ctx.lineTo(3, 14);

        // Draw body lower left wing
        ctx.moveTo(-3, 14);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-5, 2);
        ctx.lineTo(-6, -1);
        ctx.lineTo(-12, 2);
        ctx.closePath();
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add glow.
        ctx.strokeStyle = this.color + "40";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw body center
        ctx.beginPath();
        ctx.moveTo(2, 0);
        ctx.lineTo(3, 3);
        ctx.lineTo(3, 25);
        ctx.lineTo(0, 26);
        ctx.lineTo(-3, 25);
        ctx.lineTo(-3, 3);
        ctx.lineTo(-2, 0);
        ctx.closePath();
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Add glow.
        ctx.strokeStyle = this.color + "40";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw body upper wings
        ctx.beginPath();

        // Draw body upper right wing
        ctx.moveTo(3, 30);
        ctx.lineTo(3, 14);
        ctx.lineTo(13, 1);
        ctx.lineTo(14, 10);
        ctx.lineTo(9, 16);
        ctx.lineTo(6, 28);
        ctx.lineTo(3, 30);

        // Draw body upper left wing
        ctx.moveTo(-3, 30);
        ctx.lineTo(-3, 14);
        ctx.lineTo(-13, 1);
        ctx.lineTo(-14, 10);
        ctx.lineTo(-9, 16);
        ctx.lineTo(-6, 28);
        ctx.closePath();
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add glow.
        ctx.strokeStyle = this.color + "40";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw thruster
        const velocity = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        const relativeVelocity = (1 - 1 / (velocity / 300 + 1));
        const thrusterBaseLength = 30 * relativeVelocity;
        const thrusterFlickerLength = Math.max(8 * relativeVelocity, 3) * Math.random();
        const thrusterLength = thrusterBaseLength + thrusterFlickerLength;

        ctx.beginPath();
        ctx.moveTo(1, -3);
        ctx.lineTo(2, -4);
        ctx.lineTo(0, -4 - thrusterLength);
        ctx.lineTo(-2, -4);
        ctx.lineTo(-1, -3);
        ctx.closePath();

        ctx.lineWidth = 1 + relativeVelocity;
        ctx.strokeStyle = this.getThrusterColor(relativeVelocity);
        ctx.stroke();
        
        ctx.restore();
    }

    update(dt: number): void {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }
}
