const path = require('path');
const webpack = require('webpack');

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
        "test": /\.(png|svg|jpg|jpeg|gif)$/i,
        "type": 'asset/resource',
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({           
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),      
      API_HOST: JSON.stringify(process.env.API_HOST)
    })
  ]
};