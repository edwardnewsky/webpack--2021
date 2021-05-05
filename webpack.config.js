const path = require('path');
const HTMLWebackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  if (isProd) {
    config.minimize = true;
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  }
  return config;
};

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`;

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, context) => {
          return path.relative(path.dirname(resourcePath), context) + '/';
        },
      },
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'postcss-preset-env',
              {
                browsers: 'last 3 versions',
                autoprefixer: { grid: true },
              },
            ],
          ],
        },
      },
    },
  ];
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          // Откуда копировать
          from: path.resolve(__dirname, 'src/favicon.ico'),
          // Куда копировать
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

const babelOptions = (preset) => {
  const opts = {
    presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };
  if (preset) {
    opts.presets.push(preset);
  }
  return opts;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    // Тут можно задать несколько точек входа
    main: ['@babel/polyfill', './index.js'],
    analytics: './analytics.ts',
  },
  output: {
    filename: `js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // Здесь можно написать расширения которы не хочется писать в коде
    extensions: ['.js', '.json', '.png'],
    alias: {
      // Здесь можно задавать отностильное наименование путей
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
  devServer: {
    open: true,
    port: 4200,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(?:ico|png|jpg|jpeg|svg|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/images',
          name() {
            if (isDev) {
              return '[name].[ext]';
            }

            return '[name].[fullhash].[ext]';
          },
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/fonts',
          name() {
            if (isDev) {
              return '[name].[ext]';
            }

            return '[name].[fullhash].[ext]';
          },
        },
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript'),
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        },
      },
    ],
  },
};
