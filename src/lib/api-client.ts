import type { Config } from "../config.js";
import { ElementaryPosApiError } from "./errors.js";

export class ElementaryPosApiClient {
  constructor(private readonly config: Config) {}

  private resolveApiKey(override?: string): string {
    const key = (override?.trim() || this.config.apiKey?.trim()) ?? "";
    if (!key) {
      throw new Error(
        "Elementary POS API key is required. Provide it via the 'apiKey' tool parameter (configured in the MCP client, not in the server .env)."
      );
    }
    return key;
  }

  async post<TResponse, TRequest extends object = Record<string, never>>(
    path: string,
    body?: TRequest,
    apiKey?: string
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      method: "POST",
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    }, apiKey);
  }

  async get<TResponse>(
    path: string,
    query?: Record<string, string | number | undefined>,
    apiKey?: string
  ): Promise<TResponse> {
    const url = new URL(path, `${this.config.baseUrl}/`);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    return this.request<TResponse>(url.toString(), { method: "GET" }, apiKey);
  }

  private async request<TResponse>(
    pathOrUrl: string,
    init: RequestInit,
    apiKey?: string
  ): Promise<TResponse> {
    const url = pathOrUrl.startsWith("http")
      ? pathOrUrl
      : new URL(pathOrUrl, `${this.config.baseUrl}/`).toString();

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.config.timeoutMs
    );

    const resolvedKey = this.resolveApiKey(apiKey);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
          "X-Api-Key": resolvedKey,
          ...init.headers
        }
      });

      const text = await response.text();
      const payload = text ? safeJsonParse(text) : undefined;

      if (!response.ok) {
        throw new ElementaryPosApiError(
          `Elementary POS API returned HTTP ${response.status}`,
          response.status,
          payload ?? text
        );
      }

      return payload as TResponse;
    } catch (error) {
      if (error instanceof ElementaryPosApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(`Elementary POS API request timed out after ${this.config.timeoutMs}ms`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
