// module.exports = () => {
//   const sourcePath = `${$.conf.appRoot}/${$.conf.scripts}`;
//   const prodOutput = `${$.conf.outputPath}/${$.conf.scripts}`;
//   const outputFileName = $.conf.dynamicEntry && $.conf.buildMode === 'prod' ? '[name]' : '[name].js';
//
//   const sourceMapConfig = {
//     filename: `${outputFileName}.map`,
//     exclude: /vendors\.js/,
//   };
//   const minifyConfig = {
//     parallel: true,
//     terserOptions: {
//       output: {
//         comments: false,
//       },
//     },
//     extractComments: false,
//   };
//   const babelConfig = {
//     test: /\.js$/,
//     exclude: [/node_modules[\/\\](?!(swiper|dom7)[\/\\])/, /vendors\.js/],
//     use: {
//       loader: 'babel-loader',
//       options: {
//         presets: ['@babel/preset-env'],
//       },
//     },
//   };
//
//   const config = {
//     output: {
//       filename: `${outputFileName}`,
//       path: $.path.resolve(`${prodOutput}/`),
//     },
//     module: {
//       rules: [],
//     },
//     plugins: [],
//     optimization: {
//       minimizer: [],
//     },
//     stats: 'errors-warnings',
//   };
//
//   switch ($.conf.buildMode) {
//     case 'dev':
//       config.mode = 'development';
//       config.entry = getStaticEntry();
//       config.module.rules.push(
//         babelConfig,
//       );
//       config.plugins.push(
//         new $.webpack.SourceMapDevToolPlugin(sourceMapConfig),
//       );
//       minifyConfig.test = /vendors\.js/;
//       config.optimization.minimize = true;
//       config.optimization.minimizer.push(
//         new $.webpackTerser(minifyConfig),
//       );
//       break;
//     case 'prod':
//       config.mode = 'production';
//
//       $.conf.dynamicEntry ?
//         config.entry = getDynamicEntry() :
//         config.entry = getStaticEntry();
//
//       if ($.conf.babel) config.module.rules.push(babelConfig,);
//
//       $.conf.jsMin ?
//         minifyConfig.test = /\.js$/ :
//         minifyConfig.test = /vendors\.js/;
//
//       config.optimization.minimize = true;
//       config.optimization.minimizer.push(new $.webpackTerser(minifyConfig),);
//   }
//
//   $.gulp.task('scripts', done => {
//     return $.gulp.src(`${sourcePath}/**`)
//       .pipe($.webpackStream(config, $.webpack,))
//       .pipe($.gulp.dest(`${prodOutput}/`))
//       .pipe($.server.reload({ stream: true })).on('end', done);
//   });
//
//   function getDynamicEntry() {
//     return $.glob.sync(
//       `${sourcePath}/**/*`, {
//         ignore: [`${sourcePath}/main.ts`, `${sourcePath}/polyfills.ts`],
//         nodir: true,
//       },
//     ).reduce((acc, path) => {
//       const entryPath = path.match(/([\w\d-_]+)\.js$/i)[0];
//       acc[entryPath] = $.path.resolve(path);
//       return acc;
//     }, {});
//   }
//
//   function getStaticEntry() {
//     return {
//       vendors: $.path.resolve(`${sourcePath}/vendors.ts`),
//       main: $.path.resolve(`${sourcePath}/main.ts`),
//     };
//   }
// }

import gulpEsbuild, { createGulpEsbuild } from 'gulp-esbuild'

export const js = (cb) => {
  const esbuild = $.conf.isProd
    ? gulpEsbuild
    : createGulpEsbuild({ incremental: true })

  return $.gulp
    .src([`${$.conf.scripts}/main.ts`])
    .pipe($.plumber())
    .pipe(
      esbuild({
        // outfile: 'theme.min.js',
        outdir: '.',
        bundle: true,
        minify: $.conf.isProd,
        sourcemap: !$.conf.isProd,
        loader: {
          '.ts': 'ts',
        },
        // format: "esm",
        platform: 'browser',
        target: ['es6'],
        entryNames: '[name].min',
      })
    )
    .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.scriptsOut}/`))
    .pipe($.server.stream().on('end', cb))
}
