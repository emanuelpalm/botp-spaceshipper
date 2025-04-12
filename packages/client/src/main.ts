import { io } from "socket.io-client";
import "./style.css";
import { Scene } from "./scene";
import { ClientEntity, createOrUpdateClientEntity } from "./entity/client-entity";
import { setupCanvas } from "./canvas";
import { DataEntity } from "@spaceshipper/common";

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;

const ctx = setupCanvas("canvas", {
  logicalWidth: LOGICAL_WIDTH,
  logicalHeight: LOGICAL_HEIGHT,
});

const socket = io("http://localhost:3000");
const entities: Map<DataEntity["id"], ClientEntity> = new Map();

socket.on('world-state', (state) => {
  for (const entity of state.entities) {
    createOrUpdateClientEntity(entity, entities);
  }
});

socket.on("connect", () => {
  console.log("Connected to server");
  document.getElementById("connection-status")!.textContent = "Connected to server";
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  document.getElementById("connection-status")!.textContent = "Disconnected from server";
});

const scene = new Scene(entities, LOGICAL_WIDTH, LOGICAL_HEIGHT);

let ts0 = performance.now();
function gameLoop(ts1: number): void {
  const dt = (ts1 - ts0) / 1000;
  ts0 = ts1;

  update(dt);
  scene.draw(ctx, dt);

  requestAnimationFrame(gameLoop);
}

function update(dt: number): void {
  for (const entity of entities.values()) {
    entity.update(dt);
  }
}

requestAnimationFrame(gameLoop);
