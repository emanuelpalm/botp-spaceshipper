import { DataState } from "@spaceshipper/common";
import { ClientStage } from "./client-stage";

export class ClientState {
  private readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private _stage: ClientStage | undefined;

  get stage(): ClientStage | undefined {
    return this._stage;
  }

  set stage(value: ClientStage | undefined) {
    this._stage = value;
    this.resize();
  }

  private _data: DataState | undefined;

  get data(): DataState | undefined {
    return this._data;
  }

  set data(data: DataState) {
    let resize = false;
    if (this._stage === undefined || this._data === undefined || this._data.worldId !== data.worldId || this._data.sceneId !== data.sceneId) {
      this._stage = new ClientStage(data.background);
      resize = true;
    }
    this._data = data;
    this._stage.data = data.entities;

    if (resize) {
      this.resize();
    }
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    window.addEventListener("resize", () => this.resize());
  }

  private resize(): void {
    if (!this._data) {
      return;
    }

    const logicalWidth = this._data.background.width;
    const logicalHeight = this._data.background.height;

    const optimalWidth = (logicalWidth / logicalHeight) * window.innerHeight;
    const optimalHeight = (logicalHeight / logicalWidth) * window.innerWidth;

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

    this.ctx.scale(this.canvas.width / logicalWidth, this.canvas.height / logicalHeight);
  }

  draw(): void {
    this._stage?.draw(this.ctx);
  }

  update(dt: number): void {
    this._stage?.update(dt);
  }
}
