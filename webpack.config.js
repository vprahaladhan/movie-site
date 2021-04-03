const path = require('path');

module.exports = {
  "mode": "none",
  "entry": ['./src/index.js', './src/event_handlers.js'],
  "output": {
    "path": __dirname + '/dist',
    "filename": "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  "module": {
    "rules": [
      {
        "test": /\.css$/,
        "use": [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  }
};