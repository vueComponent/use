import { Ref, isRef } from "vue";
import useEventListener from "../useEventListener";
// 鼠标点击事件，click 不会监听右键
const defaultEvent = 'click';

type EventType = MouseEvent | TouchEvent;

export default function useClickAway(
    ele: HTMLElement | Ref<HTMLElement>,
    onClickAway: (event: EventType) => void,
    eventName: string = defaultEvent,
    container: Document | HTMLElement | Ref<HTMLElement> = document
) {
    const eleIsRef = isRef(ele)
    function onClickAwayFn(e: any) {
        let dom = eleIsRef ? (ele as Ref<HTMLElement>).value : (ele as HTMLElement)
        if (!dom || dom.contains(e.target)) {
            return
        }
        onClickAway(e)
    }
    let removeListener!: ((...args: any) => any)
    if (isRef(container)) {
        removeListener = useEventListener(container, { type: eventName, listener: onClickAwayFn })
    } else {
        container.addEventListener(eventName, onClickAwayFn)
        removeListener = () => { container.removeEventListener(eventName, onClickAwayFn) }
    }
    return removeListener
}
