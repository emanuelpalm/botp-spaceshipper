import fetch from 'node-fetch';

/**
 * A request to start or continue a chat with an Ollama chatbot.
 * 
 * See https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion.
 */
export interface OllamaChatRequest {
  /**
   * The model to use for the chat, such as "gemma3".
   */
  model: string;

  /**
   * Chat message history. The last message is the latest and the one that
   * will be responded to directly.
   *
   * The history may include both messages written by you and by the chatbot.
   */
  messages: OllamaMessage[];

  /**
   * Whether you want the response one word, or _token_, at a time.
   */
  stream: boolean;

  /**
   * If you expect a response in JSON format, you can specify either `"json"`
   * and hope that the chatbot returns a suitable JSON structure, or you can
   * specify a complete JSON schema that specifies exactly what format you
   * are expecting.
   *
   * Leave this as undefined if you want the answer to be a text string.
   */
  format?: "json" | object;

  /**
   * Controls for how long the model will stay loaded into memory following
   * the request. Defaults to "5m", which is 5 minutes.
   */
  keep_alive?: string;
}

/**
 * A message part of a chat.
 * 
 * See https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion.
 */
export interface OllamaMessage {
  /**
   * The role of the message.

   * If unsure what to specify, `"user"` will probably do what you want.
   */
  role: 'user' | 'assistant' | 'system' | 'tool';

  /**
   * The content of the message.
   */
  content: string;
}

/**
 * A response received as part of a chat.
 * 
 * See https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion.
 */
export interface OllamaChatResponse {
  /**
   * The model producing the chat response.
   */
  model: string;

  /**
   * The actual response.
   *
   * If a JSON-formatted response was requested, the `"content"` of th message
   * will contain an escaped JSON value.
   */
  message: OllamaMessage;

  /**
   * Whether the chat is complete.
   * 
   * This will only be `false` if streaming was requested.
   */
  done: boolean;
}

/**
 * A client for the Ollama API.
 * 
 * See https://github.com/ollama/ollama/blob/main/docs/api.md.
 */
export class OllamaClient {
  constructor(private baseUrl: string = 'http://localhost:11434') {}

  /**
   * Sends a chat request to the Ollama API.
   * 
   * @param request The chat request to send.
   * @returns The chat response.
   */
  async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      throw new Error(`Ollama chat failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as OllamaChatResponse;
  }
}
