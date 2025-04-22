import crypto from 'node:crypto';
import fetch from 'node-fetch';
import { EventSource } from 'eventsource';

export interface PlayerClientOptions {
  baseUrl?: string;
  name: string;
}

export interface PlayerClientJoinResponse {
  id: string;
  name: string;
  message: string;
}

export interface PlayerClientState extends PlayerClientStateSimplified {
  // Background dimensions.
  background: { width: number; height: number };

  // World entities.
  entities: {
    // Uniquely identifies the entity.
    id: string;

    // 0 = player, 1 = portal, 2 = text, 3 = black hole, 4 = sentry, 5 = sentry shot
    type: number;

    // Entity position.
    x: number;
    y: number;

    // Entity velocity.
    dx: number;
    dy: number;

    // Entity acceleration vector, if player.
    ax?: number;
    ay?: number;

    // Whether the entity is enabled. Disabled entities are ignored by the game server.
    enabled: boolean;

    // The name of the entity, if player or portal.
    name?: string;

    // The score of the entity, if player.
    score?: number;
  }[];
}

export interface PlayerClientStateSimplified {
  // Whether the game is currently playing.
  isPlaying: boolean;
}

export class PlayerClient {
  readonly baseUrl: string;
  readonly id: string = crypto.randomBytes(12).toString('base64');
  readonly name: string;

  constructor(options: PlayerClientOptions) {
    this.baseUrl = options.baseUrl?.replace(/\/$/, '') ?? 'http://localhost:3001';
    this.name = options.name;
  }

  /**
   * Join the player server represented by this client.
   */
  async join(): Promise<PlayerClientJoinResponse> {
    const res = await fetch(`${this.baseUrl}/players/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.name, id: this.id }),
    });
    if (!res.ok) {
      throw new Error(`Failed to join: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as PlayerClientJoinResponse;
  }

  /**
   * Subscribe to simplified state updates from the server.
   *
   * @param callback Function called for each state update.
   * @returns A function used to cancel the created subscription.
   */
  onState(callback: (state: PlayerClientStateSimplified) => void): () => void {
    const url = `${this.baseUrl}/state`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = (event: MessageEvent) => {
      const state = JSON.parse(event.data);
      callback(state as PlayerClientStateSimplified);
    };
    return () => eventSource.close();
  }

  /**
   * Tell the server what direction to accelerate the player in.
   *
   * The acceleration is specified as a vector (ax, ay), where each of its two
   * components determines the horizontal and vertical acceleration of the
   * player, respectively. The magnitude of the vector, which will be clamped
   * to [0, 1] by the server, determines the relative strength of the
   * acceleration. A magnitude of 1 means that full speed is approached, while
   * a magnitude of 0 means that full stop is approached.
   *
   * The endpoint returns the current state of the game world, including where
   * all entities are located and how they are moving.
   *
   * @param ax The horizontal acceleration component.
   * @param ay The vertical acceleration component.
   * @returns The updated state.
   */
  async play(ax: number, ay: number): Promise<PlayerClientState> {
    const res = await fetch(`${this.baseUrl}/players/${this.id}/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.id, ax, ay }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send play action: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as PlayerClientState;
  }

  /**
   * Leave the game.
   */
  async leave(): Promise<void> {
    await fetch(`${this.baseUrl}/players/${this.id}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: this.id }),
    });
  }
}
