import { ref, Ref, watch } from 'vue';
export interface Options {
  onEnter?: (e: MouseEvent) => void;
  onLeave?: (e: MouseEvent) => void;
}

type Action = {
  actions: {
    removelistener: () => void;
  };
};

/**
 * useHover
 *
 * @param {Ref<HTMLElement>)} ele
 * @param {Options} [options]
 * @returns
 */
function useHover(target: Ref<HTMLElement>, options?: Options): [Ref<boolean>, Action] {
  if (!target) {
    console.warn(
      `fucntiuon useHover first parameter expect HTMLElement | Ref<HTMLElement>,bug got ${target}`,
    );
    return;
  }
  const isHovering = ref(null);
  const { onEnter, onLeave } = options || {};
  const onMouseEnter = (e: MouseEvent) => {
    if (onEnter) {
      onEnter(e);
    }
    isHovering.value = true;
  };
  const onMouseLeave = (e: MouseEvent) => {
    if (onLeave) {
      onLeave(e);
    }
    isHovering.value = false;
  };

  const _addListeners = (ele: HTMLElement) => {
    if (ele) {
      ele.addEventListener('mouseenter', onMouseEnter);
      ele.addEventListener('mouseleave', onMouseLeave);
    }
  };
  const _removeListeners = (ele: HTMLElement) => {
    if (ele) {
      ele.removeEventListener('mouseenter', onMouseEnter);
      ele.removeEventListener('mouseleave', onMouseLeave);
    }
  };
  const removelistener = () => {
    _removeListeners((target as Ref<HTMLElement>).value);
    destoryWatcher();
  };
  const destoryWatcher = watch(
    target as Ref<HTMLElement>,
    (newValue, oldValue) => {
      if (newValue) {
        _addListeners(newValue);
      }
      if (oldValue) {
        _removeListeners(oldValue);
      }
    },
    { flush: 'post' },
  );
  return [isHovering, { actions: { removelistener } }];
}

export default useHover;
