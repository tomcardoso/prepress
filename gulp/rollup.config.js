var gulpConfig = require('./gulp.config.js'),
  json = require('rollup-plugin-json'),
  babel = require('rollup-plugin-babel'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs');

module.exports = {
  entry: gulpConfig.srcScripts + '/main.js',
  plugins: [
    json(),
    babel({
      babelrc: false,
      presets: ['es2015-rollup'],
      exclude: ['node_modules/**', '*.json']
    }),
    nodeResolve({ jsnext: true }),
    commonjs()
  ]
};
