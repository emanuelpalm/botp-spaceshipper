import "./style.css"
import io from "socket.io-client";
import { Scene } from "./scene";
import { Entity, Spaceship } from "./entity";
import { setupCanvas } from "./canvas";
import { Portal } from "./entity/portal";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server");
  document.getElementById("connection-status")!.textContent = "Connected to server";
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  document.getElementById("connection-status")!.textContent = "Disconnected from server";
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div id="connection-status">Connecting to server...</div>
    <canvas id="canvas"></canvas>
  </div>
`

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;

const ctx = setupCanvas("canvas", {
  logicalWidth: LOGICAL_WIDTH,
  logicalHeight: LOGICAL_HEIGHT,
});

const entities: Entity[] = [
  new Portal(800, 100, 80, "#06f667", "#06f6b6", "#72f7a8"),
  new Spaceship(100, 100, "#e20de5", "#29c1e3", "#7b6aeb", "Alpha"),
  new Spaceship(200, 200, "#f2d609", "#7ece6f", "#0fc0d2", "Beta"),
  new Spaceship(300, 300, "#bde2f5", "#f599e4", "#d6bbee", "Gamma"),
  new Spaceship(400, 400, "#18f9f1", "#b685ff", "#91b9fe", "Delta"),
  new Spaceship(500, 500, "#fd0983", "#3e1a7a", "#9c0d79", "Epsilon"),
  new Spaceship(400, 600, "#f5d863", "#92149c", "#f13b63", "Iota"),
  new Spaceship(500, 700, "#31ec9f", "#06a5f6", "#19ccc8", "Kappa"),
];

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
  for (const entity of entities) {
    entity.update(dt);
  }
}

requestAnimationFrame(gameLoop);
