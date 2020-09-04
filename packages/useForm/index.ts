import { reactive, watch, toRaw, nextTick } from "@vue/runtime-dom";
import cloneDeep from "lodash-es/cloneDeep";
import { validateRules } from "ant-design-vue/es/form/utils/validateUtil";
import { defaultValidateMessages } from "ant-design-vue/es/form/utils/messages";
import { allPromiseFinish } from "ant-design-vue/es/form/utils/asyncUtil";

function isRequired(rules) {
  let isRequired = false;
  if (rules && rules.length) {
    rules.every((rule) => {
      if (rule.required) {
        isRequired = true;
        return false;
      }
      return true;
    });
  }
  return isRequired;
}

export interface Props {
  [key: string]: any;
}

function useForm(
  modelRef: Props,
  rulesRef?: Props,
  options?: { immediate?: boolean }
): {
  modelRef: Props;
  rulesRef: Props;
  initialModel: Props;
  validateInfo: Props;
  resetFields: () => void;
  validateField: (
    name?: string,
    value?: any,
    rules?: [object],
    option?: object
  ) => Promise<any>;
  validateFields: (modelRef?: Props, option?: object) => Promise<any>;
} {
  const initialModel = cloneDeep(toRaw(modelRef));
  let validateInfo = {};
  Object.keys(initialModel).forEach((key) => {
    validateInfo[key] = {
      autoLink: false,
      required: isRequired(rulesRef[key]),
    };
  });
  validateInfo = reactive(validateInfo);
  const resetFields = () => {
    Object.assign(modelRef, initialModel);
    nextTick(() => {
      Object.keys(validateInfo).forEach((key) => {
        validateInfo[key] = {
          autoLink: false,
          required: isRequired(rulesRef[key]),
        };
      });
    });
  };
  let lastValidatePromise = null;
  const validateFields = (model = modelRef, option?: object) => {
    const promiseList = [];
    Object.keys(model).forEach((name) => {
      const value = model[name];
      const rules = rulesRef[name];
      if (rules && rules.length) {
        promiseList.push(
          validateField(name, value, rules, option || {})
            .then(() => ({
              name,
              errors: [],
            }))
            .catch((errors) =>
              Promise.reject({
                name,
                errors,
              })
            )
        );
      }
    });
    const summaryPromise = allPromiseFinish(promiseList);
    lastValidatePromise = summaryPromise;

    const returnPromise = summaryPromise
      .then(() => {
        if (lastValidatePromise === summaryPromise) {
          return Promise.resolve(toRaw(model));
        }
        return Promise.reject([]);
      })
      .catch((results) => {
        const errorList = results.filter(
          (result) => result && result.errors.length
        );
        return Promise.reject({
          values: toRaw(model),
          errorFields: errorList,
          outOfDate: lastValidatePromise !== summaryPromise,
        });
      });

    // Do not throw in console
    returnPromise.catch((e) => e);

    return returnPromise;
  };
  const validateField = (name, value, rules, option) => {
    const promise = validateRules(
      [name],
      value,
      rules,
      {
        validateMessages: defaultValidateMessages,
        ...option,
      },
      !!option.validateFirst
    );
    validateInfo[name].validateStatus = "validating";
    promise
      .catch((e) => e)
      .then((errors = []) => {
        if (validateInfo[name].validateStatus === "validating") {
          validateInfo[name].validateStatus = errors.length
            ? "error"
            : "success";
          validateInfo[name].help = errors[0];
        }
      });
    return promise;
  };

  watch(
    [modelRef, rulesRef],
    () => {
      validateFields();
    },
    { immediate: options && !!options.immediate }
  );

  return {
    modelRef,
    rulesRef,
    initialModel,
    validateInfo,
    resetFields,
    validateField,
    validateFields,
  };
}

export default useForm;
