<template>
  <div ref="eleRef">click me</div>
  <div>{{count}}</div>
</template>
<script lang="ts">
import { ref } from "vue";
import useEventListener from "../index";
export default {
  setup() {
    const count = ref(0);
    const eleRef= ref(null)
    const removeListener = useEventListener(eleRef,"click", () => {
      count.value++;
    });
    return { eleRef, count };
  }
};
</script>