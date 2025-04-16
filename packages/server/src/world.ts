import { DataPlayer, DataState } from '@spaceshipper/common';
import { Scene } from './scene/scene.ts';
import { Lobby } from './scene/lobby.ts';
import { ProtocolError } from './error.ts';
import random from './util/random.ts';
import { Level0 } from './scene/level0.ts';

const scenes = [
  new Lobby(),
  new Level0(),
];

const mapIdToScene: Map<Scene["id"], Scene> = new Map(scenes.map(scene => [scene.id, scene]));

export class World {
  readonly id: string = random.createId();

  get players(): Map<DataPlayer["id"], DataPlayer> {
    return this._scene.players;
  }
  
  get scenes(): Map<Scene["id"], Scene> {
    return mapIdToScene;
  }
  
  private _scene: Scene = scenes[0];

  get scene(): Scene {
    return this._scene;
  }

  get state(): DataState {
    return {
      worldId: this.id,
      sceneId: this._scene.id,
      background: this._scene.background,
      entities: this._scene.entities,
    };
  }

  setSceneById(sceneId: string) {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      throw new ProtocolError(`Scene '${sceneId}' not found.`);
    }
    scene.players.clear();
    for (const player of this._scene.players.values()) {
      scene.players.set(player.id, player);
    }
    this._scene.players.clear();
    this._scene = scene;
    this._scene.start();
  }

  join(playerId: string, name: string): void {
    this._scene.join(playerId, name);
  }

  leave(playerId: string): void {
    this._scene.leave(playerId);
  }

  update(dt: number) {
    this._scene.update(dt);
  }
}
