/// <reference types="@types/css" />

import {baseParse, TemplateChildNode, TemplateNode} from '@vue/compiler-core';
import { parse as TsParser } from '@babel/parser';
import { transform } from '@babel/standalone';
import cssParser from 'css/lib/parse';
import {template} from './test';
import {Declaration, Rule, Stylesheet} from "css";

enum CompileTarget {
	Page,
	Component
}

function templateCompile(template: string) {
	let styleMap: Map<string, Record<string, string>>;

	const {children} = baseParse(template, {});

	const [layoutTemplate, scriptTemplate, styleTemplate] = getTemplate(children);

	console.info('layoutTemplate', layoutTemplate);

	if (scriptTemplate) {
		scriptParse(scriptTemplate)
	}

	if (styleTemplate) {
		// styleMap = parseStyle(styleTemplate);
	}


}

/**
 * parse css
 * */
function parseStyle(style: string) {
	const styleMap = new Map<string, Record<string, string>>();
	const parseStyle: Stylesheet = cssParser(style);
	console.info(style, parseStyle);
	const {stylesheet} = parseStyle;

	stylesheet?.rules.forEach((classBlock) => {
		const {type, declarations, selectors} = classBlock as Rule;
		if (type === "rule") {
			const style = declarations?.reduce((p: Declaration, c: Declaration) => {
				if(c.type === "declaration") {
					return {
						...p,
						[toHumpName(c.property!)]: c.value
					}
				}
				return p;
			}, {}) || {};

			selectors?.forEach(select => {
				if (select.indexOf('.') === 0) {
					// class选择器
					const className = select.slice(1);

					styleMap.set(className, {
						...(styleMap.get(className) || {}),
						...(style || {}) as Record<string, string>
					})
				}
			})
		}
	})

	return styleMap;
}

function toHumpName(name: string): string {
	if (!name) return name;

	return name.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
}


const defaultOptions = {
	sourceType: "module",
	allowImportExportEverywhere: false,
	allowReturnOutsideFunction: false,
	createParenthesizedExpressions: false,
	ranges: false,
	tokens: false,
	errorRecovery: false
};

function scriptParse(script: string) {
	const AST = TsParser(script, defaultOptions as any);
	// const a = transformFromAst(AST, '', {})
	console.info('AST\n\n', AST);
	// console.info('a\n\n', a);
	console.info(transform('const a = 1;', { presets: ['es2015'] }));
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


templateCompile(template);
