import { OllamaClient } from "./ollama-client.js";
import { PlayerClient } from "./player-client.js";

import fs from "fs";
import path from "path";
import crypto from "crypto";

let isPlaying = false;

async function main() {
  const playerId = await loadOrCreatePlayerId();

  const ollamaClient = new OllamaClient();
  const playerClient = new PlayerClient({ name: "Proompty", id: playerId });

  const response = await playerClient.join();
  console.log(response.message);

  playerClient.onState(async (state) => {
    if (state.isPlaying) {
      console.log("We are playing!");
      isPlaying = true;
      await play(playerClient, ollamaClient);
    } else {
      console.log("We are not playing.");
      isPlaying = false;
    }
  });
}

async function play(playerClient: PlayerClient, ollamaClient: OllamaClient) {
  let state = await playerClient.play(0, 0);
  while (isPlaying) {
    const player = state.entities.find(entity => entity.id === playerClient.id);
    if (!player) {
      console.error("We are not playing.");
      isPlaying = false;
      return;
    }

    const target = state.entities.find(entity => entity.type === 1);
    if (!target) {
      console.error("Target not found.");
      isPlaying = false;
      return;
    }

    const chatResponse = await ollamaClient.chat({
      model: 'llama3.2:3b',
      messages: [
        {
          role: "user",
          content: `You are at (${player.x}, ${player.y}) and need to go to (${target.x}, ${target.y}). Provide a vector (ax, ay) for approaching the target.`,
        },
      ],
      format: {
        type: "object",
        properties: {
          ax: { type: "number" },
          ay: { type: "number" }
        },
        required: ["ax", "ay"]
      },
      stream: false,
    });

    const { ax, ay } = JSON.parse(chatResponse.message.content);
    console.log(`Let's go towards (${ax}, ${ay})!`);
    state = await playerClient.play(ax, ay);
  }
}

async function loadOrCreatePlayerId(): Promise<string> {
  const filePath = path.join(process.cwd(), ".playerid.txt");
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    const id = data.trim();
    if (id) return id;
  } catch (err) {
    // File does not exist or is invalid
  }
  const newId = crypto.randomBytes(12).toString("base64url");
  await fs.promises.writeFile(filePath, newId, "utf-8");
  return newId;
}

main();
