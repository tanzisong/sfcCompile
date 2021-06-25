import { transform } from '@babel/standalone';
import {
  ExportDefaultDeclaration,
  File,
  ObjectExpression,
  ObjectProperty,
  StringLiteral,
  NumericLiteral,
  BooleanLiteral,
  NullLiteral,
  ArrayExpression,
  ObjectMethod,
  ReturnStatement,
} from '@babel/types';
import { assert, CompileTarget } from './tools';

type ObjectValue = ArrayExpression | StringLiteral | NumericLiteral | NullLiteral | BooleanLiteral | ObjectExpression;
enum RootPropName {
  name = 'name',
  props = 'props',
  data = 'data',
  methods = 'methods',
  event = 'event',
  mounted = 'mounted',
}

/**
 * 获取编译目标
 * */
function getParseTarget(originalParsedScript: File): CompileTarget {
  const statement = originalParsedScript.program.body[0];
  assert(statement.type === 'ExportDefaultDeclaration', 'There is no correct export in script');

  const declaration = (statement as ExportDefaultDeclaration).declaration;
  assert(declaration.type === 'ObjectExpression', 'the export is not an object');

  const properties = (declaration as ObjectExpression).properties;
  const propertiesItem = properties.find(_ => 'key' in _ && 'name' in _.key && _.key.name === 'name');
  assert(!!propertiesItem, 'The attribute name is undefined');

  const value = (propertiesItem as ObjectProperty).value;
  const name = (value as StringLiteral).value;
  assert(!!name && (name === CompileTarget['component'] || name === CompileTarget['page']), 'the name is not component or page String;');

  return (name as unknown) as CompileTarget;
}

/**
 * 获取sfc中props部分
 * todo catch报错
 * */
function getRootProps(originalParsedScript: File): Record<string, any> | void {
  const propertiesItemProps = getRootPropertiesItem(originalParsedScript, RootPropName.props);
  if (!propertiesItemProps) return;

  if ('value' in propertiesItemProps && propertiesItemProps.value.type === 'ObjectExpression') {
    return getProperties(propertiesItemProps.value);
  }

  assert(false, '不兼容的props数据结构');
}

/**
 * 获取sfc中data部分
 * todo catch报错
 * */
function getRootData(originalParsedScript: File): Record<string, any> | void {
  const propertiesItemData = getRootPropertiesItem(originalParsedScript, RootPropName.data);
  if (!propertiesItemData) return;

  if (propertiesItemData.type !== 'ObjectMethod') {
    assert(false, 'data is not an function');
  }

  const ReturnStatement = (propertiesItemData as ObjectMethod).body.body.find(item => item.type === 'ReturnStatement');
  if (!ReturnStatement) return;
  const argument = (ReturnStatement as ReturnStatement).argument;

  if (argument?.type === 'ObjectExpression') {
    return getProperties(argument);
  }
}

/**
 * 获取sfc中methods部分
 * */
function getRootMethods(originalParsedScript: File, scriptTemplate: string): Record<string, any> | void {
  const a = transform(
    `function a(params = 1, params2 = 2, params3 = 'sss') {
    const a1 = [1, 2, 3];
    let c = 11;
    const b = params + params2;
    return [...a1, b, c]
  }`,
    { presets: ["es2015-no-commonjs"] },
  );

  console.info('aas1s', a);

  const propertiesItemMethods = getRootPropertiesItem(originalParsedScript, RootPropName.methods);
  if (!propertiesItemMethods) {
    return;
  }

  console.info('propertiesItemMethods\n', propertiesItemMethods);
  if ('value' in propertiesItemMethods) {
    if (propertiesItemMethods.value.type !== 'ObjectExpression') {
      assert(false, 'the methods is not an object');
      return;
    }

    const methods: Record<string, string> = {};

    propertiesItemMethods.value.properties.forEach(method => {
      // todo ObjectProperty ArrowFunctionExpression

      if (method.type === 'ObjectMethod') {
        if ('name' in method.key) {
          methods[method.key.name] = '';
        }
      }
    });
  }
}

function getRootPropertiesItem(originalParsedScript: File, name: RootPropName) {
  const statement = originalParsedScript.program.body[0];
  const declaration = (statement as ExportDefaultDeclaration).declaration;
  const properties = (declaration as ObjectExpression).properties;
  return properties.find(_ => 'key' in _ && 'name' in _.key && _.key.name === name);
}

function getProperties(value: ObjectExpression) {
  let object: Record<any, any> = {};

  value.properties.forEach(v => {
    // 必须是键值对格式, 不支持省略(比如{a,b:1})
    if ('value' in v) {
      if ('name' in v.key) {
        object[v.key.name] = getPropertiesItem(v.value as ObjectValue);
      }
    }
  });

  return object;
}

/**
 * 支持null string number boolean array object
 * */
function getPropertiesItem(value: ObjectValue) {
  if (value.type === 'StringLiteral') {
    return value.value;
  }

  if (value.type === 'NullLiteral') {
    return null;
  }

  if (value.type === 'NumericLiteral') {
    return value.value;
  }

  if (value.type === 'BooleanLiteral') {
    return value.value;
  }

  if (value.type === 'ArrayExpression') {
    return getPropertiesItemValue(value.elements as Array<ObjectValue>);
  }

  if (value.type === 'ObjectExpression') {
    return getProperties(value);
  }

  assert(false, '暂时只支持null string number boolean array object类型的属性值');
}

function getPropertiesItemValue(value: Array<ObjectValue>) {
  let arr: Array<any> = [];
  value.forEach(v => {
    arr.push(getPropertiesItem(v));
  });

  return arr;
}

export { getParseTarget, getRootProps, getRootData, getRootMethods };
