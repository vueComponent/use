import { ref, Ref, watchEffect } from "vue";

function useInViewport(target: Ref<HTMLElement>): Ref<boolean> | Ref<null> {
    const inViewPort = ref(null)
    let prevEl = null
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                inViewPort.value = true;
            } else {
                inViewPort.value = false;
            }
        }
    });
    watchEffect(() => {
        if (prevEl) {
            observer.disconnect();
        }
        if (target.value) {
            observer.observe((target as Ref<HTMLElement>).value);
        }
        prevEl = target.value
    })
    return inViewPort;
}

export default useInViewport;
