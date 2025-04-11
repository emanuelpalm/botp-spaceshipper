export interface Entity {
    x: number;
    y: number;
    dx: number;
    dy: number;
    color: string;
    draw(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void;
}