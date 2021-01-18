import { Component ,reactive,defineComponent} from 'vue';
import useTable from '../index';
import {Table} from 'ant-design-vue';
import { uniqueId } from 'lodash-es';
import 'ant-design-vue/dist/antd.css'
/**
 * 提供基础使用
 */
class Utils{
  static sleep (time = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }
}


async function mockApi (obj) {
  const { pageSize } = obj
  await Utils.sleep(500)
  const list = Array(pageSize).fill('').map(() => ({
    id       : uniqueId('id'),
    name     : `${uniqueId('name')}`,
    balabala : `${uniqueId('balabala')}`
  }))
  return { data: list, total: 800 }
}

export default defineComponent ( {
  setup() {
    const columns = reactive([
      { title: 'id', key: 'id', dataIndex: 'id',sorter:true },
      { title: 'name', dataIndex: 'name',sorter:true },
      { title: 'balabala', dataIndex: 'balabala',sorter:true }
    ])

    const state = reactive({
      pageInfo:{}
     })
    
    async function getTableData (pageValObj) {
      state.pageInfo = pageValObj
      const { data, total } = await mockApi(pageValObj)
      setSourceAndTotal(data, total)
    }
    const { setSourceAndTotal, tableState } = useTable({ getDataFn: getTableData })
    return { 
      columns,
      tableState,
      state
    }
  },
  render(_ctx) {
    return (
     <div style="display:flex;">
      <Table style="width:1200px;" columns={_ctx.columns} {..._ctx.tableState} ></Table>
      <pre>{JSON.stringify(_ctx.state.pageInfo,null,'\t')}</pre>
     </div>
    );
  },
} )as Component;
