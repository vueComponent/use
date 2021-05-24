import { Component, ref, Ref, watchEffect } from 'vue';
import useReactiveRef from '../index';
export default {
  setup() {
    const [eleRef, setEle] = useReactiveRef();
    const flag = ref(true);
    const toggle = () => {
      flag.value = !flag.value;
    };
    watchEffect(() => {
      console.log((eleRef as Ref<HTMLElement>).value?.innerHTML);
    });
    return () => (
      <>
        <button onClick={toggle}> toggle "h1"</button>
        {flag.value ? <h1 ref={setEle}>h1</h1> : null}
        <h2>{(eleRef as Ref<HTMLElement>).value?.innerHTML}</h2>
      </>
    );
  },
} as Component;
