import { ref, Ref, watchEffect, computed, ComputedRef } from '@vue/runtime-dom';
type IState = string | number | boolean | undefined;

export interface Actions<T = IState> {
	unselectAll: () => void;
	selectAll: () => void;
	selectOne: (value?: T) => void;
}

function useSelected<T>(list: T[], key: string = 'ckecked'): [Ref<number>, ComputedRef<boolean>, Actions<T>] {
	let count = ref(0);

	watchEffect(() => {
		count.value = list.filter((item) => item[key]).length;
	});
	let isAllselected = computed(() => {
		return count.value == list.length;
	});

	function selectAll() {
		list.map((item) => {
			item[key] = true;
		});
	}

	function selectOne(item: T) {
		item[key] = !item[key];
	}

	function unselectAll() {
		list.map((item) => {
			item[key] = false;
		});
	}
	let actions: Actions<T> = {
		unselectAll,
		selectOne,
		selectAll
	};
	return [ count, isAllselected, actions ];
}

export default useSelected;
