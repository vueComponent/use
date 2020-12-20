/* eslint-disable @typescript-eslint/ban-ts-comment */
// i need use
import { onMounted, reactive, readonly as vueReadOnly } from 'vue';
import { defaultTableProps } from 'ant-design-vue/es/table/Table';

interface tableState {
  loading: boolean;
  dataSource: any[];
  rowKey: string;
  pagination: any;
  onChange(): typeof defaultTableProps.onChange;
}

interface useTableReturn {
  setSourceAndTotal: (soure: any[], total: number) => void;
  setPageSize: (pageSize: number) => void;
  searchTable: () => void;
  resetTable: () => void;
  setTableSource: (dataSource: any[]) => void;
  setTableTotal: (total: number) => any;
  // tableState: reactive<HTMLElement>;
}

interface useTableConfig {
  init?: boolean;
  pagination?: typeof defaultTableProps.pagination;
  pageNum?: string;
  pageSize?: string;
  sortField?: string;
  sortType?: string;
}
interface pageValObj {
  [pageNum: string]: number;
  // @ts-ignore
  [pageSize: string]: number;
  // @ts-ignore
  [sortField: string]: string;
  // @ts-ignore
  [sortType: string]: string;
}

interface useTableArg {
  config?: useTableConfig;
  getDataFn?: (pageValObj: pageValObj) => void;
  pagination?: typeof defaultTableProps.pagination | any;
}
function useTable({ config = {}, pagination = {}, getDataFn }: useTableArg = {}): useTableReturn {
  const baseConfig = {
    sortField: null,
    sortType: null,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    hideOnSinglePage: false,
    showTotal: (total, range) => `共 ${total} 条记录 第 ${range[0]} -${range[1]} 条`,
  };

  function change({ current, pageSize }, filters = {}, { field = null, order = null } = {}) {
    const sortType = order?.slice(0, order.length - 3) ?? null;
    const backOne = [
      tableState.pagination.pageSize !== pageSize,
      tableState.pagination.sortField !== field,
      tableState.pagination.sortType !== sortType,
    ].some(_ => _);
    if (backOne) {
      tableState.pagination.current = 1;
    } else {
      tableState.pagination.current = current;
    }
    tableState.pagination.pageSize = pageSize;
    tableState.pagination.sortField = field ?? null;
    tableState.pagination.sortType = sortType;
    getDataCallBack();
  }

  const tableState = reactive({
    loading: false,
    dataSource: [],
    rowKey: 'id',
    pagination: { ...baseConfig, ...pagination },
    onChange: change,
  });

  const {
    init = true,
    pageNum = 'pageNum',
    pageSize = 'pageSize',
    sortField = 'sortField',
    sortType = 'sortType',
  } = config;

  async function getDataCallBack() {
    tableState.loading = true;
    try {
      await getDataFn({
        [pageNum]: tableState.pagination.current,
        [pageSize]: tableState.pagination.pageSize,
        [sortField]: tableState.pagination.sortField ?? null,
        [sortType]: tableState.pagination.sortType ?? null,
      });
    } catch (error) {
      console.error(error);
    } finally {
      tableState.loading = false;
    }
  }

  onMounted(() => {
    if (init) {
      getDataCallBack();
    }
  });

  function setPageSize(num) {
    tableState.pagination.pageSize = num;
    getDataCallBack();
  }
  function searchTable() {
    setPageSize(1);
  }

  function resetTable() {
    tableState.pagination.current = 1;
    tableState.pagination.pageSize = pagination.pageSize ?? baseConfig.pageSize ?? 10;
    getDataCallBack();
  }

  function setTableSource(val) {
    tableState.dataSource = val;
  }
  function setTableTotal(total) {
    tableState.pagination.total = total;
  }

  function setSourceAndTotal(source, total) {
    setTableSource(source);
    setTableTotal(total);
  }

  return {
    setPageSize,
    searchTable,
    resetTable,
    setTableSource,
    setTableTotal,
    setSourceAndTotal,
    // tableState: vueReadOnly(tableState),
  };
}

export default useTable;
