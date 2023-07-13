import {nodeResolve} from '@rollup/plugin-node-resolve';
import Typescript from '@rollup/plugin-typescript';
import Cleanup from 'rollup-plugin-cleanup';
import Replace from '@rollup/plugin-replace';
import {terser as Terser} from 'rollup-plugin-terser';

function getPlugins(shouldMinify) {
	const plugins = [
		Typescript({
			tsconfig: './tsconfig.json',
		}),
		nodeResolve({
			preferBuiltins: false,
		}),
		// https://github.com/rollup/rollup/issues/2332
		Replace({
			'Object.defineProperty(exports, "__esModule", { value: true });': '',

			delimiters: ['\n', '\n'],
			preventAssignment: true,
		}),
	];
	if (shouldMinify) {
		plugins.push(Terser());
	}
	return [
		...plugins,
		// https://github.com/microsoft/tslib/issues/47
		Cleanup({
			comments: 'none',
		}),
	];
}

export default async () => {
	// eslint-disable-next-line no-undef
	const production = process.env.BUILD === 'production';

	return {
		input: 'src/ts/index.ts',
		output: {
			file: `public/assets/bundle.js`,
			format: 'esm',
		},
		plugins: getPlugins(production),

		onwarn(warning, warn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			warn(warning);
		},
	};
};
