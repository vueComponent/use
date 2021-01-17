import { Component, reactive, toRaw } from 'vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Form, Input, Select } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.min.css';
import useForm from '../index';
export default {
  setup() {
    const modelRef = reactive({
      name1: '',
      name2: '111',
      obj: {
        //嵌套数据
        test: [],
      },
    });
    const rulesRef = reactive({
      name1: [
        {
          required: true,
          message: 'Please input Activity name',
        },
        {
          min: 3,
          max: 5,
          message: 'Length should be 3 to 5',
          trigger: 'blur',
        },
      ],
      name2: [
        {
          required: true,
          message: 'Please input name2',
        },
      ],
      'obj.test': [
        {
          required: true,
          message: 'Please select',
          type: 'array',
        },
      ],
    });
    const {
      resetFields,
      validate,
      validateInfos,
      mergeValidateInfo,
      clearValidate,
    } = useForm(modelRef, rulesRef, { debounce: { wait: 300 } });
    const handleClick = e => {
      e.preventDefault();
      validate()
        .then(() => {
          console.log(toRaw(modelRef));
        })
        .catch(err => {
          console.log('error', err);
        });
    };
    const handleReset = e => {
      e.preventDefault();
      resetFields();
    };
    const clearValidateAll = () => {
      clearValidate();
    };
    const clearValidateName1 = name => {
      clearValidate(name);
    };
    const handleResetWithValues = e => {
      e.preventDefault();
      resetFields({
        name2: 'updated values',
      });
    };
    return () => (
      <Form>
        <Form.Item
          label="Activity name1"
          {...mergeValidateInfo([validateInfos.name1, validateInfos.name2])}
        >
          <Input v-model={[modelRef.name1, 'value']} onBlur={() => validate('name1')} />
        </Form.Item>
        <Form.Item label="Activity name2" {...validateInfos.name2}>
          <Input v-model={[modelRef.name2, 'value']} />
        </Form.Item>
        <Form.Item label="test" {...validateInfos['obj.test']}>
          <Select
            v-model={[modelRef.obj.test, 'value']}
            mode="multiple"
            style="width: 300px"
            onBlur={console.log}
            onFocus={console.log}
          >
            <Select.Option value="china">
              <div>
              <span role="img" aria-label="China">
                🇨🇳
              </span>
              China (中国)
              </div>
            </Select.Option>
            <Select.Option value="usa">
              <div>
              <span role="img" aria-label="USA">
                🇺🇸
              </span>
              USA (美国)
              </div>
            </Select.Option>
          </Select>
        </Form.Item>
        <button onClick={handleClick}>submit</button>
        <button onClick={handleReset}>reset</button>
        <button onClick={handleResetWithValues}>reset with new updated Values</button>
        <button onClick={handleReset}>reset</button>
        <button onClick={clearValidateAll}>clearValidateAll</button>
        <button onClick={() => clearValidateName1('name1')}>clearValidateName1</button>
      </Form>
    );
  },
} as Component;
