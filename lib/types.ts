import { DataType } from './dsl';
import { TemplateChildNode, TemplateNode } from '@vue/compiler-core';

// todo style补充一下React.cssXXX
type HandleProps = {
  props?: DataType.UniObject;
  style?: DataType.UniObject;
  name?: string;
};

type ToParseTemplateArr = [TemplateNode | null, string | null, string | null];
type GetTemplate = (children: TemplateChildNode[]) => ToParseTemplateArr;

export enum ElementTypes {
  ELEMENT = 0,
  COMPONENT = 1,
  SLOT = 2,
  TEMPLATE = 3,
}

export enum NodeTypes {
  ROOT = 0,
  ELEMENT = 1,
  TEXT = 2,
  COMMENT = 3,
  SIMPLE_EXPRESSION = 4,
  INTERPOLATION = 5,
  ATTRIBUTE = 6,
  DIRECTIVE = 7,
  COMPOUND_EXPRESSION = 8,
  IF = 9,
  IF_BRANCH = 10,
  FOR = 11,
  TEXT_CALL = 12,
  VNODE_CALL = 13,
  JS_CALL_EXPRESSION = 14,
  JS_OBJECT_EXPRESSION = 15,
  JS_PROPERTY = 16,
  JS_ARRAY_EXPRESSION = 17,
  JS_FUNCTION_EXPRESSION = 18,
  JS_CONDITIONAL_EXPRESSION = 19,
  JS_CACHE_EXPRESSION = 20,
  JS_BLOCK_STATEMENT = 21,
  JS_TEMPLATE_LITERAL = 22,
  JS_IF_STATEMENT = 23,
  JS_ASSIGNMENT_EXPRESSION = 24,
  JS_SEQUENCE_EXPRESSION = 25,
  JS_RETURN_STATEMENT = 26,
}

export { HandleProps, ToParseTemplateArr, GetTemplate };
