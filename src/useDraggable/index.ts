import { Ref, ref, watchEffect, HTMLAttributes } from 'vue';
import { isComponentPublicInstance, ElementType } from '../utils/typeHelpers';

export default function useDraggable(
  config: {
    target?: Ref<ElementType>;
    handle?: Ref<ElementType>;
    controlStyle?: boolean;
    viewport?: boolean;
    rectLimits?: {
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    };
  } = { controlStyle: true },
): [
  Ref<ElementType>,
  Ref<ElementType>,
  {
    getTargetProps: () => HTMLAttributes;
    dragging: Ref<boolean>;
    delta: Ref<{ x: number; y: number }>;
    resetState: () => void;
  },
] {
  const { target: configTarget, handle, controlStyle, viewport, rectLimits } = config;
  const targetRef = configTarget || ref<ElementType>(null);
  const handleRef = handle || ref<ElementType>(null);
  const dragging = ref(null);
  const prev = ref({ x: 0, y: 0 });
  const delta = ref({ x: 0, y: 0 });
  const initial = ref({ x: 0, y: 0 });
  const limits: Ref<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }> = ref(null);
  const targetEleRef = ref<HTMLElement>(null);
  const handleEleRef = ref<HTMLElement>(null);

  watchEffect(
    () => {
      if (!targetRef.value) {
        targetEleRef.value = null;
      } else {
        targetEleRef.value = isComponentPublicInstance(targetRef.value)
          ? targetRef.value.$el
          : targetRef.value;
      }
      if (!handleRef.value) {
        handleEleRef.value = null;
      } else {
        handleEleRef.value = isComponentPublicInstance(handleRef.value)
          ? handleRef.value.$el
          : handleRef.value;
      }
    },
    { flush: 'post' },
  );
  watchEffect(
    () => {
      const handle = handleEleRef.value || targetEleRef.value;
      if (!targetEleRef.value) return;
      handle.addEventListener('mousedown', startDragging);
      handle.addEventListener('touchstart', startDragging);
      return () => {
        handle.removeEventListener('mousedown', startDragging);
        handle.removeEventListener('touchstart', startDragging);
      };

      function startDragging(event) {
        event.preventDefault();
        dragging.value = true;
        const source = (event.touches && event.touches[0]) || event;
        const { clientX, clientY } = source;
        initial.value = { x: clientX, y: clientY };
        if (controlStyle) {
          targetEleRef.value.style.willChange = 'transform';
        }
        if (viewport || rectLimits) {
          const { left, top, width, height } = targetEleRef.value.getBoundingClientRect();

          if (viewport) {
            limits.value = {
              minX: -left + delta.value.x,
              maxX: window.innerWidth - width - left + delta.value.x,
              minY: -top + delta.value.y,
              maxY: window.innerHeight - height - top + delta.value.y,
            };
          } else {
            limits.value = {
              minX: rectLimits.left - left + delta.value.x,
              maxX: rectLimits.right - width - left + delta.value.x,
              minY: rectLimits.top - top + delta.value.y,
              maxY: rectLimits.bottom - height - top + delta.value.y,
            };
          }
        }
      }
    },
    { flush: 'post' },
  );

  watchEffect(
    () => {
      const handle = handleEleRef.value || targetEleRef.value;
      if (!targetEleRef.value) return;
      const reposition = function(event) {
        const source =
          (event.changedTouches && event.changedTouches[0]) ||
          (event.touches && event.touches[0]) ||
          event;
        const { clientX, clientY } = source;
        const x = clientX - initial.value.x + prev.value.x;
        const y = clientY - initial.value.y + prev.value.y;

        const newDelta = calcDelta({
          x,
          y,
          limits: limits.value,
        });
        delta.value = newDelta;

        return newDelta;
      };
      if (dragging.value) {
        document.addEventListener('mousemove', reposition, { passive: true });
        document.addEventListener('touchmove', reposition, { passive: true });
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
      }

      if (controlStyle) {
        handle.style.cursor = dragging.value ? 'grabbing' : 'grab';
      }

      return () => {
        if (controlStyle) {
          handle.style.cursor = 'unset';
        }
        document.removeEventListener('mousemove', reposition);
        document.removeEventListener('touchmove', reposition);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('touchend', stopDragging);
      };

      function stopDragging(event) {
        event.preventDefault();
        dragging.value = false;
        document.removeEventListener('mousemove', reposition);
        document.removeEventListener('touchmove', reposition);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('touchend', stopDragging);
        const newDelta = reposition(event);
        prev.value = newDelta;
        if (controlStyle) {
          targetEleRef.value.style.willChange = '';
        }
      }
    },
    { flush: 'post' },
  );

  watchEffect(
    () => {
      targetEleRef.value &&
        (targetEleRef.value.style.transform = `translate(${delta.value.x}px, ${delta.value.y}px)`);
    },
    { flush: 'post' },
  );

  const getTargetProps = () => ({
    'aria-grabbed': dragging.value || null,
  });

  const resetState = () => {
    delta.value = { x: 0, y: 0 };
    prev.value = { x: 0, y: 0 };
  };

  return [targetRef, handleRef, { getTargetProps, dragging, delta, resetState }];
}

function calcDelta({ x, y, limits }) {
  if (!limits) {
    return { x, y };
  }

  const { minX, maxX, minY, maxY } = limits;

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
}
