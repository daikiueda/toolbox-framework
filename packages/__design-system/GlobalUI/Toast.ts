import { ToastQueue } from '@react-spectrum/toast';

export { ToastContainer } from '@react-spectrum/toast';

export default {
  ...ToastQueue,

  // NOTE: try...catch receives content as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  caughtError: (e: any, options: Parameters<typeof ToastQueue.negative>[1] = undefined) => {
    console.error(e);
    const children = e instanceof Error ? `${e.name}: ${e.message}` : (e as string);
    return ToastQueue.negative(children, options);
  },
};
