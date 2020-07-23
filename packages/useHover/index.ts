import { ref, Ref, isRef, watch } from "vue";
export interface Options {
  onEnter?: (e: MouseEvent) => void;
  onLeave?: (e: MouseEvent) => void;
}


type Action = {
  actions: {
    removelistener: () => void
  }
}

/**
 * useHover
 *
 * @param {(HTMLElement | Ref<HTMLElement>)} ele
 * @param {Options} [options]
 * @returns
 */
function useHover(target: HTMLElement | Ref<HTMLElement>, options?: Options): [Ref<Boolean>, Action] {
  if (!target) {
    console.warn(`fucntiuon useHover first parameter expect HTMLElement | Ref<HTMLElement>,bug got ${target}`)
    return
  }
  const isHovering = ref(null)
  const eleIsRef = isRef(target)
  const { onEnter, onLeave } = options || {}
  const onMouseEnter = (e: MouseEvent) => {
    if (onEnter) { onEnter(e) }
    isHovering.value = true
  };
  const onMouseLeave = (e: MouseEvent) => {
    if (onLeave) { onLeave(e) }
    isHovering.value = false
  };

  const _addListeners = (ele: HTMLElement) => {
    if (ele) {
      ele.addEventListener('mouseenter', onMouseEnter);
      ele.addEventListener('mouseleave', onMouseLeave);
    }
  }
  const _removeListeners = (ele: HTMLElement) => {
    if (ele) {
      ele.removeEventListener('mouseenter', onMouseEnter);
      ele.removeEventListener('mouseleave', onMouseLeave);
    }
  }
  let removelistener!: () => void
  if (eleIsRef) {
    const destoryWatcher = watch(target as Ref<HTMLElement>, (newValue, oldValue) => {
      if (newValue) {
        _addListeners(newValue)
      }
      if (oldValue) {
        _removeListeners(oldValue)
      }
    })
    removelistener = () => {
      _removeListeners((target as Ref<HTMLElement>).value)
      destoryWatcher()
    }
  } else {
    _addListeners(target as HTMLElement)
    removelistener = () => {
      _removeListeners(target as HTMLElement)
    }
  }
  return [isHovering, { actions: { removelistener } }];
}

export default useHover