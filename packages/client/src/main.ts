import { io } from "socket.io-client";
import "./css/style.css";
import { Scene } from "./scene";
import { ClientEntity, createOrUpdateClientEntity } from "./entity/client-entity";
import { setupCanvas } from "./canvas";
import { DataEntity, DataState } from "@spaceshipper/common";
import { ClientBackground, createClientBackground } from "./background/client-background";

// Client state.
const entities: Map<DataEntity["id"], ClientEntity> = new Map();
let background: ClientBackground | undefined;
let sceneId: string | undefined;
let scene: Scene | undefined;
let ctx: CanvasRenderingContext2D | undefined;

// Server communication
{
  const socket = io("http://localhost:3000");

  socket.on('world-state', (state: DataState) => {
    if (state.sceneId !== sceneId) {
      sceneId = state.sceneId;

      entities.clear();

      background = createClientBackground(state.background);

      ctx = setupCanvas("canvas", {
        logicalWidth: state.background.width,
        logicalHeight: state.background.height,
      });

      scene = new Scene(background, entities);
    }

    for (const entity of state.entities) {
      createOrUpdateClientEntity(entity, entities);
    }
  });

  socket.on("connect", () => {
    console.log("Connected");
    document.getElementById("connection-status")!.textContent = "";
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    document.getElementById("connection-status")!.textContent = "Disconnected";
  });
}

// Update loop
{
  let ts0 = performance.now();
  function updateLoop() {
    const ts1 = performance.now();
    const dt = (ts1 - ts0) / 1000;
    ts0 = ts1;

    if (background) {
      background.update(dt);
    }

    for (const entity of entities.values()) {
      entity.update(dt);
    }
  }
  setInterval(updateLoop, 1000 / 60);
}

// Render loop
{
  let ts0 = performance.now();
  function renderLoop(ts1: number): void {
    const dt = (ts1 - ts0) / 1000;
    ts0 = ts1;

    if (ctx && scene) {
      scene.draw(ctx, dt);
    }

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);
}
