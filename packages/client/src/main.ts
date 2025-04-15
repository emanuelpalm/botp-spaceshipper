import { io } from "socket.io-client";
import "./css/style.css";
import { DataState } from "@spaceshipper/common";
import { ClientState } from "./client-state";

// Get canvas used to render game.
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("#canvas not found.");
}

// Create client state handler.
const state = new ClientState(canvas);

// Setup server communication.
{
  const socket = io("http://localhost:3000");

  socket.on('state', (data: DataState) => state.data = data);

  socket.on("connect", () => {
    console.debug("Connected");
    document.getElementById("connection-status")!.textContent = "";
  });

  socket.on("disconnect", () => {
    console.debug("Disconnected");
    document.getElementById("connection-status")!.textContent = "Disconnected";
  });
}

// Start game loop.
let ts0 = performance.now();
function renderLoop(ts1: number): void {
  const dt = (ts1 - ts0) / 1000;
  ts0 = ts1;

  state.update(dt);
  state.draw();

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);
