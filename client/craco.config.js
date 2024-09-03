const { homedir } = require('node:os')
const { join, resolve } = require('node:path')

module.exports = {
  webpack: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '#': resolve(__dirname, '..', 'shared')
    },
    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      )
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1)
      webpackConfig.module.rules.push({
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      })
      return webpackConfig
    }
  },
  devServer: {
    https: {
      cert: join(homedir(), '.ssl', 'cert.pem'),
      key: join(homedir(), '.ssl', 'key.pem')
    }
  }
}