/// <reference types="@types/css" />

import { AttributeNode, baseParse, DirectiveNode, TemplateChildNode, TemplateNode } from '@vue/compiler-core';
import { parseStyle } from './parse/parseStyle';
import { scriptParse } from './parse/parseScript';
import { File } from '@babel/types';
import { template } from './test';
import { Application, ComponentDefinition, DataType } from './dsl';
import { assert, CompileTarget, isEmptyObject, shallowMerge, toHumpName, warn } from './utils';
import { getRootProps, getParseTarget, getRootData, getRootMethods } from './utils/get';

// todo style补充一下React.cssXXX
type HandleProps = {
  props?: DataType.UniObject;
  style?: DataType.UniObject;
};

type ToParseTemplateArr = [TemplateNode | null, string | null, string | null];
type GetTemplate = (children: TemplateChildNode[]) => ToParseTemplateArr;
const getTemplate: GetTemplate = children => {
  const templateArr: ToParseTemplateArr = [null, null, null];

  children.map(templateChild => {
    if ('tag' in templateChild) {
      if (templateChild.tag === 'template') {
        // 布局
        templateArr[0] = templateChild.children[0] as TemplateNode;
      } else if (templateChild.tag === 'script') {
        // 逻辑
        const child = templateChild.children[0];
        'content' in child && (templateArr[1] = child.content as string);
      } else if (templateChild.tag === 'style') {
        // 样式
        const child = templateChild.children[0];
        'content' in child && (templateArr[2] = child.content as string);
      }
    }
  });

  return templateArr;
};

// TODO Parser代码过于多, 可以拆分一下
class Parser {
  private styleMap = new Map<string, Record<string, string>>();
  private originalParsedScript!: File;
  private target!: CompileTarget;
  private parsedDSL!: ComponentDefinition | Application;

  constructor(template: string) {
    this.templateCompile(template);
  }

  templateCompile(template: string) {
    const { children } = baseParse(template, {});

    const [layoutTemplate, scriptTemplate, styleTemplate] = getTemplate(children);
    assert(!!scriptTemplate, 'No script module');
    assert(!!layoutTemplate, 'No template module');

    console.info('layoutTemplate', layoutTemplate);

    this.originalParsedScript = scriptParse(scriptTemplate!);
    this.target = getParseTarget(this.originalParsedScript);

    console.info('this.originalParsedScript\n', this.originalParsedScript);

    if (styleTemplate) {
      this.styleMap = parseStyle(styleTemplate);
    }

    // const topProps = this.handleNodeProps(layoutTemplate?.props || []);

    this.target === CompileTarget[CompileTarget.component] ? this.parseComponent(layoutTemplate!, scriptTemplate!) : this.parsePage();
  }

  /**
   * 解析page
   * */
  parsePage() {}

  /**
   * 解析component
   * */
  parseComponent(layoutTemplate: TemplateNode, scriptTemplate: string) {
    // props => script中的props模块
    // data => script中的data(){return{}}模块
    // methods => script中的methods模块

    // event => todo
    // lifetimes => script中的onload
    // slots => 编译children的时候需要提取slots中的children,当做默认值
    // content

    // getRootProps(this.originalParsedScript); // 获取root props
    // getRootData(this.originalParsedScript) // 获取root data
    getRootMethods(this.originalParsedScript, scriptTemplate); // 获取root methods

    // this.parsedDSL
    // layoutTemplate
  }

  /**
   * 遍历page和component内容部分
   * */
  parseChildren(children: TemplateChildNode[]) {
    // children
  }

  /**
   * handle style and props
   * */
  private handleNodeProps(props: Array<AttributeNode | DirectiveNode>): HandleProps {
    let baseProps = props.reduce((p, n) => {
      if (n.name === 'class' && 'value' in n) {
        // 静态class
        const classNames = n.value?.content.split(' ');
        let classStyle = {};
        (classNames || []).forEach(className => {
          classStyle = {
            ...classStyle,
            ...(this.styleMap.get(className) || {}),
          };
        });
        classStyle = shallowMerge(p.classStyle, classStyle);

        return isEmptyObject(classStyle)
          ? p
          : {
              ...p,
              classStyle,
            };
      }

      if (n.name === 'style' && 'value' in n) {
        // 静态style
        let style: Record<string, string> = {};
        const styleString = n.value?.content;
        if (!styleString) {
          return p;
        }

        const styleItems = styleString.split(';');
        styleItems.forEach(item => {
          if (!item) return;

          const KV = /\s*(.+):\s*(.+)/.exec(item);
          warn(!!KV, `${item}解析失败`);

          style[toHumpName(KV![1])] = KV![2];
        });

        return isEmptyObject(style)
          ? p
          : {
              ...p,
              style,
            };
      }
      // todo bind and other props

      return {
        ...p,
      };
    }, {} as HandleProps & { classStyle: Record<any, any> });

    let returnProps: HandleProps = {};

    (baseProps.style || baseProps.classStyle) &&
      (returnProps.style = {
        ...(baseProps.classStyle || {}),
        ...(baseProps.style || {}),
      });

    baseProps.props && (returnProps.props = baseProps.props);

    return returnProps;
  }
}

new Parser(template);
