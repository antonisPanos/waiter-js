import esbuild from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const option = {
  bundle: true,
  color: true,
  entryPoints: ['./src/index.ts'],
  logLevel: 'info',
  minify: true,
  sourcemap: true
};

const handleBuildError = (e) => {
  console.error(e);
  process.exit(1);
};

async function run() {
  await esbuild
    .build({
      format: 'esm',
      outfile: './dist/waiter.mjs',
      plugins: [dtsPlugin()],
      ...option
    })
    .catch(handleBuildError);

  await esbuild
    .build({
      format: 'cjs',
      outfile: './dist/waiter.js',
      ...option
    })
    .catch(handleBuildError);

  await esbuild
    .build({
      format: 'iife',
      outfile: './dist/waiter.umd.js',
      ...option
    })
    .catch(handleBuildError);
}

run();
