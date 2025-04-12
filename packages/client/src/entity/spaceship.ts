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

    draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, s: number): void {
        ctx.save();

        // Calculate rotation angle based on velocity
        const angle = Math.atan2(this.dy, this.dx) - Math.PI / 2;

        // Calculate intensity (0 to 1) based on velocity
        const intensity = (1 - 1 / (Math.sqrt(this.dx * this.dx + this.dy * this.dy) / 300 + 1));

        // Translate to position
        ctx.translate(this.x, this.y);

        // Draw name.
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${12 * s}px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(this.name, 0, -36 * sy);

        // Rotate
        ctx.rotate(angle);

        // Draw body lower left wing
        ctx.beginPath();
        ctx.moveTo(3 * sx, -1 * sy);
        ctx.lineTo(3 * sx, -12 * sy);
        ctx.lineTo(5 * sx, -13 * sy);
        ctx.lineTo(6 * sx, -16 * sy);
        ctx.lineTo(12 * sx, -13 * sy);
        ctx.closePath();
        this.stroke(ctx, 3, this.tintColor, 1, this.secondaryColor, s);

        // Draw body lower right wing
        ctx.beginPath();
        ctx.moveTo(-3 * sx, -1 * sy);
        ctx.lineTo(-3 * sx, -12 * sy);
        ctx.lineTo(-5 * sx, -13 * sy);
        ctx.lineTo(-6 * sx, -16 * sy);
        ctx.lineTo(-12 * sx, -13 * sy);
        ctx.closePath();
        this.stroke(ctx, 3, this.tintColor, 1, this.secondaryColor, s);

        // Draw body center
        ctx.beginPath();
        ctx.moveTo(2 * sx, -15 * sy);
        ctx.lineTo(3 * sx, -12 * sy);
        ctx.lineTo(3 * sx, 10 * sy);
        ctx.lineTo(0 * sx, 11 * sy);
        ctx.lineTo(-3 * sx, 10 * sy);
        ctx.lineTo(-3 * sx, -12 * sy);
        ctx.lineTo(-2 * sx, -15 * sy);
        ctx.closePath();
        this.stroke(ctx, 3.5, this.tintColor, 1.5, this.secondaryColor, s);

        // Draw body upper left wing
        ctx.beginPath();
        ctx.moveTo(3 * sx, 15 * sy);
        ctx.lineTo(3 * sx, -1 * sy);
        ctx.lineTo(13 * sx, -14 * sy);
        ctx.lineTo(14 * sx, -5 * sy);
        ctx.lineTo(9 * sx, 1 * sy);
        ctx.lineTo(6 * sx, 13 * sy);
        ctx.closePath();
        this.stroke(ctx, 4, this.tintColor, 2, this.primaryColor, s);

        // Draw body upper right wing
        ctx.beginPath();
        ctx.moveTo(-3 * sx, 15 * sy);
        ctx.lineTo(-3 * sx, -1 * sy);
        ctx.lineTo(-13 * sx, -14 * sy);
        ctx.lineTo(-14 * sx, -5 * sy);
        ctx.lineTo(-9 * sx, 1 * sy);
        ctx.lineTo(-6 * sx, 13 * sy);
        ctx.closePath();
        this.stroke(ctx, 4, this.tintColor, 2, this.primaryColor, s);

        // Draw thruster
        if (intensity > 0.05) {
            ctx.beginPath();
            ctx.moveTo(1 * sx, -18 * sy);
            ctx.lineTo(2 * sx, -19 * sy);
            ctx.lineTo(0 * sx, -19 * sy - this.getThrusterLength(intensity));
            ctx.lineTo(-2 * sx, -19 * sy);
            ctx.lineTo(-1 * sx, -18 * sy);
            ctx.closePath();

            ctx.lineWidth = 1 + intensity;
            ctx.strokeStyle = this.getThrusterColor(intensity);
            ctx.stroke();
        }

        ctx.restore();
    }

    private stroke(ctx: CanvasRenderingContext2D, w0: number, c0: string, w1: number, c1: string, s: number) {
        ctx.strokeStyle = c0 + Math.floor(0x60 + 0x10 * Math.random()).toString(16);
        ctx.lineWidth = (w0 + Math.random() / 2) * s;
        ctx.stroke();

        ctx.strokeStyle = c1 + Math.floor(0xB0 + 0x20 * Math.random()).toString(16);
        ctx.lineWidth = w1 * s;
        ctx.stroke();

        ctx.strokeStyle = "#ffffff" + Math.floor(0x20 + 0x10 * Math.random()).toString(16);
        ctx.lineWidth = (0.5 + Math.random()) * s;
        ctx.stroke();
    }

    private getThrusterLength(i: number): number {
        const thrusterBaseLength = 30 * i;
        const thrusterFlickerLength = Math.max(8 * i, 3) * Math.random();
        return thrusterBaseLength + thrusterFlickerLength;
    }

    private getThrusterColor(t: number): string {
        const r = Math.floor((144 - 251) * t + 251);
        const g = Math.floor((250 - 68) * t + 68);
        const b = Math.floor((255 - 156) * t + 156);
        return `rgb(${r},${g},${b})`;
    }

    update(dt: number, s: number): void {
        this.x += this.dx * dt * s;
        this.y += this.dy * dt * s;
    }
}
