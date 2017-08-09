var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"https://api.ywhub.com/"',
  H5_ROOT: '"https://web.ywhub.com"',
  READHUB_URL: '"https://read.ywhub.com"',
  GA_CODE: '"UA-97476315-3"'
})
