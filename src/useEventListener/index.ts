import { watchEffect, Ref, isRef, onBeforeUnmount } from 'vue';
function useEventListener(
  target: Ref<HTMLElement | Document | Window> | HTMLElement | Document | Window,
  option: {
    type: string;
    listener: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
  },
): () => void {
  const { type, listener, options } = option;
  const eleIsRef = isRef(target);
  if (eleIsRef) {
    const bindEle = target as Ref<HTMLElement | Document | Window>;
    let prevEle = null;
    const destroyWatcher = watchEffect(
      () => {
        bindEle.value?.addEventListener(type, listener, options);
        if (prevEle) {
          prevEle.removeEventListener(type, listener);
        }
        prevEle = bindEle?.value;
      },
      { flush: 'post' },
    );
    const removeListener = (isDestroyWatcher = true) => {
      bindEle.value.removeEventListener(type, listener);
      if (isDestroyWatcher) {
        destroyWatcher();
      }
    };
    onBeforeUnmount(() => {
      removeListener(true);
    });
    return removeListener;
  } else {
    const bindEle = target as HTMLElement | Document | Window;
    bindEle.addEventListener(type, listener, options);
    const removeListener = () => {
      bindEle.removeEventListener(type, listener);
    };
    onBeforeUnmount(() => {
      removeListener();
    });
    return removeListener;
  }
}
export default useEventListener;
