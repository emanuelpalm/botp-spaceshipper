export interface CanvasOptions {
    logicalWidth: number;
    logicalHeight: number;
}

export function setupCanvas(canvasId: string, options: CanvasOptions): CanvasRenderingContext2D {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        throw new Error(`Canvas with id '${canvasId}' not found`);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Failed to get 2D context');
    }

    const resizeCallback = () => resize(canvas, ctx, options);
    window.addEventListener("resize", resizeCallback);
    resizeCallback();

    return ctx;
}

function resize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, options: CanvasOptions) {
    const optimalWidth = (options.logicalWidth / options.logicalHeight) * window.innerHeight;
    const optimalHeight = (options.logicalHeight / options.logicalWidth) * window.innerWidth;

    if (window.innerWidth < optimalWidth) {
        canvas.width = window.innerWidth;
        canvas.height = optimalHeight
    } else if (window.innerHeight < optimalHeight) {
        canvas.width = optimalWidth;
        canvas.height = window.innerHeight
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    ctx.scale(canvas.width / options.logicalWidth, canvas.height / options.logicalHeight);
}
