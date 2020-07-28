import { ref, isRef, isReactive, Ref } from "@vue/runtime-dom";
type IState = string | number | boolean | undefined;

export interface Actions<T = IState> {
    setLeft: () => void;
    setRight: () => void;
    toggle: (value?: T) => void;
}

function useToggle<T = boolean | undefined>(): [Ref<boolean>, Actions<T>];

function useToggle<T = IState>(defaultValue: T): [Ref<T>, Actions<T>];

function useToggle<T = IState, U = IState>(
    defaultValue: T,
    reverseValue: U,
): [T | U, Actions<T | U>];

function useToggle<D extends IState = IState, R extends IState = IState>(
    defaultValue: D = false as D,
    reverseValue?: R | boolean,
) {
    reverseValue = reverseValue === undefined ? !defaultValue : reverseValue
    let stateRef = ref(defaultValue as any)
    function toggle(value?: D | R) {
        if (value === undefined) {
            stateRef.value = stateRef.value === defaultValue ? reverseValue : defaultValue
            return
        }
        if (value === defaultValue || value === reverseValue) {
            stateRef.value = value
        } else {
            stateRef.value = stateRef.value === defaultValue ? reverseValue : defaultValue
            console.warn(`Function toggle parameter must be ${defaultValue} or ${reverseValue}`)
        }
        return;
    }
    function setLeft() {
        stateRef.value = defaultValue
    };
    function setRight() {
        stateRef.value = reverseValue
    };
    const actions = {
        toggle,
        setLeft,
        setRight
    }
    return [stateRef, actions];
}

export default useToggle;
