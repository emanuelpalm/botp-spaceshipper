import readline from "node:readline/promises";
import { PlayerServer } from "./player-server.js";
import { WebServer } from "./web-server.js";
import { World } from "./world.js";
import { ProtocolError } from "./error.js";

const LOOP_UPDATE_RATE = 20; // Updates per second
const LOOP_UPDATE_INTERVAL = 1000 / LOOP_UPDATE_RATE;
const WEB_PORT = process.env.WEB_PORT ? parseInt(process.env.WEB_PORT) : 3000;
const PLAYER_PORT = process.env.PLAYER_PORT ? parseInt(process.env.PLAYER_PORT) : 3001;

// Initialize readline interface.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
rl.setPrompt("> ");

// Initialize the game world.
const world = new World();

// Handle web clients.
const webServer = new WebServer(WEB_PORT);
webServer.addListener({
  onConnect: _id => {},
  onDisconnect: _id => {},
});

// Handle player clients.
const playerServer = new PlayerServer(PLAYER_PORT);
playerServer.addListener({
  onJoin: (id, name) => world.join(id, name),
  onLeave: id => world.leave(id),
  onPlay: (id, ax, ay) => {
    const player = world.players.get(id);
    if (!player) {
      return undefined;
    }
    player.data.ax = ax;
    player.data.ay = ay;
    return world.state;
  }
});

// Setup and run game loop.
let ts0 = performance.now();
setInterval(() => {
  // Determine the exact duration between this and the last invocation of this function.
  const ts1 = performance.now();
  const dt = (ts1 - ts0) / 1000;
  ts0 = ts1;

  // Update the game world.
  world.update(dt);

  // Publish the state of the game world to all web clients.
  webServer.publishState(world.state);

  // Publish the simplified state of the game world to all player clients.
  playerServer.publishState(world.stateSimplified);

}, LOOP_UPDATE_INTERVAL);

// Start servers and readline interface.
(async () => {
  console.log();
  console.log("██████╗   * .      .██████╗");
  console.log("██╔══██╗ .   . ██╗* ██╔══██╗");
  console.log("██████╔╝ ████╗█████╗██████╔╝");
  console.log("██╔══██╗██╔═██╬██╔═╝██╔═══╝.");
  console.log("██████╔╝╚████╔╝╚███╗██║ *");
  console.log("╚═════╝ *╚═══╝. ╚══╝╚═╝.   *");
  console.log("  .        . *   .    .");
  console.log(" THE SPACESHIPPER CHALLENGE");
  console.log();

  await webServer.start();
  console.log("Web server running on port %d.", webServer.port);
  await playerServer.start();
  console.log("Player server running on port %d.", playerServer.port);

  console.log();
  console.log("Type 'help' for a list of available actions.");

  rl.on("line", line => {
    try {
      const args = line.split(/\s+/);
      switch (args[0]) {
        default:
          console.log(`Unknown action: '${args[0]}'.`);
          console.log("Type 'help' for a list of available actions.");
          break;

        case "help":
          console.log("Available actions:");
          console.log("  help          - Show this help message.");
          console.log("  player --list - List connected players.");
          console.log("  scene         - Show information about current scene.");
          console.log("  scene --list  - List available scenes.");
          console.log("  scene <id>    - Switch to identified scene.");
          console.log("  quit          - Quit the server.");
          break;

        case "player":
          if (args[1] === "--list") {
            console.log("Connected players:");
            for (const player of world.players.values()) {
              console.log(`- id: ${player.data.id}, name: ${player.data.name}, score: ${player.data.score}`);
            }
          } else {
            console.log("Usage: player --list");
          }
          break;

        case "scene":
          if (args.length === 1) {
            console.log("Current scene:");
            console.log(" id:", world.scene.id);
          } else if (args[1] === "--list") {
            console.log("Available scenes:");
            for (const sceneId of world.scenes.keys()) {
              console.log(`- ${sceneId}`);
            }
          } else if (args[1]) {
            world.setSceneById(args[1]);
          } else {
            console.log("Usage: scene [--list | <id>]");
          }
          break;

        case "quit":
          quit();
      }
    } catch (error) {
      if (error instanceof ProtocolError) {
        console.log(error.message);
      } else {
        throw error;
      }
    }
    rl.prompt();
  });
  rl.prompt();
})();

async function quit() {
  console.log("Bye!");

  await webServer.stop();
  await playerServer.stop();

  rl.close();
  process.exit(0);
}