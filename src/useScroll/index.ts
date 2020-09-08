import { Ref, ref } from "vue";
import useEventListener from "../useEventListener";
interface Position {
  left: number;
  top: number;
}
export default function useScroll(
  target: Ref<HTMLElement | Document | Window>
): Ref<Position> {
  const position = ref({ left: 0, top: 0 } as Position);
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
    position.value = newPosition;
  };
  const listener = (event: Event) => {
    if (!event.target) return;
    updatePosition(event.target as HTMLElement | Document);
  };
  useEventListener(target as Ref<HTMLElement | Document | Window>, {
    type: "scroll",
    listener,
  });

  return position;
}
