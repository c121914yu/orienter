import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from '../views/Home.vue'
import Main from '../views/Main.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/main',
		name: 'Main',
		component: Main
	}
]

const router = new VueRouter({
  routes,
	mode: "history"
})

export default router
