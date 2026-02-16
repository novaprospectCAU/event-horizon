export { diplomaticEvents } from './diplomatic-events.js';
export { militaryEvents } from './military-events.js';
export { discoveryEvents } from './discovery-events.js';
export { internalEvents } from './internal-events.js';

import { diplomaticEvents } from './diplomatic-events.js';
import { militaryEvents } from './military-events.js';
import { discoveryEvents } from './discovery-events.js';
import { internalEvents } from './internal-events.js';

import type { GameEvent } from '@event-horizon/types';

export const allEvents: GameEvent[] = [
  ...diplomaticEvents,
  ...militaryEvents,
  ...discoveryEvents,
  ...internalEvents,
];
