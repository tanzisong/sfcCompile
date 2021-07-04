/// <reference types="@types/css" />

import { AttributeNode, baseParse, DirectiveNode, TemplateChildNode, TemplateNode } from '@vue/compiler-core';
import { parseStyle } from './parse/parseStyle';
import { scriptParse } from './parse/parseScript';
import { File } from '@babel/types';
import { Application, Component, ComponentDefinition, DataType } from './dsl';
import { assert, CompileTarget, isEmptyObject, removeKeyFromObj, shallowMerge, toHumpName, warn } from './utils/tools';
import { getRootProps, getParseTarget, getRootData, getRootMethods, getRootLifetimes, getRootEvent } from './utils/get';
import { GetTemplate, HandleProps, ToParseTemplateArr } from './types';

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
  private layoutTemplate!: TemplateNode;
  private scriptTemplate!: string;
  private componentDefaultProps: Record<DataType.UniString, Array<Component>> = {};

  get ParsedDSL() {
    return this.parsedDSL;
  }

  constructor(template: string) {
    this.templateCompile(template);
  }

  templateCompile(template: string) {
    const { children } = baseParse(template, {});

    const [layoutTemplate, scriptTemplate, styleTemplate] = getTemplate(children);
    assert(!!scriptTemplate, 'No script module');
    assert(!!layoutTemplate, 'No template module');

    this.layoutTemplate = layoutTemplate!;
    this.scriptTemplate = scriptTemplate!;
    this.originalParsedScript = scriptParse(scriptTemplate!);
    this.target = getParseTarget(this.originalParsedScript);

    if (styleTemplate) {
      this.styleMap = parseStyle(styleTemplate);
    }

    this.target === CompileTarget[CompileTarget.component] ? this.parseComponent() : this.parsePage();
  }

  /**
   * 解析page
   * */
  parsePage() {}

  /**
   * 解析component
   * */
  parseComponent() {
    const parsedDSL = {} as ComponentDefinition;

    parsedDSL.props = getRootProps(this.originalParsedScript); // 获取root props
    parsedDSL.data = getRootData(this.originalParsedScript); // 获取root data

    parsedDSL.methods = {};
    const methods = getRootMethods(this.originalParsedScript, this.scriptTemplate); // 获取root methods
    Object.entries(methods || {}).forEach(method => {
      parsedDSL.methods![method[0]] = {
        __TYPE__: 4,
        code: method[1] as string,
      };
    });

    parsedDSL.event = {};
    const events = getRootEvent(this.originalParsedScript, this.scriptTemplate); // 获取root event
    Object.entries(events || {}).forEach(event => {
      parsedDSL.event![event[0]] = {
        __TYPE__: 4,
        code: event[1] as string,
      };
    });

    const rootLiftTimes = getRootLifetimes(this.originalParsedScript, this.scriptTemplate); // 获取root 生命周期
    if (rootLiftTimes) {
      parsedDSL.lifetimes = {};
      if (rootLiftTimes.mounted) {
        parsedDSL.lifetimes.load = {
          __TYPE__: 4,
          code: rootLiftTimes.mounted,
        };
      }
    }

    const rootNodeView = this.layoutTemplate.tag;
    const rootNodeProps = this.handleNodeProps(this.layoutTemplate.props);
    const rootNodeChildren = this.parseChildren(this.layoutTemplate.children);

    parsedDSL.content = {
      id: '',
      name: rootNodeView,
      slots: this.componentDefaultProps,
      style: rootNodeProps.style,
      props: rootNodeProps.props,
      children: rootNodeChildren,
    };

    this.parsedDSL = parsedDSL;
  }

  /**
   * 遍历page和component内容部分
   * */
  private parseChildren(children: TemplateChildNode[]): Component[] {
    let parsedChildren: Component[] = [];

    children.forEach(child => {
      if (child.type === 1) {
        // 节点
        // PlainElementNode | ComponentNode | SlotOutletNode | TemplateNode

        const nodeProps = this.handleNodeProps(child.props);
        let nodeChildren: Component[] = [];

        if (child.children && child.children.length) {
          nodeChildren = this.parseChildren(child.children);
        }

        if (this.target === CompileTarget.component && child.tagType === 2) {
          // component slot as default slot and ignore children

          if (!nodeProps.name) {
            assert(false, `component: slot name is not found`);
            return;
          }
          this.componentDefaultProps[nodeProps.name] = nodeChildren;
          // 这里的props 中的name要变成slotName
          const handleNodeProps = {
            ...removeKeyFromObj(nodeProps, ['name']),
            slotName: nodeProps.name,
          } as DataType.UniObject;

          parsedChildren.push({
            id: '',
            name: child.tag,
            style: nodeProps.style,
            props: handleNodeProps,
          });
          return;
        }

        parsedChildren.push({
          id: '',
          name: child.tag,
          style: nodeProps.style,
          props: nodeProps.props,
          children: nodeChildren,
        });
      }

      // todo other node
      // NodeTypes.INTERPOLATION // => {{}}语法
      // child.type
    });

    return parsedChildren;
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

      if (n.type === 7) {
        // todo Dynamic bind props => 'bind', 'DirectiveNode' and so on
        return p;
      }

      // other static props
      return {
        ...p,
        [n.name]: n.value?.content,
      };
    }, {} as HandleProps & { classStyle: Record<any, any> });

    const otherProps = removeKeyFromObj(baseProps, ['style', 'classStyle']);

    return {
      style: {
        ...(baseProps.classStyle || {}),
        ...(baseProps.style || {}),
      },
      props: baseProps.props || {},
      ...otherProps,
    };
  }
}

export { Parser };
