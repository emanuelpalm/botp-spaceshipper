import requests
from typing import List, Dict, Optional, Union, Any

class OllamaMessage:
    def __init__(self, role: str, content: str):
        self.role = role
        self.content = content

class OllamaChatRequest:
    def __init__(self, model: str, messages: List[Dict[str, str]], stream: bool = False, format: Optional[Union[str, dict]] = None, keep_alive: Optional[str] = None):
        self.model = model
        self.messages = messages
        self.stream = stream
        self.format = format
        self.keep_alive = keep_alive
    def to_dict(self):
        data = {
            "model": self.model,
            "messages": self.messages,
            "stream": self.stream,
        }
        if self.format is not None:
            data["format"] = self.format
        if self.keep_alive is not None:
            data["keep_alive"] = self.keep_alive
        return data

class OllamaChatResponse:
    def __init__(self, model: str, message: Dict[str, str], done: bool):
        self.model = model
        self.message = message
        self.done = done

class OllamaClient:
    def __init__(self, base_url: str = 'http://localhost:11434'):
        self.base_url = base_url.rstrip('/')

    def chat(self, request: OllamaChatRequest) -> OllamaChatResponse:
        url = f"{self.base_url}/api/chat"
        res = requests.post(url, json=request.to_dict())
        if not res.ok:
            raise Exception(f"Ollama chat failed: {res.status_code} {res.reason}")
        data = res.json()
        return OllamaChatResponse(
            model=data["model"],
            message=data["message"],
            done=data["done"]
        )
