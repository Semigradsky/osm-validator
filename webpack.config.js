const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(png|jpeg)$/,
        use: [
          { loader: 'url-loader', options: { limit: 8192 } } 
          // limit => file.size =< 8192 bytes ? DataURI : File
        ]
      }
    ]
  }
};
