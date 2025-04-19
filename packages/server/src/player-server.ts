import { DataState, DataStateSimplified } from "@spaceshipper/common";
import express, { Express } from "express";
import { createServer, Server as HttpServer } from "http";
import { ProtocolError } from "./error.ts";
import { equal } from "./util/equal.ts";

export class PlayerServer {
  public port: number;

  private app: Express;
  private server: HttpServer | undefined;
  private listeners: Set<PlayerServerListener>;
  private players: Set<string> = new Set();
  private state: DataStateSimplified | undefined;
  private stateHandlers = new Map<string, (state: DataStateSimplified) => void>();

  constructor(port: number) {
    this.port = port;

    this.app = express();
    this.app.use(express.json());
    this.listeners = new Set();

    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Join endpoint
    this.app.post('/players/join', (req, res) => {
      const body = req.body;

      const name = body.name;
      if (typeof name !== "string" || /^\s*$/.test(name)) {
        res.status(400).json({ error: "You must provide a name to join." });
        return;
      }
      if (name.length < 3 || name.length > 20) {
        res.status(400).json({ error: "Name must be between 3 and 20 characters long." });
        return;
      }

      const id = body.id;
      if (typeof id !== "string" || /^\s*$/.test(id)) {
        res.status(400).json({ error: "You must provide an id to join." });
        return;
      }
      if (id.length < 16) {
        res.status(400).json({ error: "Id must be at least 16 characters long." });
        return;
      }

      if (this.players.has(id)) {
        res.json({ id, name, message: "You're already in the game!" });
        return;
      }

      try {
        for (const listener of this.listeners) {
          listener.onJoin(id, name);
        }
        this.players.add(id);
        res.json({ id, name, message: "You have joined the game!" });
      } catch (error) {
        if (error instanceof ProtocolError) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: `Failed to join the game; ${error}.` });
        }
      }
    });

    // Play endpoint
    this.app.post('/players/:id/play', (req, res) => {
      const id = req.params.id;
      if (!this.players.has(id)) {
        res.status(404).json({ error: "You're not in the game. Join first!" });
        return;
      }

      const { dx, dy } = req.body;

      if (typeof dx !== "number" || typeof dy !== "number") {
        res.status(400).json({ error: "Invalid movement vector." });
        return;
      }

      let state: DataState | undefined;
      for (const listener of this.listeners) {
        state = listener.onPlay(id, dx, dy);
      }
      if (!state) {
        res.status(500).json({ error: "Failed to update player state." });
        return;
      }
      res.json(state);
    });

    // Leave endpoint
    this.app.delete('/players/:id/leave', (req, res) => {
      const id = req.params.id;
      for (const listener of this.listeners) {
        listener.onLeave(id);
      }
      this.players.delete(id);
      res.json({ message: "Bye!" });
    });

    // State streaming endpoint
    this.app.get('/state', (req, res) => {
      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send initial state if available
      if (this.state) {
        res.write(`data: ${JSON.stringify(this.state)}\r\n\r\n`);
      }

      // Create a state change handler
      const stateHandler = (newState: DataStateSimplified) => {
        res.write(`data: ${JSON.stringify(newState)}\r\n\r\n`);
      };

      // Add this client's handler to a Set when they connect
      const clientId = `${Date.now()}-${Math.random()}`;
      this.stateHandlers.set(clientId, stateHandler);

      // Remove handler when client disconnects
      req.on('close', () => {
        this.stateHandlers.delete(clientId);
      });
    });
  }

  addListener(listener: PlayerServerListener): void {
    this.listeners.add(listener);
  }

  removeListener(listener: PlayerServerListener): void {
    this.listeners.delete(listener);
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = createServer(this.app);
      this.server.listen(this.port, () => resolve());
    });
  }

  stop(): Promise<void> {
    return new Promise(resolve => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }

  publishState(state: DataStateSimplified) {
    if (!equal(this.state, state)) {
      this.state = state;

      // Notify all connected clients
      for (const handler of this.stateHandlers.values()) {
        handler(state);
      }
    }
  }
}

export interface PlayerServerListener {
  onJoin: (id: string, name: string) => void;
  onLeave: (id: string) => void;
  onPlay: (id: string, dx: number, dy: number) => DataState;
}