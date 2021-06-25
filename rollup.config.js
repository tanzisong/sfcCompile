const path = require('path');
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
// import eslint from 'rollup-plugin-eslint';
const fileName = 'compile';
export default {
  input: 'lib/index.ts',
  output: [
    {
      file: `dist/lib/${fileName}.umd.js`,
      name: fileName,
      format: 'umd',
      sourcemap: false,
    },
  ],
  watch: {
    include: 'lib/**',
  },
  external: [],
  plugins: [
    json(),
    typescript(),
    commonjs({
      include: [path.join(__dirname, 'node_modules', '@vue/compiler-core')],
    }),
    resolve(),
  ],
};
