import { Component, ref } from "vue";
import useInViewport from "../index";
export default {
    setup() {
        let ele = ref(null)
        let inViewPort = useInViewport(ele)
        return { ele, inViewPort }

    },
    render: (_ctx) => (<div>
        <div ref='ele'>observer dom</div>
        <div style={{ marginTop: 70, color: _ctx.inViewPort ? '#87d068' : '#f50' }}>
            {_ctx.inViewPort === null ? "" : _ctx.inViewPort ? 'visible' : 'hidden'}
        </div>
    </div>)
} as Component