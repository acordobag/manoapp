const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.join(__dirname, './src'),
        '@root': path.join(__dirname),
        'assets': path.join(__dirname, './src/assets'),
        'styles': path.join(__dirname, './src/styles')
      },
      extensions: ['*', '.js', '.vue', '.json']
    }
  }
}
