import { parse as TsParser } from '@babel/parser';

const defaultOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: false,
  allowReturnOutsideFunction: false,
  createParenthesizedExpressions: false,
  ranges: false,
  tokens: false,
  errorRecovery: false,
};

function scriptParse(script: string) {
  const AST = TsParser(script, defaultOptions as any);
  // const A = transformFromAst(AST, '', {}, () => {
  //   console.info('adsdas')
  // });
  // console.info('AAA', A);
  // console.info(transform(`function a(params = 1, params2 = 2) {
  // 	const a = [1, 2, 3];
  // 	const b = params + params2;
  // 	return [...a, b];
  // }`, { presets: ['es2015'] }));
  return AST;
}

export { scriptParse };
