const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', //原始碼來源
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    https: true
  },
  output: { //輸出
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};