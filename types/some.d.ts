interface validateUtil {
  [key: string]: any;
}
declare module 'ant-design-vue/es/form/utils/validateUtil' {
  const validateRules: any;
  export { validateRules };
}

declare module 'ant-design-vue/es/form/utils/messages' {
  const defaultValidateMessages: any;
  export { defaultValidateMessages };
}

declare module 'ant-design-vue/es/form/utils/asyncUtil' {
  const allPromiseFinish: any;
  export { allPromiseFinish };
}
