import { ToastQueue } from '@react-spectrum/s2';

export { ToastContainer } from '@react-spectrum/s2';

// すべてのToastのclose関数を保存する配列
const closeFunctions: Array<() => void> = [];

type ToastOptions = { onClose?: () => void };

// optionsをラップして、onCloseで配列から削除するようにする
const createWrapper = <T extends ToastOptions | undefined>(
  options?: T
): { wrappedOptions: T; setClose: (close: () => void) => void } => {
  let closeFunc: (() => void) | null = null;

  const removeFromArray = () => {
    if (closeFunc) {
      const index = closeFunctions.indexOf(closeFunc);
      if (index !== -1) {
        closeFunctions.splice(index, 1);
      }
    }
  };

  const wrappedOptions = (
    options
      ? {
          ...options,
          onClose: () => {
            removeFromArray();
            options.onClose?.();
          },
        }
      : { onClose: removeFromArray }
  ) as T;

  return {
    wrappedOptions,
    setClose: (close: () => void) => {
      closeFunc = close;
    },
  };
};

// close関数を配列に追加し、ラップしたclose関数を返す
const trackClose = (close: () => void): (() => void) => {
  closeFunctions.push(close);

  return () => {
    close();
    const index = closeFunctions.indexOf(close);
    if (index !== -1) {
      closeFunctions.splice(index, 1);
    }
  };
};

export default {
  neutral: (children: string, options?: Parameters<typeof ToastQueue.neutral>[1]) => {
    const wrapper = createWrapper(options);
    const close = ToastQueue.neutral(children, wrapper.wrappedOptions);
    wrapper.setClose(close);
    return trackClose(close);
  },

  positive: (children: string, options?: Parameters<typeof ToastQueue.positive>[1]) => {
    const wrapper = createWrapper(options);
    const close = ToastQueue.positive(children, wrapper.wrappedOptions);
    wrapper.setClose(close);
    return trackClose(close);
  },

  negative: (children: string, options?: Parameters<typeof ToastQueue.negative>[1]) => {
    const wrapper = createWrapper(options);
    const close = ToastQueue.negative(children, wrapper.wrappedOptions);
    wrapper.setClose(close);
    return trackClose(close);
  },

  info: (children: string, options?: Parameters<typeof ToastQueue.info>[1]) => {
    const wrapper = createWrapper(options);
    const close = ToastQueue.info(children, wrapper.wrappedOptions);
    wrapper.setClose(close);
    return trackClose(close);
  },

  // NOTE: try...catch receives content as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  caughtError: (e: any, options: Parameters<typeof ToastQueue.negative>[1] = undefined) => {
    console.error(e);
    const children = e instanceof Error ? `${e.name}: ${e.message}` : (e as string);
    const wrapper = createWrapper(options);
    const close = ToastQueue.negative(children, wrapper.wrappedOptions);
    wrapper.setClose(close);
    return trackClose(close);
  },

  /** すべてのToastを閉じる */
  clearAll: () => {
    // 配列をコピーしてから実行（closeの中で配列が変更されるため）
    const functions = [...closeFunctions];
    functions.forEach((close) => close());
    closeFunctions.length = 0; // 配列をクリア
  },
};
