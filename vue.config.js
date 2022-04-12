// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    resolve: {
      // ... rest of the resolve config
      fallback: {
        'path': require.resolve('path-browserify')
      }
    },
    devtool: 'source-map',
    target: 'web'
  }
  // configureWebpack: {
  //   plugins: [
  //     new BundleAnalyzerPlugin()
  //   ]
  // }
}