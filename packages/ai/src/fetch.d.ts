/**
 * Minimal fetch type declarations for Node.js 18+ (which includes native fetch).
 * Avoids pulling in the full DOM lib.
 */

interface FetchRequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface FetchResponse {
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  json(): Promise<unknown>;
  text(): Promise<string>;
}

declare function fetch(url: string, init?: FetchRequestInit): Promise<FetchResponse>;
