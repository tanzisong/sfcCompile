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

export interface ComponentDefinition {
  /**
   * 组件属性，若外部没有传入，则使用默认值
   */
  props?: DataType.UniObject;

  /**
   * 组件内部数据
   */
  data?: DataType.UniObject;

  /**
   * 组件内部方法
   */
  methods?: DataType.UniObject;

  /**
   * 组件内部事件
   */
  event?: DataType.UniObject;

  /**
   * 组件内部生命周期
   */
  lifetimes?: DataType.UniObject;

  /**
   * 组件插槽，对外暴露，若外部没有传入则使用默认值
   */
  slots?: Record<DataType.UniString, Array<Component>>;

  /**
   * 组件布局
   */
  content: Component;
}

export interface Application {
  /**
   * 页面id，作为页面的唯一标识
   */
  id: DataType.UniString;

  /**
   * 页面名称，用于作为渲染时页面的标题
   */
  name: DataType.UniString;

  /**
   * 页面入口，用于描述页面的具体结构
   */
  page: Component;

  /**
   * 页面数据，定义全局用到的动态数据，该数据可在运行时动态绑定和修改
   */
  data?: DataType.UniObject;

  /**
   * 方法定义，用于在DSL中注入自定义方法，方法可在全局使用
   */
  methods?: DataType.UniObject;

  /**
   * 事件定义
   */
  event?: DataType.UniObject;

  /**
   * 生命周期函数定义
   */
  lifetimes?: DataType.UniObject;

  /**
   * 组件定义，用于在DSL中注入自定义组件，组件可在全局使用
   */
  components?: Record<DataType.UniString, ComponentDefinition | string>;
}

export interface Component {
  /**
   * 组件id，作为组件节点的唯一标识
   */
  id: DataType.UniString;

  /**
   * 组件名称，决定渲染时调用哪个组件
   */
  name: DataType.UniString;

  /**
   * 组件属性，定义组件属性值
   */
  props?: DataType.UniObject;

  /**
   * 组件样式，定义组件样式值
   */
  style?: DataType.UniObject | React.CSSProperties;

  /**
   * 组件事件，定义组件事件的处理方法
   */
  event?: DataType.UniObject;

  /**
   * 条件渲染
   */
  $if?: DataType.UniJSON;

  /**
   * 列表渲染
   */
  $for?: {
    /**
     * 循环对象
     */
    data: DataType.UniJSON;
    /**
     * 循环项名称
     */
    item?: DataType.UniString;
    /**
     * 循环下标名称
     */
    index?: DataType.UniString;
  };

  /**
   * 组件插槽，一般用于带插槽的自定义组件
   */
  slots?: Record<DataType.UniString, Array<Component>>;

  /**
   * 组件子元素
   */
  children?: Array<Component>;
}
