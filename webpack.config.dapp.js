const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ['babel-polyfill', path.join(__dirname, "src/dapp")],
  output: {
    path: path.join(__dirname, "prod/dapp"),
    filename: "bundle.js"
  },
  module: {
    rules: [
    {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        use: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: path.join(__dirname, "src/dapp/index.html")
    })
  ],
  resolve: {
    extensions: [".js"],
    //https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
    fallback: {
      "url": false,
      "os": false,
      "fs": false,
      "tls": false,
      "net": false,
      "path": false,
      "zlib": false,
      "http": false,
      "https": false,
      "stream": false,
      "crypto": false,
      "assert": false,
      "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
    } 
  },
  devServer: {
    //https://stackoverflow.com/questions/67926476/webpack-dev-server-config-contentbase-not-working-in-latest-version
    static: path.join(__dirname, "dapp"),
    port: 8001,
    //stats: "minimal"
  }
};
