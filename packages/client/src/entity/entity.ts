export interface Entity {
    x: number;
    y: number;
    dx: number;
    dy: number;
    primaryColor: string;
    secondaryColor: string;
    tintColor: string;
    draw(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void;
}