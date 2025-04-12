import { Entity } from "./entity";

export class Portal implements Entity {
    public x: number;
    public y: number;
    public dx: number = 0;
    public dy: number = 0;
    public radius: number;
    public primaryColor: string;
    public secondaryColor: string;
    public tintColor: string;
    public name: string;

    private clock: number = 0;
    private outerDashLength: number;
    private innerDashLength: number;

    constructor(x: number, y: number, radius: number, primaryColor: string, secondaryColor: string, tintColor: string, name: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.tintColor = tintColor;
        this.name = name;

        this.outerDashLength = (Math.PI * this.radius * 2) / 80;
        this.innerDashLength = (Math.PI * this.radius * 2) / 120;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Draw name.
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `12px Arial`;
        ctx.fillStyle = this.primaryColor;
        ctx.fillText(this.name, 0, -26);

        // Draw cross in the middle
        ctx.strokeStyle = this.secondaryColor;
        ctx.lineWidth = 2;
        
        const crossSize = Math.min(this.radius, 10); // Cross size is 20% of radius
        ctx.beginPath();
        // Horizontal line
        ctx.moveTo(-crossSize, 0);
        ctx.lineTo(crossSize, 0);
        // Vertical line
        ctx.moveTo(0, -crossSize);
        ctx.lineTo(0, crossSize);
        ctx.stroke();

        // Draw outer dashed circle
        ctx.rotate(this.clock / 2 + Math.random() * 0.01);
        ctx.fillStyle = `${this.tintColor}${Math.floor(18 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
        ctx.strokeStyle = `${this.primaryColor}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 2;
        ctx.setLineDash([this.outerDashLength, this.outerDashLength]); // Create dashed line pattern

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

        ctx.fill();
        ctx.stroke();

        // Draw inner dashed circle 

        ctx.rotate(-this.clock / 4 + Math.random() * 0.01);
        ctx.fillStyle = `${this.tintColor}${Math.floor(24 + 2 * Math.random()).toString(16).padStart(2, "0")}`;
        ctx.strokeStyle = `${this.secondaryColor}${Math.floor(160 + 30 * Math.random()).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1;
        ctx.setLineDash([this.innerDashLength, this.innerDashLength]); // Create dashed line pattern

        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.9, 0, Math.PI * 2);

        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    update(dt: number): void {
        // Regions are static by default
        this.x += this.dx * dt;
        this.y += this.dy * dt;
        this.clock += dt;
    }
}