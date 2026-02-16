/**
 * AIProvider interface - abstraction over different AI backends.
 */

import type { AIRequest, AIResponse } from '@event-horizon/types';

/** Provider interface that all AI backends must implement */
export interface AIProvider {
  /** Display name of this provider */
  readonly name: string;

  /** Send a request and get a response */
  generate(request: AIRequest): Promise<AIResponse>;

  /** Check whether this provider is configured and reachable */
  isAvailable(): Promise<boolean>;
}
