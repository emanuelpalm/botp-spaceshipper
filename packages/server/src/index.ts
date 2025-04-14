import readline from "node:readline/promises";
import { PlayerServer } from "./player-server.ts";
import { WebServer } from "./web-server.ts";
import { World } from "./world.ts";

import { lobby } from "./scene/index.ts";

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
const world = new World(lobby);

// Handle web clients.
const webServer = new WebServer(WEB_PORT);
webServer.addListener({
  onConnect: (id) => {
    console.log(`Web client ${id} connected.`);
  },
  onDisconnect: (id) => {
    console.log(`Web client ${id} disconnected.`);
  },
});

// Handle player clients.
const playerServer = new PlayerServer(PLAYER_PORT);
playerServer.addListener({
  onJoin: (id, name) => world.join(id, name),
  onLeave: id => world.leave(id),
  onPlay: (id, dx, dy) => {
    console.log(`Player ${id} moved: dx=${dx}, dy=${dy}.`);
    return world.getState();
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

  // Publish the state of the game to all web clients.
  webServer.publishState(world.getState());
}, LOOP_UPDATE_INTERVAL);

// Start servers and readline interface.
(async () => {
  console.log();
  console.log("██████╗             ██╗   ██████╗");
  console.log("██╔══██╗ ██████╗  ██████╗ ██╔══██╗");
  console.log("██████╔╝██║   ██║   ██╔═╝ ██████╔╝");
  console.log("██╔══██╗██║   ██║   ██║   ██╔═══╝ ");
  console.log("██████╔╝╚██████╔╝ ████║   ██║");
  console.log("╚═════╝  ╚═════╝  ╚═══╝   ╚═╝");
  console.log("   THE SPACESHIPPER CHALLENGE");
  console.log();

  await webServer.start();
  await playerServer.start();

  console.log();
  console.log("Type 'help' for a list of available actions.");

  rl.on("line", async (line) => {
    const args = line.split(/\s+/);
    switch (args[0]) {
      default:
        console.log(`Unknown action: '${args[0]}'.`);
        console.log("Type 'help' for a list of available actions.");
        break;

      case "help":
        console.log("Available actions:");
        console.log("  help - Show this help message.");
        console.log("  game:start - Start pending level.");
        console.log("  quit - Quit the server.");
        break;

      case "game:start":
        console.log("Starting the game...");
        break;

      case "quit":
        console.log("Bye!");

        await webServer.stop();
        await playerServer.stop();

        rl.close();
        process.exit(0);
    }
    rl.prompt();
  });
  rl.prompt();
})();