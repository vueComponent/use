import { shallowMount } from '@vue/test-utils';

import useReactiveRef from "../index";
import { ref } from "@vue/runtime-dom"

describe('useReactiveRef', () => {
    test('should work with custom event', async () => {
        const [eleRef, setEle] = useReactiveRef()
        const showH1 = ref(false)
        const wrapper = shallowMount({
            setup() {
                return () => (
                    <>
                        {showH1.value ? (<h1 ref={setEle}></h1>) : null}
                        <h1 ref="setEle"></h1>
                    </>
                )
            }
        });
        expect(eleRef.value).toEqual(null)
        showH1.value = true
        await wrapper.vm.$nextTick()
        expect(eleRef.value).toBe(wrapper.find('h1').element)
    });

})
