import { ref, ComponentPublicInstance, Ref } from 'vue';
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
