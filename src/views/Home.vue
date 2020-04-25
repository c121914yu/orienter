<template>
	<div class="home" @click="navTomain">
		<signUp id="sign" v-if="sign"></signUp>
	</div>
</template>

<script>
import signUp from "../components/signUp.vue"
export default{
	data(){
		return{
			activity: this.$store.state.activity,
			userData: this.$store.state.userData,
			sign: false
		}
	},
	methods:{
		navTomain(e){
			// 已登录则直接跳转主界面
			if(this.userData != ""){
				this.$router.push({name:'Main'})
				return
			}
			if(this.sign){
				// 关闭弹窗
				const sign = document.getElementById('sign')
				e.target === sign ? this.sign = false : ''
			}
			else
				this.sign = true
		}
	},
	mounted() {
		document.querySelector('.home').style.backgroundImage = `url(${this.activity.cover})`
	},
	components:{
		signUp
	}
}
</script>

<style>
.home{
	height: 100vh;
	width: 100vw;
	background-position: center;
	background-size: cover;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
