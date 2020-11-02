let path = require('path');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
    publicPath: './',
    productionSourceMap: false,

    css: {
        extract: false
    },

    configureWebpack: {
        resolve: {
            alias: {
                'styles': resolve('./src/styles')  
            }
        }
    },

    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: [path.resolve(__dirname, "./src/styles/common.less")] //文件路径
      }
    }
};
