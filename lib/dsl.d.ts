export namespace DataType {
  /**
   * 统一渲染拓展的JSON数据
   */
  export type UniJSON = UniNumber | UniString | UniBoolean | UniNull | UniArray | UniObject | UniRef | UniFunc | UniTmpl | UniCode;

  /**
   * 数字
   */
  export type UniNumber = number;

  /**
   * 字符串
   */
  export type UniString = string;

  /**
   * 布尔值
   */
  export type UniBoolean = boolean;

  /**
   * 空值
   */
  export type UniNull = null;

  /**
   * 数组
   */
  export type UniArray = Array<UniJSON>;

  /**
   * 对象
   */
  export interface UniObject {
    [property: string]: UniJSON;
  }

  /**
   * 引用
   */
  export interface UniRef {
    __TYPE__: 1;

    path: Array<UniJSON>;
  }

  /**
   * 函数
   */
  export interface UniFunc {
    __TYPE__: 2;

    name: string;

    args: Array<UniJSON>;
  }

  /**
   * 模板
   */
  export interface UniTmpl {
    __TYPE__: 3;

    expressions: Array<UniJSON>;

    quasis: Array<string>;
  }

  /**
   * 代码
   */
  export interface UniCode {
    __TYPE__: 4;
    /**
     * 原始代码
     */
    code: string;
  }

  export interface Context {
    data: Record<string, any>;
    props?: Record<string, any>;

    methods: Record<string, Function>;
  }

  export interface Extra {
    [key: string]: any;
  }
}
