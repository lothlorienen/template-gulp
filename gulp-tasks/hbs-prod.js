module.exports = () => {
  const initParams = {};
  initParams.cache = randomIntNum(1, 5000);
  initParams.dynamicEntry = $.conf.dynamicEntry && $.conf.buildMode === 'prod';

  const options = {
    ignorePartials: true,
    batch: [
      `${$.conf.appRoot}/${$.conf.hbs}/layouts`,
      `${$.conf.appRoot}/${$.conf.hbs}/partials`,
    ],
    helpers: {
      times: function(n, block) {
        const result = [];
        for (let i = 0; i < n; ++i) result.push(block.fn(i + 1));

        return result.join('');
      },
      when: function(v1, operator, v2, options) {
        switch (operator) {
          case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
          case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
      },
      ifCond: function(v1, v2, options) {
        if (v1 === v2) return options.fn(this);
        return options.inverse(this);
      },
      concat: function(...args) {
        return `${args.slice(0, -1).join('')}`;
      },
      ifUseWebp: function(block) {
        if ($.conf.buildWebp) return block.fn(this);
        else return block.inverse(this);
      },
    },
  };

  $.gulp.task('hbs-prod', () => {
    const data = JSON.parse($.fs.readFileSync(`${$.conf.appRoot}/${$.conf.db}/db.json`),);
    const links = JSON.parse($.fs.readFileSync(`${$.conf.appRoot}/${$.conf.db}/links.json`),);
    const db = { ...initParams, ...data, ...links };

    return $.gulp.src([
      `${$.conf.appRoot}/${$.conf.hbs}/pages/*.hbs`,
    ])
      .pipe($.gulpPlugin.plumber())
      .pipe($.gulpPlugin.compileHandlebars(db, options))
      .pipe($.gulpPlugin.rename(path => {
        const string = path.basename;

        if (string.match('--')) {
          const newPath = string.split('--').join('/');
          path.dirname = `${newPath}`;
        } else if (!string.match('home')) {
          path.dirname = string;
        }

        path.basename = 'index';
        path.extname = '.html';
      }))
      .pipe($.gulpPlugin.htmlmin({
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      }))
      .pipe($.gulp.dest(`${$.conf.outputPath}`))
      .pipe($.bs.reload({ stream: true }),
      );
  });

  function randomIntNum(min, max) {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
};
