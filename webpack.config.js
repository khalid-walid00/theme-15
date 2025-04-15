const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require("path");
const webpack = require('webpack');

const asset = file => path.resolve('src/assets', file || '');
const publicPath = file => path.resolve("dist", file || '');

module.exports = {
  entry: {
    app: [asset("js/main.ts"), asset("styles/style.scss")],
    product: [asset("js/product.ts")],
    limit: [asset("js/limit.ts")],
    pagination: [asset("js/pagination.ts")],
    sort: [asset("js/sort.ts")],
    filterCategory: [asset("js/filterCategory.ts")],
    filterPriceing: [asset("js/filterPriceing.ts")],
    filterProperties: [asset("js/filterProperties.ts")],
    cart: [asset("js/cart.ts")],
    header: [asset("js/header.ts")],
  },
  output: {
    path: publicPath(),
    clean: true,
    chunkFilename: "[name].js", // تأكد من امتداد مناسب
  },
  resolve: {
    // إضافة دعم لامتدادات TypeScript
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new CopyPlugin({
      patterns: [{ from: asset('images'), to: publicPath('images') }],
    }),
    // new webpack.HotModuleReplacementPlugin(), // دعم Hot Module Replacement
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(), // لضغط JavaScript
      new CssMinimizerPlugin(), // لضغط CSS
    ],
  },
  mode: 'production',
};