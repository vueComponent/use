/* eslint-disable @typescript-eslint/no-empty-function */
import { shallowMount } from '@vue/test-utils';

import useEventListener from '../index';
import { ref } from 'vue';

describe('useEventListener', () => {
  test('should work with Ref<HTMLElement> parameter', async () => {
    const clickFn = jest.fn(() => {});
    const eleRef = ref(null);
    let removeListener!: () => void;
    const wrapper = shallowMount({
      setup() {
        removeListener = useEventListener(eleRef, {
          type: 'click',
          listener: clickFn,
        });
        return { eleRef };
      },
      render() {
        return (
          <>
            <h1 ref="eleRef">click</h1>
          </>
        );
      },
    });
    await wrapper.vm.$nextTick();
    expect(clickFn).toHaveBeenCalledTimes(0);
    wrapper.find('h1').trigger('click');
    expect(clickFn).toHaveBeenCalledTimes(1);
    removeListener();
    wrapper.find('h1').trigger('click');
    expect(clickFn).toHaveBeenCalledTimes(1);
  });
  test('should work with HTMLElement parameter', async () => {
    const clickFn = jest.fn(() => {});
    const eleRef = ref(null);
    let removeListener!: () => void;
    const wrapper = shallowMount({
      setup() {
        removeListener = useEventListener(eleRef, {
          type: 'click',
          listener: clickFn,
        });
        return { eleRef };
      },
      render() {
        return (
          <>
            <h1 ref="eleRef">click</h1>
          </>
        );
      },
    });
    await wrapper.vm.$nextTick();
    expect(clickFn).toHaveBeenCalledTimes(0);
    wrapper.find('h1').trigger('click');
    expect(clickFn).toHaveBeenCalledTimes(1);
    removeListener();
    wrapper.find('h1').trigger('click');
    expect(clickFn).toHaveBeenCalledTimes(1);
  });
});
