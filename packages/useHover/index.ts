import { ref, Ref, isRef, watch } from "vue";
export interface Options {
  onEnter?: (e: MouseEvent) => void;
  onLeave?: (e: MouseEvent) => void;
}




/**
 * useHover
 *
 * @param {(HTMLElement | Ref<HTMLElement>)} ele
 * @param {Options} [options]
 * @returns
 */
function useHover(ele: HTMLElement | Ref<HTMLElement>, options?: Options) {
  if (!ele) {
    console.warn(`fucntiuon useHover first parameter expect HTMLElement | Ref<HTMLElement>,bug got ${ele}`)
    return
  }
  const isHover = ref(null)
  const eleIsRef = isRef(ele)
  const { onEnter, onLeave } = options || {}
  const onMouseEnter = (e: MouseEvent) => {
    if (onEnter) { onEnter(e) }
    isHover.value = true
  };
  const onMouseLeave = (e: MouseEvent) => {
    if (onLeave) { onLeave(e) }
    isHover.value = false
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
    const destoryWatcher = watch(ele as Ref<HTMLElement>, (newValue, oldValue) => {
      if (newValue) {
        _addListeners(newValue)
      }
      if (oldValue) {
        _removeListeners(oldValue)
      }
    })
    removelistener = () => {
      _removeListeners((ele as Ref<HTMLElement>).value)
      destoryWatcher()
    }
  } else {
    _addListeners(ele as HTMLElement)
    removelistener = () => {
      _removeListeners(ele as HTMLElement)
    }
  }
  return { isHover, removelistener };
}

export default useHover