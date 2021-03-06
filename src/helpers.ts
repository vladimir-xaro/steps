import { I_EventEmitter, I_EventEmitterConstructorConfig } from "@xaro/event-emitter";

export function subscribeEvents(emitter: I_EventEmitter, events: I_EventEmitterConstructorConfig): void {
  for (const key in events) {
    this.base.emitter.subscribe(key, events[key]);
  }
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateEventName(prefix: string, key: string): string {
  return prefix + capitalizeFirstLetter(key);
}