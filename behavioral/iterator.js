/**
 * Iterator (behavioral)
 * Walk through a collection without exposing how it is stored.
 *
 * Modern JS: the iteration protocol is built in. Implement
 * `[Symbol.iterator]` (a generator is the shortest way) and `for...of`,
 * spread and destructuring just work. Iterator helpers (`Iterator.from`,
 * `.filter`, `.map`, `.take`) add lazy pipelines on top.
 */

// A playlist stored as a linked list; callers never see the nodes.
export class Playlist {
  #head = null;
  #tail = null;

  add(track) {
    const node = { track, next: null };
    if (this.#tail) this.#tail.next = node;
    else this.#head = node;
    this.#tail = node;
    return this;
  }

  *[Symbol.iterator]() {
    for (let node = this.#head; node; node = node.next) yield node.track;
  }
}

// An infinite generator is safe because consumers pull values lazily.
export function* idSequence(prefix = 'id') {
  let n = 1;
  while (true) yield `${prefix}-${n++}`;
}

export function shortTracks(playlist, maxSeconds, limit) {
  return Iterator.from(playlist)
    .filter((track) => track.seconds <= maxSeconds)
    .map((track) => track.title)
    .take(limit)
    .toArray();
}

// Async iteration: pages arrive one at a time, the caller sees one stream.
export async function* paginate(fetchPage) {
  let cursor = null;
  do {
    const page = await fetchPage(cursor);
    yield* page.items;
    cursor = page.next;
  } while (cursor);
}
