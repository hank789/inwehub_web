var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://zhihu.hank.com:8080/"',
  GA_CODE: '"UA-97476315-3"'
})
