import { Entity } from "./entity";

export class Spaceship implements Entity {
    public x: number;
    public y: number;
    public dx: number;
    public dy: number;
    public primaryColor: string;
    public secondaryColor: string;
    public tintColor: string;
    public name: string;

    constructor(
        x: number,
        y: number,
        primaryColor: string,
        secondaryColor: string,
        tintColor: string,
        name: string,
    ) {
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 500;
        this.dy = (Math.random() - 0.5) * 500;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.tintColor = tintColor;
        this.name = name;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // Calculate rotation angle based on velocity
        const angle = Math.atan2(this.dy, this.dx) - Math.PI / 2;

        // Calculate intensity (0 to 1) based on velocity
        const intensity = (1 - 1 / (Math.sqrt(this.dx * this.dx + this.dy * this.dy) / 300 + 1));

        // Draw name.
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `12px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(this.name, 0, -36);

        // Rotate
        ctx.rotate(angle);

        // Draw body lower left wing
        ctx.beginPath();
        ctx.moveTo(3, -1);
        ctx.lineTo(3, -12);
        ctx.lineTo(5, -13);
        ctx.lineTo(6, -16);
        ctx.lineTo(12, -13);
        ctx.closePath();
        this.stroke(ctx, 3, this.tintColor, 1, this.secondaryColor);

        // Draw body lower right wing
        ctx.beginPath();
        ctx.moveTo(-3, -1);
        ctx.lineTo(-3, -12);
        ctx.lineTo(-5, -13);
        ctx.lineTo(-6, -16);
        ctx.lineTo(-12, -13);
        ctx.closePath();
        this.stroke(ctx, 3, this.tintColor, 1, this.secondaryColor);

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
        this.stroke(ctx, 3.5, this.tintColor, 1.5, this.secondaryColor);

        // Draw body upper left wing
        ctx.beginPath();
        ctx.moveTo(3, 15);
        ctx.lineTo(3, -1);
        ctx.lineTo(13, -14);
        ctx.lineTo(14, -5);
        ctx.lineTo(9, 1);
        ctx.lineTo(6, 13);
        ctx.closePath();
        this.stroke(ctx, 4, this.tintColor, 2, this.primaryColor);

        // Draw body upper right wing
        ctx.beginPath();
        ctx.moveTo(-3, 15);
        ctx.lineTo(-3, -1);
        ctx.lineTo(-13, -14);
        ctx.lineTo(-14, -5);
        ctx.lineTo(-9, 1);
        ctx.lineTo(-6, 13);
        ctx.closePath();
        this.stroke(ctx, 4, this.tintColor, 2, this.primaryColor);

        // Draw thruster
        if (intensity > 0.05) {
            ctx.beginPath();
            ctx.moveTo(1, -18);
            ctx.lineTo(2, -19);
            ctx.lineTo(0, -19 - this.getThrusterLength(intensity));
            ctx.lineTo(-2, -19);
            ctx.lineTo(-1, -18);
            ctx.closePath();

            ctx.lineWidth = 1 + intensity;
            ctx.strokeStyle = this.getThrusterColor(intensity);
            ctx.stroke();
        }

        ctx.restore();
    }

    private stroke(ctx: CanvasRenderingContext2D, w0: number, c0: string, w1: number, c1: string) {
        ctx.strokeStyle = c0 + Math.floor(0x60 + 0x10 * Math.random()).toString(16);
        ctx.lineWidth = (w0 + Math.random() / 2)
        ctx.stroke();

        ctx.strokeStyle = c1 + Math.floor(0xB0 + 0x20 * Math.random()).toString(16);
        ctx.lineWidth = w1;
        ctx.stroke();

        ctx.strokeStyle = "#ffffff" + Math.floor(0x20 + 0x10 * Math.random()).toString(16);
        ctx.lineWidth = (0.5 + Math.random());
        ctx.stroke();
    }

    private getThrusterLength(intensity: number): number {
        const base = 30 * intensity;
        const flicker = Math.max(8 * intensity, 3) * Math.random();
        return base + flicker;
    }

    private getThrusterColor(intensity: number): string {
        const r = Math.floor((144 - 251) * intensity + 251);
        const g = Math.floor((250 - 68) * intensity + 68);
        const b = Math.floor((255 - 156) * intensity + 156);
        return `rgb(${r},${g},${b})`;
    }

    update(dt: number): void {
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }
}
