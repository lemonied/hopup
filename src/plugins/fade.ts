import {
  forceReflow,
  styleBigDog,
  transitionProperty,
  wait,
} from '../utils';

export const FadeIn = styleBigDog(async (ctx, next) => {
  const { snapshot } = ctx;
  let extra = Promise.resolve();
  const added = Array.from(snapshot.entries()).filter(([el, v]) => v.stat === 'add');
  if (added.length) {
    added.forEach(([el]) => {
      el.style[transitionProperty] = 'none';
      el.style['opacity'] = '0';
      forceReflow(el);
    });
    added.forEach(([el]) => {
      el.style[transitionProperty] = 'all ease 300ms';
      el.style['opacity'] = '1';
    });
    extra = wait(300);
  }
  await next();
  await extra;
});

export const FadeOut = styleBigDog(async (ctx, next) => {
  const { snapshot } = ctx;
  const added = Array.from(snapshot.entries()).filter(([el, v]) => v.stat === 'remove');
  if (added.length) {
    added.forEach(([el]) => {
      el.style[transitionProperty] = 'none';
      el.style['opacity'] = '1';
    });
    await wait();
    added.forEach(([el]) => {
      el.style[transitionProperty] = 'all ease 300ms';
      el.style['opacity'] = '0';
    });
    await wait(300);
  }
  await next();
});

