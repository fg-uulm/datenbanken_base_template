import Vue from 'vue'
import Router from 'vue-router'
import Weather from './views/Weather.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/weather'
    },
    {
      path: '/weather',
      name: 'weather',
      component: Weather
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
