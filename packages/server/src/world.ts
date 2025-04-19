import { DataPlayer, DataState, DataStateSimplified } from '@spaceshipper/common';
import { Scene } from './scene/scene.ts';
import { Lobby } from './scene/lobby.ts';
import { ProtocolError } from './error.ts';
import random from './util/random.ts';
import { Level0 } from './scene/level0.ts';
import { Level1 } from './scene/level1.ts';
import { Level2 } from './scene/level2.ts';
import { Gallery } from './scene/gallery.ts';

const scenes = [
  new Lobby(),
  new Level0(),
  new Level1(),
  new Level2(),
  new Gallery(),
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
      isPlaying: this._scene.isPlaying,
      background: this._scene.background,
      entities: this._scene.entities,
    };
  }

  get stateSimplified(): DataStateSimplified {
    return {
      worldId: this.id,
      sceneId: this._scene.id,
      isPlaying: this._scene.isPlaying,
    };
  }

  setSceneById(sceneId: string) {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      throw new ProtocolError(`Scene '${sceneId}' not found.`);
    }
    if (this._scene !== scene) {
      scene.players.clear();
      for (const player of this._scene.players.values()) {
        scene.players.set(player.id, player);
      }
      this._scene.players.clear();
      this._scene = scene;
    }
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
