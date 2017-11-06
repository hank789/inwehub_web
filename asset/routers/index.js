import Vue from 'vue'
import VueRouter from 'vue-router'

var routes = []

VueRouter.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
