import { Component } from 'vue';
import useSize from '../index';
export default {
  setup() {
    const [size, elRef] = useSize();
    return () => (
      <div ref={elRef}>
        try to resize the preview window <br />
        dimensions -- width: {size.width} px, height: {size.height} px
      </div>
    );
  },
} as Component;
