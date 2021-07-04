import { parse as TsParser } from '@babel/parser';
import { File } from '@babel/types';
import { transform } from '@babel/standalone';

interface PolyfillCode {
  code: string;
}

const defaultOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: false,
  allowReturnOutsideFunction: false,
  createParenthesizedExpressions: false,
  ranges: false,
  tokens: false,
  errorRecovery: false,
};

function scriptParse(script: string): File {
  return TsParser(script, defaultOptions as any) as File;
}

function polyfill(code: string): PolyfillCode {
  return transform(code, { presets: ['es2015-no-commonjs'] });
}

export { scriptParse, polyfill };
