import './style.css'
import io from 'socket.io-client';
import { Scene } from './scene';
import { Entity, Spaceship } from './entity';
import Renderer from './renderer';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
  document.getElementById('connection-status')!.textContent = 'Connected to server';
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  document.getElementById('connection-status')!.textContent = 'Disconnected from server';
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="connection-status">Connecting to server...</div>
    <canvas id="game"></canvas>
  </div>
`

const entities: Entity[] = [
  new Spaceship(100, 100, '#5E57FF'),
  new Spaceship(200, 200, '#F23CA6'),
  new Spaceship(300, 300, '#FF0535'),
  new Spaceship(400, 400, '#4BFF36'),
  new Spaceship(500, 500, '#02FEE4'),
];

const renderer = new Renderer('game');
const scene = new Scene(entities);

let ts0 = performance.now();
function gameLoop(ts1: number): void {
  const dt = (ts1 - ts0) / 1000;
  ts0 = ts1;
  
  update(dt);
  scene.draw(renderer, dt);
  
  requestAnimationFrame(gameLoop);
}

function update(dt: number): void {
  for (const entity of entities) {
    entity.update(dt);
  }
}

requestAnimationFrame(gameLoop);
