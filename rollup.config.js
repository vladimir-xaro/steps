import typescript from '@rollup/plugin-typescript';
import scss from "rollup-plugin-scss";
// import preprocess from "svelte-preprocess";
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
// import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import deepmerge from 'deepmerge';

const arrayMerge = (destination, source) => [ ...destination, ...source ];

export default CLIArgs => {
  const mode = process.env.BUILD || 'development';
  const isDev = mode === 'development';

  const name = 'Steps';
  const filename = 'steps';

  let result = [];

  if (isDev) {
    result.push({
      input: 'src/index.dev.ts',
      output: {
        sourcemap: true,
        name,
        format: 'iife',
        file: `dev/${filename}.dev.js`,
        plugins: []
      },
      plugins: [
        resolve({
          browser: true,
        }),
        scss({
          watch: 'src/scss/',
          output: `dev/${filename}.dev,css`,
          failOnError: true,
        }),
        typescript({
          target: 'es5'
        }),
      ],
    })
  } else {
    const base = {
      input: 'src/index.ts',
      output: [],
      plugins: [
        cleanup({
          comments: 'none'
        }),
        scss({
          watch: 'src/scss/',
          output: `dist/${filename}.css`,
          failOnError: true,
        }),
      ],
    };
    const baseOutput = {
      sourcemap: true,
      name,
    }

    result.push(
      deepmerge(base, {
        plugins: [
          resolve({
            browser: true,
          }),
          typescript({
            target: 'es5'
          }),
        ]
      }, { arrayMerge }),
      deepmerge(base, {
        plugins: [
          typescript({
            target: 'esnext'
          }),
        ]
      }, { arrayMerge }),
    );

    // es5
    result[0].output.push(
      deepmerge(baseOutput, {
        format: 'iife',
        file: `dist/${filename}.js`
      }, { arrayMerge }),
      deepmerge(baseOutput, {
        format: 'iife',
        file: `dist/${filename}.min.js`,
        plugins: [
          terser(),
        ]
      }, { arrayMerge }),
    );

    // es
    result[1].output.push(
      deepmerge(baseOutput, {
        format: 'es',
        file: `dist/${filename}.es.js`,
      }, { arrayMerge }),
      deepmerge(baseOutput, {
        format: 'es',
        file: `dist/${filename}.es.min.js`,
        plugins: [
          terser(),
        ]
      }, { arrayMerge }),
    );
  }

  console.log(result);

  return result;
}