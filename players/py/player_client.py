import requests
import threading
import json
from typing import Callable, Dict, Any, List, Optional

try:
    from sseclient import SSEClient
except ImportError:
    SSEClient = None  # Will raise if onState is used without sseclient installed

class PlayerClientOptions:
    def __init__(self, name: str, id: str, base_url: Optional[str] = None):
        self.base_url = (base_url.rstrip('/') if base_url else 'http://localhost:3001')
        self.id = id
        self.name = name

class PlayerClientJoinResponse:
    def __init__(self, id: str, name: str, message: str):
        self.id = id
        self.name = name
        self.message = message

class PlayerClientStateSimplified:
    def __init__(self, isPlaying: bool):
        self.isPlaying = isPlaying

class PlayerClientState(PlayerClientStateSimplified):
    def __init__(self, isPlaying: bool, background: Dict[str, Any], entities: List[Dict[str, Any]]):
        super().__init__(isPlaying)
        self.background = background
        self.entities = entities

class PlayerClient:
    def __init__(self, options: PlayerClientOptions):
        self.base_url = options.base_url
        self.id = options.id
        self.name = options.name

    def join(self) -> PlayerClientJoinResponse:
        res = requests.post(f"{self.base_url}/players/join", json={"name": self.name, "id": self.id})
        if not res.ok:
            raise Exception(f"Failed to join: {res.status_code} {res.reason}")
        data = res.json()
        return PlayerClientJoinResponse(**data)

    def on_state(self, callback: Callable[[PlayerClientStateSimplified], None]) -> Callable[[], None]:
        if SSEClient is None:
            raise ImportError("Please install sseclient-py to use on_state.")
        url = f"{self.base_url}/state"
        stop_event = threading.Event()

        def listen():
            client = SSEClient(requests.get(url, stream=True))
            for event in client.events():
                if stop_event.is_set():
                    break
                state = json.loads(event.data)
                callback(PlayerClientStateSimplified(isPlaying=state['isPlaying']))

        thread = threading.Thread(target=listen, daemon=True)
        thread.start()
        def stop():
            stop_event.set()
        return stop

    def play(self, ax: float, ay: float) -> PlayerClientState:
        res = requests.post(f"{self.base_url}/players/{self.id}/play", json={"id": self.id, "ax": ax, "ay": ay})
        if not res.ok:
            raise Exception(f"Failed to play: {res.status_code} {res.reason}")
        data = res.json()
        return PlayerClientState(
            isPlaying=data['isPlaying'],
            background=data['background'],
            entities=data['entities']
        )
