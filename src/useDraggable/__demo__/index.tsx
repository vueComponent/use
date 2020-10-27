import { Component, defineComponent } from 'vue';
import useDraggable from '../index';
export default defineComponent({
    setup() {
        const [targetRef, handleRef, { delta }] = useDraggable({ controlStyle: true });
        return () => {
            return (
                <>
                    <div style="height:100px;width:100px;background: #999;" ref={targetRef}>
                        <button ref={handleRef}>handle</button>
                    </div>
                    <h2>{delta.value.x}</h2>
                    <h2>{delta.value.y}</h2>
                </>

            );
        };
    },
}) as Component;
