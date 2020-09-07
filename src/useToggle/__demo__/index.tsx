import { Component } from "vue";
import useToggle from "../index";
export default {
    setup() {
        let [toggleRef, { toggle, setLeft, setRight }] = useToggle();
        return {
            toggleRef,
            toggle,
            setLeft,
            setRight
        };
    },
    render: (_ctx) => {
        return (
            <div>
                <p>Effects：{_ctx.toggleRef.toString()}</p>
                <p>
                    <button type="button" onClick={_ctx.toggle}>Toggle</button>
                    <button type="button" onClick={_ctx.setLeft} style="margin-left:16px">Toggle False</button>
                    <button type="button" onClick={_ctx.setRight} style="margin-left:16px" > Toggle True</button >
                </p >
            </div >)
    }
} as Component