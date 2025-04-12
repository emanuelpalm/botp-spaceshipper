import express, { Express } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { World } from "./world.ts";
import { intro } from "./scenes/intro.ts";

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

const world = new World(intro);
const UPDATE_RATE = 20; // Updates per second
const UPDATE_INTERVAL = 1000 / UPDATE_RATE;
let lastUpdate = performance.now();

// Game loop
setInterval(() => {
  const now = performance.now();
  const dt = (now - lastUpdate) / 1000;
  lastUpdate = now;

  world.update(dt);
  io.emit("world-state", world.getState());
}, UPDATE_INTERVAL);

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  // Send initial state to new client
  socket.emit("world-state", world.getState());

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
