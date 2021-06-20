import {parse as TsParser} from "@babel/parser";
import {transform} from "@babel/standalone";


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
	console.info('AST\n\n', AST);
	// console.info(transform(`function a(params = 1, params2 = 2) {
	// 	const a = [1, 2, 3];
	// 	const b = params + params2;
	// 	return [...a, b];
	// }`, { presets: ['es2015'] }));
	return AST;
}

export { scriptParse }
