/*
 * @Author: Administrator
 * @Date:   2017-09-17 21:42:43
 * @Last Modified by:   Administrator
 * @Last Modified time: 2017-09-19 00:33:05
 */
var webpack           = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量的配置 dev / online(区分开发和线上环境)
var WEBPACK_ENV       = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

//获取html-webpack-plugin参数的方法（多页面处理）
var getHtmlConfig = function(name){
    return{
        template : './src/view/' + name + '.html',
        filename : 'view/' + name + '.html',
        inject   : true,
        hash     : true,
        chunks   : ['common',name]
    };
}
var config = {
    entry: {
        'common': ['./src/page/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'login': ['./src/page/login/index.js'],
    },
    output: {
        path: './dist',
        publicPath : '/dist',//浏览器访问文件路径
        filename: 'js/[name].js'
    },
    //jquery引入
    externals: {
        'jquery': 'window.jQuery'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
        },{
            test : /\.(png|jpg|gif|svg|woff|eot|ttf)$/i,
            loader : 'url-loader?limit=100&name=resource/[name].[ext]',
        }]
    },
    plugins: [ 
        //  独立通用模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        // css单独打包
        new ExtractTextPlugin("css/[name].css"),
        // html模板
       new HtmlWebpackPlugin(getHtmlConfig('index')),
       new HtmlWebpackPlugin(getHtmlConfig('login')),
    ]
};

module.exports = config;

if( 'dev' === WEBPACK_ENV ){
    config.common.push('webpack-dev-server/client?http://loacalhost:8008/');
}
