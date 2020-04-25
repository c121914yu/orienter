import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		activity: "",
		userData: "",
  },
	getters:{
		getUserData:(state) => {
			return {...state.userData}
		},
		getUserObj:(state) => {
			const obj = state.userData.obj
			if(obj === "")
				return false
			else
				return [...obj]
		},
		getActivity:(state) => {
			return {...state.activity}
		},
		getPaths:(state) => {
			return [...state.activity.paths]
		},
	},
  mutations: {
		setUserData:(state,param) => {
			state.userData = {...param}
		},
		setUserObj:(state,param) => {
			if(param === "")
				state.userData.obj = ""
			else
				state.userData.obj = [...param]
		},
		setActivity:(state,param) => {
			state.activity = param
		},
		setPaths:(state,param) => {
			state.activity.paths = [...param]
		}
  },
  actions: {
  },
  modules: {
  }
})
