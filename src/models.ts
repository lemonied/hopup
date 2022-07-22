export interface Middleware<C> {
  (ctx: C, next: () => Promise<void>): Promise<void>;
}

export type HopUpPlugin = Middleware<Context>;

export type DOMStat = 'remove' | 'add' | 'alive';

interface SnapshotValue {
  rect: DOMRect;
  stat: DOMStat;
}

export type Snapshot = Map<HTMLElement, SnapshotValue>;

export interface Context {
  snapshot: Snapshot;
}
