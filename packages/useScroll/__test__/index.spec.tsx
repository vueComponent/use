import { mount } from '@vue/test-utils';
import { ref } from "vue";
import useScroll from '../index';

describe('useScroll', () => {
    it('define', async () => {
        const elem = document.createElement('div')
        elem.style.height = '100px'
        if (document.body) {
            document.body.appendChild(elem)
        }
        const scroll = useScroll(ref(elem))
        const wrapper = mount({
            setup() {
                return {}
            },
            render() {
                return <h1 style={{ height: '999px' }}></h1>
            }
        }, {
            attachTo: elem
        })
        await wrapper.vm.$nextTick()
        // elem did not trigger scroll
        elem.scrollTop = 120
        await wrapper.vm.$nextTick()
        expect(scroll.value.left).toBe(0);
        expect(scroll.value.top).toBe(0);
    });
    // it('define2', async () => {
    //     const el = ref(null)
    //     const scroll = useScroll(el)
    //     const wrapper = mount({
    //         setup() {
    //             return { el }
    //         },
    //         render() {
    //             return (
    //                 <div ref='el' style='height:120px;overflow: scroll;'>
    //                     <h1 style='height:999px'>sad</h1>
    //                 </div>
    //             )
    //         }
    //     })
    //     await wrapper.vm.$nextTick()
    //     el.value.scrollTop = 100
    //     // elem did not trigger scroll
    //     await wrapper.vm.$nextTick()
    //     expect(scroll.value.left).toBe(0);
    //     expect(scroll.value.top).toBe(0);
    // });
});
