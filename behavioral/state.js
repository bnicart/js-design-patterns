/**
 * State (behavioral)
 * Let an object change its behaviour when its internal state changes, as if it changed class.
 *
 * Modern JS: a transition table in a plain object is often enough, and it
 * doubles as documentation. Reach for a class per state when each state
 * carries real behaviour of its own.
 */

// Which events each state accepts, and where they lead.
export const transitions = {
  idle: { start: 'uploading' },
  uploading: { progress: 'uploading', pause: 'paused', fail: 'failed', finish: 'done' },
  paused: { resume: 'uploading', cancel: 'idle' },
  failed: { retry: 'uploading', cancel: 'idle' },
  done: {},
};

export class FileUpload {
  #state = 'idle';
  #percent = 0;

  get state() { return this.#state; }
  get percent() { return this.#percent; }

  can(event) {
    return event in transitions[this.#state];
  }

  send(event, payload) {
    const next = transitions[this.#state][event];
    if (!next) throw new Error(`Cannot "${event}" while ${this.#state}`);
    if (event === 'progress') this.#percent = payload;
    if (event === 'finish') this.#percent = 100;
    if (event === 'cancel') this.#percent = 0;
    this.#state = next;
    return this;
  }
}
