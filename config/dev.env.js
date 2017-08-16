var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://zhihu.hank.com:8080/"',
  H5_ROOT: '"https://web.ywhub.com"',
  READHUB_URL: '"http://10.102.10.131:8081"',
  GA_CODE: '"UA-97476315-3"',
  ECHO_SERVER_ADDRESS: '"https://read.ywhub.com"'
})
