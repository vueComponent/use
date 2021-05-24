import { Component, ref, defineComponent } from 'vue';
import useClickAway from '../index';
export default defineComponent({
  setup() {
    const count = ref(0);
    const eleRef = ref(null);
    useClickAway(eleRef, () => {
      count.value++;
    });
    return { eleRef, count };
  },
  render(_ctx) {
    return (
      <div>
        <button ref="eleRef">click away</button>
        <div>count:{_ctx.count}</div>
      </div>
    );
  },
}) as Component;
