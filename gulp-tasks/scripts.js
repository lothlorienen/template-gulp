// module.exports = () => {
//   const sourcePath = `${$.conf.appRoot}/${$.conf.scripts}`;
//   const prodOutput = `${$.conf.outputPath}/${$.conf.scripts}`;
//   const outputFileName = $.conf.dynamicEntry && $.conf.buildMode === 'prod' ? '[name]' : '[name].js';
//
//   const sourceMapConfig = {
//     filename: `${outputFileName}.map`,
//     exclude: /2-vendors\.js/,
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
//     exclude: [/node_modules[\/\\](?!(swiper|dom7)[\/\\])/, /2-vendors\.js/],
//     use: {
//       loader: 'babel-loader',
//       options: {
//         presets: ['@babel/preset-env'],
//       },
//     },
//   };
//
//   const shared = {
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
//       shared.mode = 'development';
//       shared.entry = getStaticEntry();
//       shared.module.rules.push(
//         babelConfig,
//       );
//       shared.plugins.push(
//         new $.webpack.SourceMapDevToolPlugin(sourceMapConfig),
//       );
//       minifyConfig.test = /2-vendors\.js/;
//       shared.optimization.minimize = true;
//       shared.optimization.minimizer.push(
//         new $.webpackTerser(minifyConfig),
//       );
//       break;
//     case 'prod':
//       shared.mode = 'production';
//
//       $.conf.dynamicEntry ?
//         shared.entry = getDynamicEntry() :
//         shared.entry = getStaticEntry();
//
//       if ($.conf.babel) shared.module.rules.push(babelConfig,);
//
//       $.conf.jsMin ?
//         minifyConfig.test = /\.js$/ :
//         minifyConfig.test = /2-vendors\.js/;
//
//       shared.optimization.minimize = true;
//       shared.optimization.minimizer.push(new $.webpackTerser(minifyConfig),);
//   }
//
//   $.gulp.task('scripts', done => {
//     return $.gulp.src(`${sourcePath}/**`)
//       .pipe($.webpackStream(shared, $.webpack,))
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
//       2-vendors: $.path.resolve(`${sourcePath}/2-vendors.ts`),
//       main: $.path.resolve(`${sourcePath}/main.ts`),
//     };
//   }
// }

const gulpEsbuild = require("gulp-esbuild");
const { createGulpEsbuild } = require("gulp-esbuild");

module.exports = () => {
  const esbuild = $.conf.isProd ? gulpEsbuild : createGulpEsbuild({ incremental: true });

  $.gulp.task("scripts", (done) => {
    return $.gulp
      .src([`${$.conf.scripts}/main.ts`, `${$.conf.scripts}/vendors.ts`])
      .pipe($.plumber())
      .pipe(
        esbuild({
          // outfile: 'theme.min.js',
          outdir: ".",
          bundle: true,
          minify: $.conf.isProd,
          sourcemap: !$.conf.isProd,
          loader: {
            ".ts": "ts"
          },
          // format: "esm",
          platform: "browser",
          target: ["es6"],
          entryNames: "[name].min"
        })
      )
      .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.scriptsOut}/`))
      .pipe($.server.stream());
  });
};
