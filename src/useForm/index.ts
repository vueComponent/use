import { reactive, watch, nextTick } from 'vue';
import cloneDeep from 'lodash-es/cloneDeep';
import intersection from 'lodash-es/intersection';
import isEqual from 'lodash-es/isEqual';
import debounce from 'lodash-es/debounce';
import omit from 'lodash-es/omit';
import { validateRules } from 'ant-design-vue/es/form/utils/validateUtil';
import { defaultValidateMessages } from 'ant-design-vue/es/form/utils/messages';
import { allPromiseFinish } from 'ant-design-vue/es/form/utils/asyncUtil';
import { tuple } from 'ant-design-vue/es/_util/type';

interface DebounceSettings {
  leading?: boolean;

  wait?: number;

  trailing?: boolean;
}

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

const validateStatus = tuple('', 'success', 'warning', 'error', 'validating');
export type ValidateStatus = typeof validateStatus[number];

type namesType = string | string[];
export interface validateInfo {
  autoLink?: boolean;
  required?: boolean;
  validateStatus?: ValidateStatus;
  help?: string;
}

export interface validateInfos {
  [key: string]: validateInfo;
}

function getPropByPath(obj: Props, path: string, strict: boolean) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  const keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid name path to validate!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null,
    isValid: tempObj && keyArr[i] in tempObj,
  };
}

function useForm(
  modelRef: Props,
  rulesRef?: Props,
  options?: {
    immediate?: boolean;
    deep?: boolean;
    validateOnRuleChange?: boolean;
    debounce?: DebounceSettings;
  },
): {
  modelRef: Props;
  rulesRef: Props;
  initialModel: Props;
  validateInfos: validateInfos;
  resetFields: (newValues?: Props) => void;
  validate: <T = any>(names?: namesType, option?: validateOptions) => Promise<T>;
  validateField: <T = any>(
    name?: string,
    value?: any,
    rules?: [Record<string, unknown>],
    option?: validateOptions,
  ) => Promise<T>;
  mergeValidateInfo: (items: validateInfo | validateInfo[]) => validateInfo;
  clearValidate: (names?: namesType) => void;
} {
  const initialModel = cloneDeep(modelRef);
  let validateInfos: validateInfos = {};

  Object.keys(rulesRef).forEach(key => {
    validateInfos[key] = {
      autoLink: false,
      required: isRequired(rulesRef[key]),
    };
  });
  validateInfos = reactive(validateInfos);
  const resetFields = (newValues: Props) => {
    Object.assign(modelRef, {
      ...cloneDeep(initialModel),
      ...newValues,
    });
    //modelRef = resetReactiveValue(initialModel, modelRef);
    nextTick(() => {
      Object.keys(validateInfos).forEach(key => {
        validateInfos[key] = {
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
  const validateFields = (names: string[], option: validateOptions = {}, strict: boolean) => {
    const promiseList = [];
    const values = {};
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const prop = getPropByPath(modelRef, name, strict);
      if (!prop.isValid) continue;
      values[name] = prop.v;
      const rules = filterRules(rulesRef[name], toArray(option && option.trigger));
      if (rules.length) {
        promiseList.push(
          validateField(name, prop.v, rules, option || {})
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
    }

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
  const validateField = <T extends unknown = any>(
    name: string,
    value: any,
    rules: any,
    option: validateOptions,
  ): Promise<T> => {
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
    validateInfos[name].validateStatus = 'validating';
    promise
      .catch((e: any) => e)
      .then((errors = []) => {
        if (validateInfos[name].validateStatus === 'validating') {
          validateInfos[name].validateStatus = errors.length ? 'error' : 'success';
          validateInfos[name].help = errors[0];
        }
      });
    return promise;
  };

  const validate = <T extends unknown = any>(
    names?: namesType,
    option?: validateOptions,
  ): Promise<T> => {
    let keys = [];
    let strict = true;
    if (!names) {
      strict = false;
      keys = Object.keys(rulesRef);
    } else if (Array.isArray(names)) {
      keys = names;
    } else {
      keys = [names];
    }
    const promises = validateFields(keys, option || {}, strict);
    // Do not throw in console
    promises.catch((e: any) => e);
    return promises;
  };

  const clearValidate = (names?: namesType) => {
    let keys = [];
    if (!names) {
      keys = Object.keys(rulesRef);
    } else if (Array.isArray(names)) {
      keys = names;
    } else {
      keys = [names];
    }
    keys.forEach(key => {
      validateInfos[key] &&
        Object.assign(validateInfos[key], {
          validateStatus: '',
          help: '',
        });
    });
  };

  const mergeValidateInfo = (items = []) => {
    const info = { autoLink: false } as validateInfo;
    const help = [];
    const infos = Array.isArray(items) ? items : [items];
    for (let i = 0; i < infos.length; i++) {
      const arg = infos[i] as validateInfo;
      if (arg?.validateStatus === 'error') {
        info.validateStatus = 'error';
        arg.help && help.push(arg.help);
      }
      info.required = info.required || arg?.required;
    }
    info.help = help.join('\n');
    return info;
  };
  let oldModel = initialModel;
  const modelFn = (model: { [x: string]: any }) => {
    const names = [];
    Object.keys(rulesRef).forEach(key => {
      const prop = getPropByPath(model, key, false);
      const oldProp = getPropByPath(oldModel, key, false);
      if (!isEqual(prop.v, oldProp.v)) {
        names.push(key);
      }
    });
    validate(names, { trigger: 'change' });
    oldModel = cloneDeep(model);
  };
  const debounceOptions = options?.debounce;
  watch(
    modelRef,
    debounceOptions && debounceOptions.wait
      ? debounce(modelFn, debounceOptions.wait, omit(debounceOptions, ['wait']))
      : modelFn,
    { immediate: options && !!options.immediate, deep: true },
  );

  watch(
    rulesRef,
    () => {
      if (options && options.validateOnRuleChange) {
        validate();
      }
    },
    { deep: true },
  );

  return {
    modelRef,
    rulesRef,
    initialModel,
    validateInfos,
    resetFields,
    validate,
    validateField,
    mergeValidateInfo,
    clearValidate,
  };
}

export default useForm;
