import { Entity } from './entity';

export class Spaceship implements Entity {
    public x: number;
    public y: number;
    public dx: number;
    public dy: number;
    public color: string;
    public name: string;

    constructor(x: number, y: number, color: string, name: string) {
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 500;
        this.dy = (Math.random() - 0.5) * 500;
        this.color = color;
        this.name = name;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Calculate rotation angle based on velocity
        const angle = Math.atan2(this.dy, this.dx) - Math.PI/2;
        
        // Calculate intensity (0 to 1) based on velocity
        const intensity = (1 - 1 / (Math.sqrt(this.dx * this.dx + this.dy * this.dy) / 300 + 1));

        // Translate to position
        ctx.translate(this.x, this.y);
        
        // Draw name.
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "12px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(this.name, 0, -36);

        // Rotate
        ctx.rotate(angle);

        // Draw body lower wings
        ctx.beginPath();

        // Draw body lower right wing
        ctx.moveTo(3, -1);
        ctx.lineTo(3, -12);
        ctx.lineTo(5, -13);
        ctx.lineTo(6, -16);
        ctx.lineTo(12, -13);
        ctx.lineTo(3, -1);

        // Draw body lower left wing
        ctx.moveTo(-3, -1);
        ctx.lineTo(-3, -12);
        ctx.lineTo(-5, -13);
        ctx.lineTo(-6, -16);
        ctx.lineTo(-12, -13);
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
        ctx.moveTo(2, -15);
        ctx.lineTo(3, -12);
        ctx.lineTo(3, 10);
        ctx.lineTo(0, 11);
        ctx.lineTo(-3, 10);
        ctx.lineTo(-3, -12);
        ctx.lineTo(-2, -15);
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
        ctx.moveTo(3, 15);
        ctx.lineTo(3, -1);
        ctx.lineTo(13, -14);
        ctx.lineTo(14, -5);
        ctx.lineTo(9, 1);
        ctx.lineTo(6, 13);
        ctx.lineTo(3, 15);

        // Draw body upper left wing
        ctx.moveTo(-3, 15);
        ctx.lineTo(-3, -1);
        ctx.lineTo(-13, -14);
        ctx.lineTo(-14, -5);
        ctx.lineTo(-9, 1);
        ctx.lineTo(-6, 13);
        ctx.closePath();
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add glow.
        ctx.strokeStyle = this.color + "40";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw thruster
        if (intensity > 0.05) {
            const thrusterBaseLength = 30 * intensity;
            const thrusterFlickerLength = Math.max(8 * intensity, 3) * Math.random();
            const thrusterLength = thrusterBaseLength + thrusterFlickerLength;

            ctx.beginPath();
            ctx.moveTo(1, -18);
            ctx.lineTo(2, -19);
            ctx.lineTo(0, -19 - thrusterLength);
            ctx.lineTo(-2, -19);
            ctx.lineTo(-1, -18);
            ctx.closePath();

            ctx.lineWidth = 1 + intensity;
            ctx.strokeStyle = this.getThrusterColor(intensity);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    private getThrusterColor(t: number): string {
        const r = Math.floor((144 - 251) * t + 251);
        const g = Math.floor((250 - 68) * t + 68);
        const b = Math.floor((255 - 156) * t + 156);
        return `rgb(${r},${g},${b})`;
    }

    update(dt: number): void {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }
}
