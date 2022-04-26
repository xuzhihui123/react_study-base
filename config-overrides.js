const {override,addDecoratorsLegacy} = require('customize-cra')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const customize = () => (config, env) => {
  config.resolve.alias['@'] = resolve('src')
  if (env === 'production') {
      config.externals = {
          'react': 'React',
          'react-dom': 'ReactDOM'
      }
  }

  return config
};


module.exports = override(
  addDecoratorsLegacy(),
  customize()
)