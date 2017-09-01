var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"test"',
  API_ROOT: '"https://api.ywhub.com/"',
  H5_ROOT: '"https://web.ywhub.com"',
  READHUB_URL: '"https://read.ywhub.com"',
  GA_CODE: '"UA-97476315-3"',
  ECHO_SERVER_ADDRESS: '"https://read.ywhub.com"',
  DEEP_LINK_KEY: '"A0kU"'
})
