'use strict';

console.log(process.env.NODE_ENV);
console.log(process.env.USER);

const NODE_ENV = process.env.NODE_ENV || "development";
const webpack = require('webpack');

module.exports = {
    entry: "./home",
    output: {
        filename: "my.js",
        library: "home"
    },
    watch: NODE_ENV == "development",
    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: NODE_ENV == "development" ? "cheap-inline-module-source-map" : false,

    plugins: [ 
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            LANG: JSON.stringify('ru')
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery'
        })
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory=true',
                exclude: /node_modules/,
                options: {
                    plugins: ['transform-runtime']
                }
            },
            // { 
            //     test: /\.ts$/, 
            //     exclude: /node_modules/,
            //     loader: 'ts-loader',
            //     options: {
            //         plugins: ['transform-runtime']
            //     }
            // }
            // {
            //     // Here you instruct webpack to use the es3ify loader for the node_modules directory
            //     test: /\.js$/,
            //     exclude: /\/node_modules\//,
            //     loader: 'es3ify'
            // }
        ]
    }
};