import { Middleware } from './models';

export function compose<C>(middlewares: Middleware<C>[]) {
  return async function(ctx: C) {
    function dispatch(i = 0): Promise<void> {
      const fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(fn(ctx, function next() {
        return dispatch(i + 1);
      }));
    }
    await dispatch();
    return ctx;
  };
}
