import { Component, reactive } from "vue";
import { Form, Input } from "ant-design-vue";
import "ant-design-vue/dist/antd.min.css";
import useForm from "../index";
export default {
  setup() {
    const modelRef = reactive({
      name1: "",
      name2: "111",
    });
    const rulesRef = reactive({
      name1: [
        {
          required: true,
          message: "Please input Activity name",
        },
        {
          min: 3,
          max: 5,
          message: "Length should be 3 to 5",
        },
      ],
      name2: [
        {
          required: true,
          message: "Please input name2",
        },
      ],
    });
    let { resetFields, validateFields, validateInfo } = useForm(
      modelRef,
      rulesRef
      // { immediate: true }
    );
    const handleClick = (e) => {
      e.preventDefault();
      validateFields()
        .then((values) => {
          console.log(values);
        })
        .catch((err) => {
          console.log("error", err);
        });
    };
    const handleReset = (e) => {
      e.preventDefault();
      resetFields();
    };
    return () => (
      <Form>
        <Form.Item label="Activity name1" {...validateInfo.name1}>
          <Input v-model={[modelRef.name1, "value"]} />
        </Form.Item>
        <Form.Item label="Activity name2" {...validateInfo.name2}>
          <Input v-model={[modelRef.name2, "value"]} />
        </Form.Item>
        <button onClick={handleClick}>submit</button>
        <button onClick={handleReset}>reset</button>
      </Form>
    );
  },
} as Component;
