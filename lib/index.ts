/// <reference types="@types/css" />

import {baseParse, TemplateChildNode, TemplateNode} from '@vue/compiler-core';
import {parseStyle} from './parse/parseStyle';
import {scriptParse} from './parse/parseScript';
import {
	File,
	Statement,
	ExportDefaultDeclaration,
	ObjectExpression,
	Identifier,
	ObjectProperty,
	StringLiteral
} from '@babel/types';
import {template} from './test';

enum CompileTarget {
	page,
	component
}

/**
 * if condition === false break the program
 * */
function assert(condition: boolean, msg: string) {
	if (!condition) {
		throw new Error(msg)
	}
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

function templateCompile(template: string) {
	let styleMap: Map<string, Record<string, string>>;
	let originalParsedScript: File;
	let target: CompileTarget;

	const {children} = baseParse(template, {});

	const [layoutTemplate, scriptTemplate, styleTemplate] = getTemplate(children);

	console.info('layoutTemplate', layoutTemplate);

	if (scriptTemplate) {
		originalParsedScript = scriptParse(scriptTemplate)
		target = getParseTarget(originalParsedScript)
		console.info('target', target);
	}

	if (styleTemplate) {
		// styleMap = parseStyle(styleTemplate);
	}
}


templateCompile(template);
