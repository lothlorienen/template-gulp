export const hbs = (cb, buildProd = false) => {
  const randomIntNum = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1))
  const initParams = {
    cache: randomIntNum(1, 5000),
    dynamicEntry: $.conf.dynamicEntry && $.conf.buildMode === 'prod',
  }
  const options = {
    ignorePartials: true,
    batch: [`${$.conf.hbs}/layouts`, `${$.conf.hbs}/partials`],
    helpers: {
      times: function (n, block) {
        const result = [];
        for (let i = 0; i < n; ++i) result.push(block.fn(i + 1));

        return result.join('');
      },
      when: function (v1, operator, v2, options) {
        switch (operator) {
          case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
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
      ifCond: function (v1, v2, options) {
        if (v1 === v2) return options.fn(this);

        return options.inverse(this);
      },
      concat: function (...args) {
        return `${args.slice(0, -1).join('')}`;
      },
      ifUseWebp: function (block) {
        if ($.conf.buildWebp) return block.fn(this);
        else return block.inverse(this);
      },
    }
  }
  const db = {...initParams, ...$.hbsDB}

  // если нужна сборка с линовкой страниц
  if (buildProd) {
    // todo
    console.log('cb',cb)
    console.log('buildProd',buildProd)
    return $.gulp
      .src([`${$.conf.hbs}/pages/*.hbs`])
      .pipe($.plumber())
      .pipe($.gulpCompileHandlebars(db, options))
      .pipe($.gulpRename(path => {
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
      .pipe($.htmlMin({
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      }))
      .pipe($.gulp.dest(`${$.conf.outputPath}`))
      .pipe($.server.stream())
  }

  // в случае, если у нас сборка обычная
  return $.gulp
    .src([
      `${$.conf.hbs}/pages/*.hbs`,
      `${$.conf.hbs}/partials/core/ui-kit/page.hbs`,
      `${$.conf.hbs}/ajax/*.hbs`,
    ])
    .pipe($.plumber())
    .pipe($.gulpCompileHandlebars(db, options))
    .pipe($.gulpRename(path => {
      const string = path.basename;

      if (string === 'page') path.basename = 'ui-toolkit';

      path.dirname = '';
      path.extname = '.html';
    }))
    .pipe($.htmlMin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
    }))
    .pipe($.gulp.dest(`${$.conf.outputPath}/html`))
    .pipe($.server.stream())
}
