export interface Entity {
    x: number;
    y: number;
    dx: number;
    dy: number;
    primaryColor: string;
    secondaryColor: string;
    tintColor: string;
    draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, s: number): void;
    update(dt: number, s: number): void;
}