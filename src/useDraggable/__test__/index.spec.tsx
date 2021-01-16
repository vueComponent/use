/* eslint-disable @typescript-eslint/no-empty-function */
import { mount } from '@vue/test-utils';

import useDraggable from '../index';
import { defineComponent, CSSProperties } from 'vue';

describe('drag', () => {
  let utils!: ReturnType<typeof setup>;
  beforeEach(() => {
    utils = setup();
  });

  describe('starting drag', async () => {
    it('should supply proper props to target', async () => {
      const { wrapper } = await utils;
      wrapper.find('#handle').trigger('mousedown');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[aria-grabbed]')).toBeTruthy;
    });

    it('should return a delta position', async () => {
      const startAt = { clientX: 10, clientY: 10 };
      const delta = { x: 5, y: 5 };
      const { drag, wrapper } = await utils;
      await drag({ start: startAt, delta });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#output').text()).toEqual(`${delta.x}, ${delta.y}`);
    });
    it('should return a correct delta position after more drag', async () => {
      const startAt = { clientX: 10, clientY: 10 };
      const delta = { x: 5, y: 5 };
      const secondStart = {
        clientX: startAt.clientX + delta.x,
        clientY: startAt.clientY + delta.y,
      };
      const { drag, wrapper } = await utils;
      await drag({ start: startAt, delta });
      await drag({
        start: secondStart,
        delta,
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('#output').text()).toEqual(`${2 * delta.x}, ${2 * delta.y}`);
    });
  });
});

describe('decorate with styles', async () => {
  let utils!: ReturnType<typeof setup>;
  beforeEach(() => {
    utils = setup({ useDraggableOption: { controlStyle: true } });
  });

  it("should change target's style when dragging", async () => {
    const { wrapper, drag } = await utils;

    await drag({
      start: { clientX: 3, clientY: 3 },
      delta: { x: 10, y: 15 },
    });

    expect((wrapper.find('#main').element as HTMLElement).style.transform).toEqual(
      `translate(10px, 15px)`,
    );
  });

  it("should change target's style when dragging (touches)", async () => {
    const { wrapper, drag } = await utils;

    await drag({
      start: { clientX: 3, clientY: 3 },
      delta: { x: 10, y: 15 },
      touch: true,
    });
    await wrapper.vm.$nextTick();
    expect((wrapper.find('#main').element as HTMLElement).style.transform).toEqual(
      `translate(10px, 15px)`,
    );
  });

  it('should set proper cursor', async () => {
    const { wrapper } = await utils;
    await wrapper.vm.$nextTick();
    expect((wrapper.find('#handle').element as HTMLElement).style.cursor).toEqual('grab');
  });

  it('should change cursor while dragging', async () => {
    const { wrapper } = await utils;
    wrapper.find('#handle').trigger('mousedown');
    await wrapper.vm.$nextTick();
    expect((wrapper.find('#handle').element as HTMLElement).style.cursor).toEqual('grabbing');
  });

  it('should add `will-change: transform` to target', async () => {
    const { wrapper } = await utils;
    wrapper.find('#handle').trigger('mousedown');
    expect((wrapper.find('#main').element as HTMLElement).style.willChange).toEqual('transform');
  });

  it('should remove `will-change: transform` from target', async () => {
    const { wrapper, drag } = await utils;
    await drag({
      start: { clientX: 3, clientY: 3 },
      delta: { x: 10, y: 15 },
    });
    expect((wrapper.find('#main').element as HTMLElement).style.willChange).toEqual('');
  });
});

describe('ending drag', () => {
  let utils!: ReturnType<typeof setup>;
  beforeEach(() => {
    utils = setup({ useDraggableOption: { controlStyle: true }, style: {} });
  });
  it('should supply proper props to target', async () => {
    const { drag, wrapper } = await utils;

    await drag();

    expect(wrapper.find('[aria-grabbed]')).toBeNull;
  });
});

describe('limit in viewport', async () => {
  let utils!: ReturnType<typeof setup>;
  beforeEach(() => {
    utils = setup({
      useDraggableOption: {
        controlStyle: true,
        viewport: true,
      },
      style: {
        ...defaultStyle,
        width: '180px',
        left: 'auto',
        right: '0',
      },
    });
  });

  it('should not change transition beyond given rect', async () => {
    const { drag, wrapper } = await utils;
    const targetElement = wrapper.find('#main').element as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const startAt = { clientX: rect.left + 5, clientY: rect.top + 5 };
    const delta = { x: 5, y: 5 };

    await drag({ start: startAt, delta });
    await wrapper.vm.$nextTick();
    expect(targetElement.style.transform).toContain(`translate(5px, 5px)`);
  });

  it('should leave transition as it was before limit', async () => {
    const { wrapper, beginDrag, move } = await utils;
    const targetElement = wrapper.find('#main').element as HTMLElement;

    const startAt = { clientX: 0 + 5, clientY: 0 + 5 };
    const delta = { x: 5, y: 1 };

    await beginDrag(startAt);
    await move({
      clientX: startAt.clientX + delta.x,
      clientY: startAt.clientY + delta.y,
    });
    await move({
      clientX: startAt.clientX + delta.x + 10,
      clientY: startAt.clientY + delta.y,
    });
    await move({
      clientX: startAt.clientX + delta.x + 25,
      clientY: startAt.clientY + delta.y,
    });
    await move({
      clientX: startAt.clientX + delta.x + 50,
      clientY: startAt.clientY + delta.y,
    });

    await wrapper.vm.$nextTick();
    expect(targetElement.style.transform).toContain(`translate(55px, 1px)`);
  });

  it('should keep limits when dragging more than once', async () => {
    const { drag, wrapper } = await utils;
    const targetElement = wrapper.find('#main').element as HTMLElement;
    targetElement.style.right = '50px';
    const startAt = { clientX: 5, clientY: 5 };
    const delta = { x: 15, y: 1 };

    await drag({ start: startAt, delta });
    await drag({
      start: {
        clientX: startAt.clientX + delta.x,
        clientY: startAt.clientY + delta.y,
      },
      delta: { x: 50, y: 0 },
    });

    await wrapper.vm.$nextTick();
    expect(targetElement.style.transform).toContain(`translate(65px, 1px)`);
  });
});

// describe('limit in rect', async () => {
//     const limits = {
//         left: 11,
//         right: window.innerWidth - 11,
//         top: 5,
//         bottom: window.innerHeight - 13
//     };

//     let utils!: ReturnType<typeof setup>
//     beforeEach(() => {
//         utils = setup({
//             useDraggableOption: {
//                 controlStyle: true,
//                 rectLimits: limits,
//             },
//             style: {
//                 ...defaultStyle,
//                 width: '180px',
//                 left: '20px'
//             }
//         });
//     });

//     it('should not change transition beyond given rect', async () => {
//         const { drag, wrapper } = await utils;
//         const targetElement = wrapper.find('#main').element as HTMLElement;
//         const rect = targetElement.getBoundingClientRect();
//         const startAt = { clientX: rect.left + 5, clientY: rect.top + 5 };
//         const delta = { x: -50, y: -90 };

//         await drag({ start: startAt, delta });
//         await wrapper.vm.$nextTick()
//         expect(targetElement.style.transform).toContain({
//             left: limits.left,
//             top: limits.top
//         });
//     });

//     it('should keep limits when dragging more than once', async () => {
//         const { drag, wrapper } = await utils;
//         const targetElement = wrapper.find('#main').element as HTMLElement;
//         targetElement.style.right = '50px';
//         targetElement.style.left = 'auto';
//         const rect = targetElement.getBoundingClientRect();

//         const startAt = { clientX: rect.left + 5, clientY: rect.top + 5 };
//         const delta = { x: 15, y: 1 };

//         drag({ start: startAt, delta });
//         drag({
//             start: {
//                 clientX: startAt.clientX + delta.x,
//                 clientY: startAt.clientY + delta.y
//             },
//             delta: { x: 50, y: 0 }
//         });

//         const { left, width } = targetElement.getBoundingClientRect();
//         expect(left).toEqual(limits.right - width);
//     });
// });

describe('reset drags', () => {
  let utils!: ReturnType<typeof setup>;
  beforeEach(() => {
    utils = setup({ useDraggableOption: { controlStyle: true } });
  });

  it('should start dragging from the original position', async () => {
    const { wrapper, drag } = await utils;
    await drag({ start: { clientX: 3, clientY: 5 }, delta: { x: 15, y: 20 } });
    wrapper.find('#reset').trigger('click');
    await wrapper.vm.$nextTick();
    expect((wrapper.find('#main').element as HTMLElement).style.transform).toEqual(
      'translate(0px, 0px)',
    );
  });

  describe('after reset', () => {
    it('should start dragging from the original position', async () => {
      const { wrapper, drag } = await utils;
      await drag({ start: { clientX: 3, clientY: 5 }, delta: { x: 15, y: 20 } });
      wrapper.find('#reset').trigger('click');
      await drag({ start: { clientX: 3, clientY: 5 }, delta: { x: 15, y: 20 } });
      expect((wrapper.find('#main').element as HTMLElement).style.transform).toEqual(
        'translate(15px, 20px)',
      );
    });
  });
});

describe('useDraggable', () => {
  test('starting drag', async () => {
    const [targetRef] = useDraggable({ controlStyle: true });
    mount({
      setup() {
        targetRef;
        return { targetRef };
      },
      render() {
        return (
          <>
            <h1
              ref={(ele: HTMLElement) => {
                targetRef.value = ele;
              }}
            >
              {' '}
              click{' '}
            </h1>
          </>
        );
      },
    });
  });
});
const Consumer = defineComponent({
  props: ['useDraggableOption', 'style'],
  setup(props: { useDraggableOption: Parameters<typeof useDraggable>[0]; style: CSSProperties }) {
    const [targetRef, handleRef, { getTargetProps, resetState, delta, dragging }] = useDraggable(
      props.useDraggableOption,
    );
    return () => (
      <div
        class="container"
        ref={targetRef}
        id="main"
        style={props.style || defaultStyle}
        {...getTargetProps()}
      >
        {dragging && <span>Dragging to:</span>}
        <output id="output">
          {delta.value.x}, {delta.value.y}
        </output>
        <button id="handle" class="handle" ref={handleRef}>
          handle
        </button>
        <button id="reset" onClick={resetState}>
          reset
        </button>
      </div>
    );
  },
});

const defaultStyle = { position: 'fixed', top: '11px', left: '11px' } as CSSProperties;
async function setup(
  props: { useDraggableOption: Parameters<typeof useDraggable>[0]; style?: CSSProperties } = {
    style: {},
    useDraggableOption: {},
  },
) {
  const wrapper = mount(
    <Consumer useDraggableOption={props.useDraggableOption} style={props.style} />,
  );
  async function drag({
    start = { clientX: 0, clientY: 0 },
    delta = { x: 0, y: 0 },
    touch = false,
  } = {}) {
    beginDrag(start, touch);
    await wrapper.vm.$nextTick();
    move(
      {
        clientX: start.clientX + delta.x,
        clientY: start.clientY + delta.y,
      },
      touch,
    );
    await wrapper.vm.$nextTick();
    endDrag(
      {
        clientX: start.clientX + delta.x,
        clientY: start.clientY + delta.y,
      },
      touch,
    );
  }

  async function beginDrag(start, touch = false) {
    const target = wrapper.find('#handle');
    if (touch) {
      const ev = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [createTouch({ target, ...start })],
      });
      target.element.dispatchEvent(ev);
    } else {
      target.trigger('mousedown', start);
    }
  }

  async function move(to, touch = false) {
    const target = wrapper.find('#handle');
    if (touch) {
      const ev = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [
          createTouch({
            target,
            ...to,
          }),
        ],
      });
      document.dispatchEvent(ev);
    } else {
      const ev = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        ...to,
      });
      document.dispatchEvent(ev);
    }
  }

  async function endDrag(end, touch = false) {
    const target = wrapper.find('#handle');
    if (touch) {
      const ev = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [
          createTouch({
            target,
            ...end,
          }),
        ],
      });
      document.dispatchEvent(ev);
    } else {
      const ev = new MouseEvent('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true,
        ...end,
      });
      document.dispatchEvent(ev);
    }
  }

  return {
    wrapper,
    beginDrag,
    move,
    drag,
  };
}

class Touch {
  constructor(touchInit: any) {
    this.altitudeAngle = touchInit.altitudeAngle;
    this.azimuthAngle = touchInit.azimuthAngle;
    this.clientX = touchInit.clientX;
    this.clientY = touchInit.clientY;
    this.force = touchInit.force;
    this.identifier = touchInit.identifier;
    this.pageX = touchInit.pageX;
    this.pageY = touchInit.pageY;
    this.radiusX = touchInit.radiusX;
    this.radiusY = touchInit.radiusY;
    this.rotationAngle = touchInit.rotationAngle;
    this.screenX = touchInit.screenX;
    this.screenY = touchInit.screenY;
    this.target = touchInit.target;
    this.touchType = touchInit.touchType;
  }
  readonly altitudeAngle: number;
  readonly azimuthAngle: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly force: number;
  readonly identifier: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly radiusX: number;
  readonly radiusY: number;
  readonly rotationAngle: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly target: EventTarget;
  readonly touchType: TouchType;
}
function createTouch({ target, ...rest }) {
  return new Touch({ identifier: Date.now(), target, ...rest });
}
