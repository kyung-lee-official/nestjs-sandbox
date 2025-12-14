// rollup.config.js

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

// import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// ... other plugins like terser for minification

// const packageJson = require('./package.json');
import packageJson from './package.json' with { type: 'json' };

export default {
	input: 'src/index.ts',
	output: [
		{
			file: packageJson.main, // should be 'dist/index.cjs.js'
			format: 'cjs',
			sourcemap: true,
			exports: 'named', // to support named exports in CommonJS
		},
		{
			file: packageJson.module, // should be 'dist/index.esm.js'
			format: 'esm',
			sourcemap: true,
		},
		// You could also add a UMD bundle here if needed for browser CDN usage
	],
	external: [
		// official way to specify external dependencies if not using peerDepsExternal plugin
		...Object.keys(packageJson.peerDependencies || {}),
	],
	plugins: [
		// 1. Automatically exclude peer dependencies from the bundle
		// peerDepsExternal(),
		// 2. Resolve external dependencies from node_modules
		resolve(),
		// 3. Convert CJS modules (if any) to ES modules to be included in the Rollup bundle
		commonjs(),
		// 4. Compile TypeScript to JavaScript (using the TS settings in tsconfig, but not emitting types)
		typescript({
			tsconfig: './tsconfig.json',
			sourceMap: true,
			compilerOptions: {
				module: 'NodeNext',
				moduleResolution: 'NodeNext'
			}
		}),
		// ... add babel or terser for minification/optimization
	],
};