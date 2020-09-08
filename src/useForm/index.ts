import { reactive, watch, toRaw, nextTick } from '@vue/runtime-dom';
import cloneDeep from 'lodash-es/cloneDeep';
import intersection from 'lodash-es/intersection';
import { validateRules } from 'ant-design-vue/es/form/utils/validateUtil';
import { defaultValidateMessages } from 'ant-design-vue/es/form/utils/messages';
import { allPromiseFinish } from 'ant-design-vue/es/form/utils/asyncUtil';

function isRequired(rules: any[]) {
  let isRequired = false;
  if (rules && rules.length) {
    rules.every((rule: { required: any }) => {
      if (rule.required) {
        isRequired = true;
        return false;
      }
      return true;
    });
  }
  return isRequired;
}

function toArray(value) {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

type ValidateMessage = string | (() => string);
export interface ValidateMessages {
  default?: ValidateMessage;
  required?: ValidateMessage;
  enum?: ValidateMessage;
  whitespace?: ValidateMessage;
  date?: {
    format?: ValidateMessage;
    parse?: ValidateMessage;
    invalid?: ValidateMessage;
  };
  types?: {
    string?: ValidateMessage;
    method?: ValidateMessage;
    array?: ValidateMessage;
    object?: ValidateMessage;
    number?: ValidateMessage;
    date?: ValidateMessage;
    boolean?: ValidateMessage;
    integer?: ValidateMessage;
    float?: ValidateMessage;
    regexp?: ValidateMessage;
    email?: ValidateMessage;
    url?: ValidateMessage;
    hex?: ValidateMessage;
  };
  string?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  number?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  array?: {
    len?: ValidateMessage;
    min?: ValidateMessage;
    max?: ValidateMessage;
    range?: ValidateMessage;
  };
  pattern?: {
    mismatch?: ValidateMessage;
  };
}

export interface Props {
  [key: string]: any;
}

export interface validateOptions {
  validateFirst?: boolean;
  validateMessages?: ValidateMessages;
  trigger?: 'change' | 'blur' | string | string[];
}

type namesType = string | string[];

function useForm(
  modelRef: Props,
  rulesRef?: Props,
  options?: { immediate?: boolean; deep?: boolean },
): {
  modelRef: Props;
  rulesRef: Props;
  initialModel: Props;
  validateInfo: Props;
  resetFields: () => void;
  validate: (names?: string | string[], option?: validateOptions) => Promise<any>;
  validateField: (
    name?: string,
    value?: any,
    rules?: [Record<string, unknown>],
    option?: validateOptions,
  ) => Promise<any>;
} {
  const initialModel = cloneDeep(toRaw(modelRef));
  let validateInfo = {};
  Object.keys(initialModel).forEach(key => {
    validateInfo[key] = {
      autoLink: false,
      required: isRequired(rulesRef[key]),
    };
  });
  validateInfo = reactive(validateInfo);
  const resetFields = () => {
    Object.assign(modelRef, initialModel);
    nextTick(() => {
      Object.keys(validateInfo).forEach(key => {
        validateInfo[key] = {
          autoLink: false,
          required: isRequired(rulesRef[key]),
        };
      });
    });
  };
  const filterRules = (rules = [], trigger: string[]) => {
    if (!trigger.length) {
      return rules;
    } else {
      return rules.filter(rule => {
        const triggerList = toArray(rule.trigger || 'change');
        return intersection(triggerList, trigger).length;
      });
    }
  };
  let lastValidatePromise = null;
  const validateFields = (names: string[], option?: validateOptions) => {
    const promiseList = [];
    const values = {};
    names.forEach(name => {
      const value = modelRef[name];
      values[name] = value;
      const rules = filterRules(rulesRef[name], toArray(option && option.trigger));
      if (rules.length) {
        promiseList.push(
          validateField(name, value, rules, option || {})
            .then(() => ({
              name,
              errors: [],
            }))
            .catch((errors: any) =>
              Promise.reject({
                name,
                errors,
              }),
            ),
        );
      }
    });
    const summaryPromise = allPromiseFinish(promiseList);
    lastValidatePromise = summaryPromise;

    const returnPromise = summaryPromise
      .then(() => {
        if (lastValidatePromise === summaryPromise) {
          return Promise.resolve(values);
        }
        return Promise.reject([]);
      })
      .catch((results: any[]) => {
        const errorList = results.filter(
          (result: { errors: string | any[] }) => result && result.errors.length,
        );
        return Promise.reject({
          values: values,
          errorFields: errorList,
          outOfDate: lastValidatePromise !== summaryPromise,
        });
      });

    // Do not throw in console
    returnPromise.catch((e: any) => e);

    return returnPromise;
  };
  const validateField = (name: string, value: any, rules: any, option: validateOptions) => {
    const promise = validateRules(
      [name],
      value,
      rules,
      {
        validateMessages: defaultValidateMessages,
        ...option,
      },
      !!option.validateFirst,
    );
    validateInfo[name].validateStatus = 'validating';
    promise
      .catch((e: any) => e)
      .then((errors = []) => {
        if (validateInfo[name].validateStatus === 'validating') {
          validateInfo[name].validateStatus = errors.length ? 'error' : 'success';
          validateInfo[name].help = errors[0];
        }
      });
    return promise;
  };

  const validate = (names?: namesType, option?: validateOptions) => {
    let keys = [];
    if (!names) {
      keys = Object.keys(modelRef);
    } else if (Array.isArray(names)) {
      keys = names;
    } else {
      keys = [names];
    }
    return validateFields(keys, option).catch((e: any) => e);
  };

  watch(
    [modelRef, rulesRef],
    () => {
      validate('', { trigger: 'change' });
    },
    { immediate: options && !!options.immediate, deep: true },
  );

  return {
    modelRef,
    rulesRef,
    initialModel,
    validateInfo,
    resetFields,
    validate,
    validateField,
  };
}

export default useForm;
