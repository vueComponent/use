import { shallowMount } from '@vue/test-utils';
import useHover from "../index";
import { ref } from "@vue/runtime-dom"

describe('useHover', () => {
    test('should work with custom event', async () => {
        const onEnter = jest.fn(() => { })
        const onLeave = jest.fn(() => { })
        const wrapper = shallowMount({
            setup() {
                const eleRef = ref(null)
                let [isHover] = useHover(eleRef, {
                    onEnter,
                    onLeave
                });
                return {
                    eleRef,
                    isHover
                };
            },
            render() {
                return (<h1 ref='eleRef'>move your mouse</h1>)
            }
        });
        await wrapper.vm.$nextTick()
        wrapper.find('h1').trigger('mouseenter')
        expect(onEnter).toHaveBeenCalled();
        expect(wrapper.vm.isHover).toBe(true)

        wrapper.find('h1').trigger('mouseleave')
        expect(onLeave).toHaveBeenCalled();
        expect(wrapper.vm.isHover).toBe(false)
    });

})
