import { mount } from '@vue/test-utils';

import useClickAway from "../index";
import { ref } from "@vue/runtime-dom"

describe('useClickAway', () => {
    test('should work with custom funtion', async () => {
        const fn = jest.fn(() => { })
        const eleRef = ref(null)
        const wrapRef = ref(null)
        let removeListener!: () => void
        const wrapper = mount({
            setup() {
                removeListener = useClickAway(eleRef, fn, 'click', wrapRef);
                return { eleRef, wrapRef };
            },
            render(_ctx) {
                return (
                    <div ref='wrapRef'>
                        <h1 ref='eleRef'></h1>
                        <h2>h2</h2>
                    </div>
                )

            }
        });
        await wrapper.vm.$nextTick()
        wrapper.find('h1').trigger('click')
        expect(fn).toHaveBeenCalledTimes(0);
        wrapper.find('h2').trigger('click')
        expect(fn).toHaveBeenCalledTimes(1);
        removeListener()
        wrapper.find('h2').trigger('click')
        expect(fn).toHaveBeenCalledTimes(1);
    });
})
