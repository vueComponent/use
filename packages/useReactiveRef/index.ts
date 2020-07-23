import { ref, ComponentPublicInstance, nextTick } from "@vue/runtime-dom";
type ElementType = HTMLElement | ComponentPublicInstance
function useReactiveRef(isImmediate?: boolean) {
    let prevEle = null as ElementType | null
    let eleRef = ref(prevEle)
    function setEle(ele: HTMLElement) {
        if (prevEle === ele) return
        prevEle = ele
        if (isImmediate) {
            eleRef.value = prevEle
        } else {
            nextTick(() => {
                eleRef.value = prevEle
            })
        }
    }
    return { setEle, eleRef }
}
export default useReactiveRef