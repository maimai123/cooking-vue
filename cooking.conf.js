var path = require('path');
var cooking = require('cooking');
var App = require("./app.json");
var build = require('./build');


cooking.set({
  entry: build.entries(),
  dist: './dist',
  template: build.templates(),
  devServer: {
    port: 8080,
    publicPath: '/',
    noInfo:true,
    log:false,
    quiet:false,
    lazy:false,
    //跨域
    // proxy: {
    //   '*': {
    //     target: 'http://www.chaping.io/Activity/Index',
    //     secure: false,
    //   }
    // }
  },

  // production
  clean: true,
  hash: true,
  sourceMap: false,
  minimize: true,
  chunk: true,
  postcss: [
    // require('...')
  ],
  publicPath: './',
  assetsPath: './static',
  urlLoaderLimit: 10000,
  extractCSS: 'static/css/[name].css',
  alias: {
    'src': path.join(__dirname, 'src'),
    'vux-components': 'vux/src/components/',
    'components': path.join(__dirname, 'src/components'),
    'vue$': 'vue/dist/vue.common.js'
  },
  extends: ['vue2', 'less', 'autoprefixer','babel']
  // externals:build.externals()
});


cooking.add('output.filename', 'static/js/[name].js');

cooking.add('loader.vux',{
  test: /vux.src.*?js$/,
  loaders: ['babel-loader']
});

cooking.add('loader.vue',{
  test: /\.vue$/,
  loaders: ['vue-loader']
});

cooking.add('loader.js',{
  test: /\.js$/,
  loaders: ['babel-loader'],
  exclude: /node_modules/
});

cooking.add('loader.less',{
  test: /\.less$/,
  loaders: ['less-loader','style-loader','css-loader']
});


cooking.add('entry.vendor',['vue','vuex']);

module.exports = cooking.resolve();
