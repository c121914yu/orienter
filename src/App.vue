<template>
  <div id="app">
		<router-view v-if="created"/>
  </div>
</template>

<script>
import {getActivity,checkID} from "./assets/axios/api.js"
export default{
	data(){
		return{
			created: false
		}
	},
	created() {
		getActivity("")
		.then(res => {
			this.$store.commit("setActivity",res.data)
			const endTime = +(new Date(this.$store.state.activity.endTime))
			const now = +(new Date())
			if(now > endTime){
				this.$showModel({
					head: "提示",
					text: "本期活动已过期",
				})
				return
			}
			// 活动未过期
			else{
				const id = localStorage.getItem("userID")
				if(id)
					checkID({
						id: id
					})
					.then(res => {
						this.$store.commit("setUserData",res.data)
						this.created = true
					})
					.catch(err => {
						localStorage.removeItem("userID")
						this.created = true
					})
				else//没有登录存储
					this.created = true
			}
		})
	}
}
</script>

<style>
@import url("./assets/common.css");
@import url("./assets/icon/iconfont.css");
</style>
