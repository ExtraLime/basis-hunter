// vue.config.js
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
module.exports = {
    runtimeCompiler: true,
    // NOTE: set alias via `configureWebpack` or `chainWebpack`
    configureWebpack: {
      resolve: {
        alias: {
          'balm-ui-plus': 'balm-ui/dist/balm-ui-plus.js',
          'balm-ui-css': 'balm-ui/dist/balm-ui.css'
        },
        extensions: [".js", ".json"],        
      
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/, ///< using babel-loader for converting ES6 to browser supported javascript
            loader: "babel-loader",
            exclude: [/node_modules/]
          }
        ]
      },
     //Add Analyzer Plugin alongside your other plugins...
     plugins: [
       new WebpackBundleAnalyzer()
    ]
      
    }

  };