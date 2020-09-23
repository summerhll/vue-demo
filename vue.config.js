let path = require('path');
let os = require('os');
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
    }
};
