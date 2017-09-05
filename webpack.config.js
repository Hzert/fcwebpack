var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //模板插件
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //Css分割插件
var CleanWebpackPlugin = require('clean-webpack-plugin'); // 删除插件
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin'); //自动注入注解插件
var autoprefixer = require('autoprefixer');
var path = require('path');
var buildPath = path.resolve(__dirname, "dist"); //发布目录
var __DEV__ = process.env.NODE_ENV; //发布环境
var devtool = ''; //source-map模式
function resolve(dir) {
    return path.join(__dirname, dir)
}

var plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: __dirname + '/www/template/index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
    }),
    new webpack.HashedModuleIdsPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor'],
        minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '/node_modules')
                ) === 0
            )
        }
    }),
    // // extract webpack runtime and module manifest to its own file in order to
    // // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        chunks: ['vendor']
    }),
    new ExtractTextPlugin("css/styles.[hash:7].css"),
    new CleanWebpackPlugin('dist', {
        verbose: true,
        dry: false
    }),
    new NgAnnotatePlugin({
        add: true
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                require('autoprefixer')({
                    browsers: ['last 2 versions']
                })
            ]
        }
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })
];

if (__DEV__ === 'dev') {
    devtool = 'eval-source-map';
}
if (__DEV__ === 'build') {
    //压缩
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false,  // remove all comments
        },
        compress: {
            warnings: true
        }
    }));
    // devtool = 'cheap-module-source-map';
    // publicPath = process.env.NODE_ENV == 'test' ? 'test.domain.com' : 'www.domain.com';
}
var config = {
    //入口文件配置
    entry: {
        app: path.resolve(__dirname, 'www/app/app.js'),
        vendor: ['jquery.cookie']
    },
    //文件导出的配置
    output: {
        path: buildPath,
        filename: "script/[name].[chunkhash].js",
        chunkFilename: "chunks/[name].chunk.[chunkhash].js"
    },
    resolve: {
        extensions: ['.js', '.html'],
        alias: {
            '@': resolve(''),
            'js': resolve('/www/js'),
            'app': resolve('/www/app'),
            'directive': resolve('/www/directive'),
            'img': resolve('/www/img'),
            'view': resolve('/www/view'),
            'template': resolve('/www/template'),
            'service': resolve('/www/service'),
        }
    },
    //本地服务器配置
    devServer: {
        historyApiFallback: true,
        open: true,
        inline: true,
        overlay: {
            errors: true,
            warnings: true
        },
        proxy: {
            "*": {
                target: "https://ifci.lincomb.com",
                changeOrigin: true

            }
        }
    },
    //模块配置
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader:'html-withimg-loader'
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8190&name=img/[name].[hash:7].[ext]'
            }, {
                test:  /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=/font/[name].[ext]'
            },
            { //外链
                test: /\.(styl|css)$/,
                loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!stylus-loader"})
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('www')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, "./www")
            }
        ]
    },
    //插件配置
    plugins: plugins,
    //调试配置
    devtool: devtool
}

module.exports = config;
