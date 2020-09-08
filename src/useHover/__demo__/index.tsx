import { ref, Component } from 'vue';
import useHover from '../index';
export default {
  setup() {
    const eleRef = ref(null);
    const [isHover] = useHover(eleRef, {
      onEnter: () => {
        console.log('enter');
      },
    });
    return {
      eleRef,
      isHover,
    };
  },
  render(_ctx) {
    return (
      <>
        <h1 ref="eleRef">move your mouse</h1>
        <h2>{_ctx.isHover ? 'enter' : 'leave'}</h2>
      </>
    );
  },
} as Component;
