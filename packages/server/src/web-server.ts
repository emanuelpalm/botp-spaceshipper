import { DataStateScene } from "@spaceshipper/common";
import express, { Express } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as IoServer, Socket } from "socket.io";

export class WebServer {
  private app: Express;
  private io: IoServer;
  private port: number;
  private server: HttpServer;

  private listeners: Set<WebServerListener> = new Set();
  private sockets: Set<Socket> = new Set();

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.server = createServer(this.app);
    this.io = new IoServer(this.server, {
      cors: {
        origin: "http://localhost:5174",
        methods: ["GET", "POST"]
      }
    });
    this.io.on("connection", (socket: Socket) => {
      this.sockets.add(socket);
      for (const listener of this.listeners) {
        listener.onConnect(socket.id);
      }

      socket.on("disconnect", () => {
        this.sockets.delete(socket);
        for (const listener of this.listeners) {
          listener.onDisconnect(socket.id);
        }
      });
    });
  }

  addListener(listener: WebServerListener): void {
    this.listeners.add(listener);
  }

  removeListener(listener: WebServerListener): void {
    this.listeners.delete(listener);
  }

  start(): Promise<void> {
    return new Promise(resolve => {
      this.server.listen(this.port, () => {
        console.log(`Web server running on port ${this.port}.`);
        resolve();
      });
    });
  }

  publishState(state: DataStateScene) {
    for (const socket of this.sockets) {
      socket.emit("state", state);
    }
  }
}

export interface WebServerListener {
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}