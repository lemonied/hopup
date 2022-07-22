import { forceReflow, styleBigDog, transformProperty, transitionProperty, wait } from '../utils';

export const Flutter = styleBigDog( async (ctx, next) => {
  const { snapshot } = ctx;
  const alive = Array.from(snapshot.entries()).filter(([el, v]) => v.stat === 'alive');
  let extra = Promise.resolve();
  if (alive.length) {
    alive.forEach(([el, v]) => {
      const preRect = v.rect;
      const rect = el.getBoundingClientRect();
      el.style[transitionProperty] = 'none';
      el.style[transformProperty] = `translate3d(${preRect.x - rect.x}px, ${preRect.y - rect.y}px, 0)`;
    });
    alive.forEach(([el, v]) => {
      forceReflow(el);
      el.style[transitionProperty] = 'all ease 0.3s';
      el.style[transformProperty] = 'none';
    });
    extra = wait(300);
  }

  await next();
  await extra;
});
