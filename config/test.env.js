var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"test"',
  API_ROOT: '"https://api.ywhub.com/"',
  H5_ROOT: '"https://web.ywhub.com"',
  READHUB_URL: '"https://read.ywhub.com/h5"',
  GA_CODE: '"UA-97476315-3"'
})
