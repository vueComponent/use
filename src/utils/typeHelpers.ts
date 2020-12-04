import { ComponentPublicInstance, ComponentInternalInstance } from 'vue';
export type ElementType = Element | ComponentPublicInstance;
export function isComponentPublicInstance(
  instance: ElementType,
): instance is ComponentPublicInstance {
  return (instance as ComponentPublicInstance).$ !== undefined;
}
