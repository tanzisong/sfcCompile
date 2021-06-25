type IData = INumber | IString | IBoolean | INull | IArray | IObject | IOp | IRef | ITmpl;

type INumber = number; // 数字类型

type IString = string; // 字符串类型

type IBoolean = boolean; // 布尔类型

type INull = null; // 空类型

type IArray = Array<IData>; // 数组类型

type IObject = Record<string, any>; // 对象类型

// 数据引用
interface IRef {
  __TYPE__: 1; // 类型
  path: Array<IData>; // 引用路径
}

// 函数调用
interface IOp {
  __TYPE__: 2; // 类型
  name: string; // 函数名
  args: Array<IData>; // 参数列表
}

// 模板字符串
interface ITmpl {
  __TYPE__: 3; // 类型
  expressions: Array<IData>; // 表达式列表
  quasis: Array<string>; // 字符串列表
}
