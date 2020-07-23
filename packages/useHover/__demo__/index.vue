<script lang='ts'>
import { ref, Ref, Fragment, h } from "vue";
import useHover from "../index";
export default {
  setup() {
    const eleRef = ref(null);
    let { isHover } = useHover(eleRef, {
      onEnter: () => {
        console.log("onEnter");
      },
      onLeave: () => {
        console.log("onLeave");
      }
    });
    return {
      eleRef,
      isHover
    };
  },
  render(_ctx) {
    return h(Fragment, [h("h1", { ref: "eleRef" }, "move your mouse")]);
  }
};
</script>

<style scoped>
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
