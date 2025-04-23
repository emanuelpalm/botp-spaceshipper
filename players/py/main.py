import os
import json
import secrets
import time
from player_client import PlayerClient, PlayerClientOptions
from ollama_client import OllamaClient, OllamaChatRequest

PLAYER_ID_FILE = ".playerid.txt"

def load_or_create_player_id():
    if os.path.exists(PLAYER_ID_FILE):
        with open(PLAYER_ID_FILE, "r", encoding="utf-8") as f:
            player_id = f.read().strip()
            if player_id:
                return player_id
    new_id = secrets.token_urlsafe(16)
    with open(PLAYER_ID_FILE, "w", encoding="utf-8") as f:
        f.write(new_id)
    return new_id

def play(player_client: PlayerClient, ollama_client: OllamaClient, is_playing_ref):
    state = player_client.play(0, 0)
    while is_playing_ref[0]:
        player = next((e for e in state.entities if e.get('id') == player_client.id), None)
        if not player:
            print("We are not playing.")
            is_playing_ref[0] = False
            return
        target = next((e for e in state.entities if e.get('type') == 1), None)
        if not target:
            print("Target not found.")
            is_playing_ref[0] = False
            return
        chat_req = OllamaChatRequest(
            model="llama3.2:3b",
            messages=[{
                "role": "user",
                "content": f"Given (px,py)=({player['x']}, {player['y']}) and (tx,ty)=({target['x']}, {target['y']}), provide a vector (ax, ay) of magnitude 1.0 that points from (px,py) to (tx,ty)."
            }],
            format={
                "type": "object",
                "properties": {
                    "ax": {"type": "number"},
                    "ay": {"type": "number"},
                    "message": {"type": "string"}
                },
                "required": ["ax", "ay", "message"]
            },
            stream=False
        )
        chat_resp = ollama_client.chat(chat_req)
        content = json.loads(chat_resp.message["content"])
        print(f"(ax={content['ax']}, ay={content['ay']}, message={content['message']})")
        state = player_client.play(content['ax'], content['ay'])
        time.sleep(0.2)  # avoid tight loop

def main():
    player_id = load_or_create_player_id()
    ollama_client = OllamaClient()
    player_client = PlayerClient(PlayerClientOptions(name="Pythagoras", id=player_id))
    response = player_client.join()
    print(response.message)
    is_playing = [False]
    def on_state(state):
        if state.isPlaying:
            print("We are playing!")
            is_playing[0] = True
            play(player_client, ollama_client, is_playing)
        else:
            print("We are not playing.")
            is_playing[0] = False
    player_client.on_state(on_state)
    # Keep main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting.")

if __name__ == "__main__":
    main()
