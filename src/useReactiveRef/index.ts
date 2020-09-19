import { ref, ComponentPublicInstance, nextTick, Ref } from '@vue/runtime-dom';
type ElementType = HTMLElement | ComponentPublicInstance;
function useReactiveRef(): [Ref<ElementType>, (...args: any) => void] {
  let prevEle = null as ElementType | null;
  const eleRef = ref(prevEle);
  function setEle(ele: HTMLElement) {
    if (prevEle === ele) return;
    prevEle = ele;
    eleRef.value = prevEle;
  }
  return [eleRef, setEle];
}
export default useReactiveRef;
