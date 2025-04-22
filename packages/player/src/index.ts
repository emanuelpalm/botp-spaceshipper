import { OllamaClient } from "./ollama-client.js";
import { PlayerClient } from "./player-client.js";

let isPlaying = false;

async function main() {
  const ollamaClient = new OllamaClient();
  const playerClient = new PlayerClient({ name: "Proompty" });

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
      model: 'gemma3',
      messages: [
        {
          role: "user",
          content: `Given the current position (${player.x}, ${player.y}) and the target position (${target.x}, ${target.y}), what vector should you apply to the current position to make it approach the target position?`,
        },
      ],
      format: {
        type: "object",
        properties: {
          dx: { type: "number" },
          dy: { type: "number" }
        },
        required: ["dx", "dy"]
      },
      stream: false,
    });

    const { dx, dy } = JSON.parse(chatResponse.message.content);
    console.log(`Let's go towards (${dx}, ${dy})!`);
    state = await playerClient.play(dx, dy);
  }
}

main();
