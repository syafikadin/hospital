import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DataPasien from '../views/DataPasien.vue'
import TestView from '../views/TestView.vue'
import Vuetify from '../views/Vuetify.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/patients',
    name: 'datapasien',
    component: DataPasien
  },
  {
    path: '/test',
    name: 'test',
    component: TestView
  },
  {
    path: '/vuetify',
    name: 'vuetify',
    component: Vuetify
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
