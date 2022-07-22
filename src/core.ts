import { HopUpPlugin, Middleware, Snapshot } from './models';
import { compose } from './compose';

const hopItems = new WeakSet<HTMLElement>();

export function createElement(tagName: string | HTMLElement) {
  const ele = typeof tagName === 'string' ? document.createElement(tagName) : tagName;
  hopItems.add(ele);
  return ele;
}

export class HopUp {
  private container: HTMLElement;
  private middlewares: HopUpPlugin[] = [];
  private queues: Middleware<null>[] | null = null;
  private snapshots: Snapshot = new Map();
  private async trigger() {
    let resolve!: (value: (void | PromiseLike<void>)) => void;
    const task = new Promise<void>(r => resolve = r);
    const middlewares = this.middlewares;
    this.middlewares = [];
    const queue: Middleware<null> = async (_, next) => {
      await compose(middlewares)({ snapshot: this.snapshots });
      resolve(Promise.resolve());
      await next();
    };
    if (this.queues === null) {
      this.queues = [queue];
      compose(this.queues)(null).then(() => {
        this.queues = null;
      }).catch((e) => {
        console.error(e);
        this.queues = null;
      });
    } else {
      this.queues.push(queue);
    }
    await task;
  }
  private takeSnapshot(override = false) {
    const previous = new Map(this.snapshots.entries());
    this.snapshots.clear();
    const els = this.container.children;
    for (let i = 0; i < els.length; i += 1) {
      const el = els[i] as HTMLElement;
      if (hopItems.has(el)) {
        const prev = previous.get(el);
        if (prev) {
          this.snapshots.set(el, { rect: override ? el.getBoundingClientRect() : prev.rect, stat: 'alive' });
        } else {
          this.snapshots.set(el, { rect: el.getBoundingClientRect(), stat: 'add' });
        }
      }
    }
  }
  constructor(container: HTMLElement) {
    this.container = container;
  }
  public snapshot(override = false) {
    this.middlewares.push(async (ctx, next) => {
      this.takeSnapshot(override);
      await next();
    });
    return this;
  }
  public use(plugin?: HopUpPlugin) {
    plugin && this.middlewares.push(plugin);
    return this;
  }
  public run() {
    return this.trigger();
  }
}

export function createHopGroup(container: HTMLElement) {
  return new HopUp(container);
}
