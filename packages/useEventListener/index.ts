import { watch, Ref } from "vue";
function useEventListener(bindEle: Ref<HTMLElement | Document | Window>, option: { type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions }) {
    const { type, listener, options } = option
    const destroyWatcher = watch(bindEle, (ele, prevEle) => {
        if (ele) {
            ele.addEventListener(type, listener, options)
        }
        if (prevEle) {
            ele.removeEventListener(type, listener)
        }
    }, { immediate: true, flush: 'pre' })
    function removeListener(isDestroyWatcher = true) {
        (bindEle).value.removeEventListener(type, listener)
        if (isDestroyWatcher) {
            destroyWatcher()
        }
    }
    return removeListener
}
export default useEventListener