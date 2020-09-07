import { Component, ref } from "vue";
import useEventListener from "../index";
export default {
    setup() {
        const count = ref(0);
        const eleRef = ref(null)
        useEventListener(eleRef, {
            type: "click", listener: () => {
                count.value++;
            }
        });
        return { eleRef, count };
    },
    render(_ctx) {
        return (
            <>
                <div ref="eleRef">click me</div>
                <div>{_ctx.count}</div>
            </>
        )
    }
} as Component