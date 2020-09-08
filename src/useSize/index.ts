import { Ref, reactive, onMounted, watch, ref } from '@vue/runtime-dom';
import ResizeObserver from 'resize-observer-polyfill';

type Size = { width?: number; height?: number };

function useSize(target?: Ref<Element | Window | null>): [Size, Ref] {
  const elRef = target || ref(null);
  const state = reactive({
    width: ((elRef || {}) as HTMLElement).clientWidth,
    height: ((elRef || {}) as HTMLElement).clientHeight,
  });
  onMounted(() => {
    let resizeObserver = null;
    watch(
      elRef,
      (el, preElm, onInvalidate) => {
        if (!el) return;
        resizeObserver && resizeObserver.disconnect();
        resizeObserver = new ResizeObserver(entries => {
          entries.forEach(entry => {
            state.width = entry.target.clientWidth;
            state.height = entry.target.clientHeight;
          });
        });
        resizeObserver.observe(el as HTMLElement);
        onInvalidate(() => {
          resizeObserver && resizeObserver.disconnect();
        });
      },
      { immediate: true },
    );
  });

  return [state, elRef];
}

export default useSize;
