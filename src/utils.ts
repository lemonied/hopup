import { HopUpPlugin } from './models';

const elementStyle = document.createElement('div').style;

const prefix = ['webkit', 'Moz', 'O', 'ms'];

export function prefixStyle<T extends keyof CSSStyleDeclaration>(style: T): T {
  if (elementStyle[style] !== undefined) {
    return style;
  }

  if (typeof style === 'string') {
    for (let i = 0; i < prefix.length; i += 1) {
      const combined = prefix[i] + style.charAt(0).toUpperCase() + style.substring(1);
      if (elementStyle[combined as any] !== undefined) {
        return combined as T;
      }
    }
  }

  return style;
}

export const transitionProperty = prefixStyle('transition');
export const transformProperty = prefixStyle('transform');

function cloneStyles(ele: HTMLElement) {
  const ret: Record<string, any> = {};
  Object.keys(ele.style).forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(ele.style, key);
    if (descriptor?.writable) {
      ret[key] = ele.style[key as any];
    }
  });
  return ret;
}

export class StyleCache {
  private styles = new Map<HTMLElement, Record<string, any>>();
  private cacheOne(ele: HTMLElement) {
    this.styles.set(ele, cloneStyles(ele));
  }
  constructor() {}
  public cached(ele: HTMLElement | HTMLElement[]) {
    if (Array.isArray(ele)) {
      ele.forEach(v => this.cacheOne(v));
    } else {
      this.cacheOne(ele);
    }
  }
  public revert() {
    this.styles.forEach((v, k) => {
      Object.assign(k.style, v);
    });
  }
}
export function styleBigDog(plugin: HopUpPlugin): HopUpPlugin {
  return async (ctx, next) => {
    const { snapshot } = ctx;
    const styleCache = new StyleCache();
    styleCache.cached(Array.from(snapshot.keys()));
    await plugin(ctx, next);
    styleCache.revert();
  };
}

export function wait(delay?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
}

export function forceReflow(el: HTMLElement) {
  return el.offsetHeight;
}
