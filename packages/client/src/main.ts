import { io } from "socket.io-client";
import "./css/style.css";
import { Scene } from "./scene";
import { ClientEntity, createOrUpdateClientEntity } from "./entity/client-entity";
import { setupCanvas } from "./canvas";
import { DataEntity, DataState } from "@spaceshipper/common";

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;

const ctx = setupCanvas("canvas", {
  logicalWidth: LOGICAL_WIDTH,
  logicalHeight: LOGICAL_HEIGHT,
});

const socket = io("http://localhost:3000");
const entities: Map<DataEntity["id"], ClientEntity> = new Map();

socket.on('world-state', (state: DataState) => {
  for (const entity of state.entities) {
    createOrUpdateClientEntity(entity, entities);
  }
});

socket.on("connect", () => {
  console.log("Connected");
  document.getElementById("connection-status")!.textContent = "Connected";
});

socket.on("disconnect", () => {
  console.log("Disconnected");
  document.getElementById("connection-status")!.textContent = "Disconnected";
});

const scene = new Scene(entities, LOGICAL_WIDTH, LOGICAL_HEIGHT);

let ts0 = performance.now();
function gameLoop(ts1: number): void {
  const dt = (ts1 - ts0) / 1000;
  ts0 = ts1;

  for (const entity of entities.values()) {
    entity.update(dt);
  }
  scene.draw(ctx, dt);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
