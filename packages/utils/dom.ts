import { Ref } from "vue";
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | Ref
  | Ref<T | null | undefined>;

type TargetElement = HTMLElement | Document | Window | Ref;

export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | undefined | null;

  if (typeof target === "function") {
    targetElement = target();
  } else {
    targetElement = target;
  }

  return targetElement;
}
