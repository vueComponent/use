import { Ref, ref, watch, watchEffect, WatchOptions, isRef } from "vue";
import useEventListener from "../useEventListener";
interface Position {
    left: number;
    top: number;
}
export default function useScroll(target: Ref<HTMLElement | Document | Window> | HTMLElement | Document | Window) {
    const position = ref({ left: 0, top: 0 } as Position)
    const isRefValue = isRef(target)
    const updatePosition = (currentTarget: HTMLElement | Document) => {
        let newPosition;
        if (currentTarget === document) {
            if (!document.scrollingElement) return;
            newPosition = {
                left: document.scrollingElement.scrollLeft,
                top: document.scrollingElement.scrollTop,
            };
        } else {
            newPosition = {
                left: (currentTarget as HTMLElement).scrollLeft,
                top: (currentTarget as HTMLElement).scrollTop,
            };
        }
        position.value = newPosition
    }
    const listener = (event: Event) => {
        if (!event.target) return;
        updatePosition(event.target as HTMLElement | Document);
    }
    if (isRefValue) {
        watchEffect(() => {
            useEventListener(target as Ref<HTMLElement | Document | Window>, { type: 'scroll', listener })
        }, { flush: 'post' })
    } else {
        (target as HTMLElement | Document | Window).addEventListener('scroll', listener)
    }

    return position
}   