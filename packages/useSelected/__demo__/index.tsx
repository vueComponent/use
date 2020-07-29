import { Component, ref, reactive } from 'vue';
import useSelected from '../index';

let basedata = [
	{
		name: 'Add',
		toggle: false
	},
	{
		name: 'Bob',
		toggle: false
	},
	{
		name: 'Cathy',
		toggle: false
	}
];
export default {
	setup() {
		const eleRef = reactive(basedata);
		const tag = ref(false);
		const [ selectedLen, isAllselected, { unselectAll, selectOne, selectAll } ] = useSelected(eleRef, 'toggle');
		return { eleRef, selectedLen, isAllselected, unselectAll, selectAll, tag, selectOne };
	},
	render(_ctx) {
		return (
			<div>
				<button onClick={_ctx.isAllselected ? _ctx.unselectAll : _ctx.selectAll}>
					{_ctx.isAllselected ? '反选' : '全选'}
				</button>

				<h1>{_ctx.selectedLen}</h1>
				{_ctx.eleRef.map((item) => {
					return <div onClick={_ctx.selectOne.bind(this, item)}>{item.name}</div>;
				})}
			</div>
		);
	}
};
