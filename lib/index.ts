/// <reference types="@types/css" />

import {AttributeNode, baseParse, DirectiveNode, TemplateChildNode, TemplateNode} from '@vue/compiler-core';
import {parseStyle} from './parse/parseStyle';
import {scriptParse} from './parse/parseScript';
import {
	File,
	ExportDefaultDeclaration,
	ObjectExpression,
	ObjectProperty,
	StringLiteral
} from '@babel/types';
import {template} from './test';
import { DataType } from './dsl.d'
import {isEmptyObject, shallowMerge, assert, CompileTarget, warn, toHumpName} from './utils'

// todo style补充一下React.cssXXX
type HandleProps = {
	props?: DataType.UniObject,
	style?: DataType.UniObject
}

type ToParseTemplateArr = [TemplateNode | null, string | null, string | null];
type GetTemplate = (children: TemplateChildNode[]) => ToParseTemplateArr;
const getTemplate: GetTemplate = (children) => {
	const templateArr: ToParseTemplateArr = [null, null, null];

	children.map((templateChild) => {
		if ('tag' in templateChild) {
			if (templateChild.tag === "template") {
				// 布局
				templateArr[0] = templateChild.children[0] as TemplateNode;
			} else if (templateChild.tag === "script") {
				// 逻辑
				const child = templateChild.children[0];
				('content' in child) && (templateArr[1] = (child.content as string))
			} else if (templateChild.tag === "style") {
				// 样式
				const child = templateChild.children[0];
				('content' in child) && (templateArr[2] = (child.content as string))
			}
		}
	});

	return templateArr;
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
	const propertiesItem = properties.find((_) => ('key' in _) && ('name' in _.key) && _.key.name === 'name');
	assert(!!propertiesItem, 'The attribute name is undefined');

	const value = (propertiesItem as ObjectProperty).value;
	const name = (value as StringLiteral).value;
	assert((!!name && (name === CompileTarget[CompileTarget["component"]] || name === CompileTarget[CompileTarget["page"]])), 'the name is not component or page String');

	return name as unknown as CompileTarget;
}

class Parser {
	styleMap = new Map<string, Record<string, string>>();
	originalParsedScript!: File;
	target!: CompileTarget;

	constructor(template: string) {
		this.templateCompile(template);
	}

	templateCompile(template: string) {
		const {children} = baseParse(template, {});

		const [layoutTemplate, scriptTemplate, styleTemplate] = getTemplate(children);
		console.assert(!!scriptTemplate, 'No script module');

		console.info('layoutTemplate', layoutTemplate);

		this.originalParsedScript = scriptParse(scriptTemplate!)
		this.target = getParseTarget(this.originalParsedScript)

		if (styleTemplate) {
			this.styleMap = parseStyle(styleTemplate);
		}

		const topProps = this.handleTemplateProps(layoutTemplate?.props || []);
		console.info('topProps', topProps);
	}

	/**
	 * handle style and props
	 * */
	private handleTemplateProps(props: Array<AttributeNode | DirectiveNode>): HandleProps {
		let baseProps = props.reduce((p, n) => {
			if (n.name === 'class' && 'value' in n) {
				// 静态class
				const classNames = n.value?.content.split(' ');
				let classStyle = {};
				(classNames || []).forEach(className => {
					classStyle = {
						...classStyle,
						...(this.styleMap.get(className) || {})
					}
				})
				classStyle = shallowMerge(p.classStyle, classStyle)

				return isEmptyObject(classStyle) ? p : {
					...p,
					classStyle,
				}
			}

			if (n.name === 'style' && 'value' in n) {
				// 静态style
				let style: Record<string, string> = {};
				const styleString = n.value?.content;
				if(!styleString) {
					return p;
				}

				const styleItems = styleString.split(";");
				styleItems.forEach(item => {
					if(!item) return;

					const KV = /\s*(.+):\s*(.+)/.exec(item);
					warn(!!KV, `${item}解析失败`);

					style[toHumpName(KV![1])] = KV![2];
				})

				return isEmptyObject(style) ? p : {
					...p,
					style,
				}
			}
			// todo bind and other props

			return {
				...p
			}
		}, {} as HandleProps & { classStyle: Record<any, any> });

		let returnProps: HandleProps = {};

		(baseProps.style || baseProps.classStyle) && (returnProps.style = {
			...(baseProps.classStyle || {}),
			...(baseProps.style || {})
		})

		baseProps.props && (returnProps.props = baseProps.props);

		return returnProps;
	}
}


new Parser(template)
