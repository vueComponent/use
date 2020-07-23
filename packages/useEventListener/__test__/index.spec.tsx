import { shallowMount } from '@vue/test-utils';

import useEventListener from "../index";
import { ref } from "@vue/runtime-dom"

describe('useEventListener', () => {
    test('should work with custom eventListener and remove eventListener', async () => {
        const clickFn = jest.fn(() => { })
        const eleRef = ref(null)
        const removeListener = useEventListener(eleRef, "click", clickFn);
        const wrapper = shallowMount({
            setup() {
                return { eleRef };
            },
            render(_ctx) {
                return (
                    <>
                        <h1 ref='eleRef'>click</h1>
                    </>
                )
            }
        });
        await wrapper.vm.$nextTick()
        expect(clickFn).toHaveBeenCalledTimes(0);
        wrapper.find('h1').trigger('click')
        expect(clickFn).toHaveBeenCalledTimes(1);
        removeListener()
        wrapper.find('h1').trigger('click')
        expect(clickFn).toHaveBeenCalledTimes(1);
    });
})
