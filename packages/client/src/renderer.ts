interface TextOptions {
    color?: string;
    font?: string;
}

class Renderer {
    public static ASPECT_RATIO: number = 16 / 9;
    public static LOGICAL_WIDTH = 960;
    public static LOGICAL_HEIGHT = 540;

    public sx: number = 1;
    public sy: number = 1;
    public s: number = 1;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas with id '${canvasId}' not found`);
        }
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context');
        }
        this.ctx = ctx;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize(): void {
        const optimalWidth = Renderer.ASPECT_RATIO * window.innerHeight;
        const optimalHeight = 1 / Renderer.ASPECT_RATIO * window.innerWidth;

        if (window.innerWidth < optimalWidth) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = optimalHeight
        } else if (window.innerHeight < optimalHeight) {
            this.canvas.width = optimalWidth;
            this.canvas.height = window.innerHeight
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        this.sx = this.canvas.width / Renderer.LOGICAL_WIDTH;
        this.sy = this.canvas.height / Renderer.LOGICAL_HEIGHT;
        this.s = Math.min(this.sx, this.sy);
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCircle(x: number, y: number, radius: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawText(text: string, x: number, y: number, options: TextOptions = {}): void {
        this.ctx.fillStyle = options.color || '#ffffff';
        this.ctx.font = options.font || '14px Arial';
        this.ctx.fillText(text, x, y);
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    get context(): CanvasRenderingContext2D {
        return this.ctx;
    }
}

export default Renderer;
