<template>
	<div class="sign">
		<div class="content">
			<div class="login box">
				<h2>登录</h2>
				<input type="text" placeholder="学号/邮箱" v-model="userInfo.email">
				<input type="password" placeholder="密码" autocomplete v-model="userInfo.password">
				<button @click="login">登录</button>
				<div class="help">
					<span @click="current=1">找回密码</span>
					<span>|</span>
					<span @click="current=2">注册账号</span>
				</div>
			</div>
			
			<div class="find-psw box">
				<h2>找回密码</h2>
				<div class="back" @click="current=0">返回登录</div>
				<input type="text" placeholder="邮箱" v-model="userInfo.email">
				<input type="password" placeholder="新密码" autocomplete v-model="userInfo.password">
				<div class="rand" :class="time >0 ? 'ban':''">
					<input type="text" placeholder="验证码" maxlength="6" v-model="userInfo.rand">
					<button @click="getRand">{{rand}}</button>
				</div>
				<button @click="setNumber">找回密码</button>
			</div>
			
			<div class="sign-in box">
				<h2>注册</h2>
				<div class="back" @click="current=0">返回登录</div>
				<input type="text" placeholder="邮箱" v-model="userInfo.email">
				<input type="text" placeholder="姓名" v-model="userInfo.name">
				<input type="text" placeholder="学号" v-model="userInfo.number">
				<input type="password" placeholder="密码" autocomplete v-model="userInfo.password">
				<div class="rand" :class="time >0 ? 'ban':''">
					<input type="text" placeholder="验证码" maxlength="6" v-model="userInfo.rand">
					<button @click="getRand">{{rand}}</button>
				</div>
				<button @click="setNumber">注册</button>
			</div>
		</div>
	</div>
</template>

<script>
import {login,sendRand,findPsw,register} from "../assets/axios/api.js"
var timer
var emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
export default{
	data(){
		return{
			current: 0, //0登录 1找回密码 2注册
			time: 0,
			userInfo: {
				email: '',
				name: '',
				number: '',
				password: '',
				rand: ''
			}
		}
	},
	watch:{
		current(newData,oldData){
			let translate = ['0','-100%','100%']
			switch(newData){
				case 0: translate = ['0','-100%','100%'];break;
				case 1: translate = ['100%','0','100%'];break;
				case 2: translate = ['-100%','-100%','0'];break;
			}
			document.querySelectorAll('.box').forEach((item,index) => {
				item.style.transform = `translateX(${translate[index]})`
			})
			this.userInfo.name = ""
			this.userInfo.password = ""
		}
	},
	methods:{
		getRand(){
			if(this.time > 0) return
			if(this.userInfo.email === "")
				this.$showToast({
					type: "error",
					text: "邮箱不能为空"
				})
			else if(!emailReg.test(this.userInfo.email))
				this.$showToast({
					type: "error",
					text: "邮箱格式错误"
				})
			else{
				// 设定再次获取时间
				this.time = 10
				timer = setInterval(() => {
					this.time--
				},1000) 
				sendRand({
					email: this.userInfo.email
				})
				.then(res => {
					this.$showToast({
						type: "success",
						text: "验证码已发送"
					})
					console.log(res.data)
				})
			}
		},
		login(){
			const data = {
				number: this.userInfo.email,
				password: this.userInfo.password
			}
			if(data.number === "")
				this.$showToast({
					type: "error",
					text: "学号/邮箱不能为空"
				})
			else if(data.password === "")
				this.$showToast({
					type: "error",
					text: "密码不能为空"
				})
			else{
				login(data)
				.then(res => {
					localStorage.setItem("userID",res.data.id)
					this.$store.commit("setUserData",res.data)
					this.$showToast({
						type: "success",
						text: "登录成功"
					})
					this.$router.push({name:"Main"})
				})
			}
		},
		setNumber(){
			const data = {...this.userInfo}
			if(data.email === "")
				this.$showToast({
					type: "error",
					text: "邮箱不能为空"
				})
			else if(!emailReg.test(data.email))
				this.$showToast({
					type: "error",
					text: "邮箱格式错误"
				})
			else if(data.name === "" && this.current===2)
				this.$showToast({
					type: "error",
					text: "姓名不能为空"
				})
			else if(data.number === "" && this.current===2)
				this.$showToast({
					type: "error",
					text: "学号不能为空"
				})
			else if(data.password === "")
				this.$showToast({
					type: "error",
					text: "密码不能为空"
				})
			else if(data.rand === "")
				this.$showToast({
					type: "error",
					text: "验证码不能为空"
				})
			else if(data.rand.length != 6)
				this.$showToast({
					type: "error",
					text: "验证码长度错误"
				})
			else{
				if(this.current === 1){
					delete data.name
					delete data.number
					findPsw(data)
					.then(res => {
						localStorage.setItem("userID",res.data.id)
						this.$store.commit("setUserData",res.data)
						this.$showToast({
							type: "success",
							text: "修改密码成功"
						})
						this.$router.push({name:"Main"})
					})
				}
				else if(this.current === 2)
					register(data)
					.then(res => {
						localStorage.setItem("userID",res.data.id)
						this.$store.commit("setUserData",res.data)
						this.$showToast({
							type: "success",
							text: "注册成功"
						})
						this.$router.push({name:"Main"})
					})
			}
		}
	},
	computed:{
		rand(){
			if(this.time <= 0){
				if(timer)
					clearInterval(timer)
				return "获取验证码"
			}
			else if(this.time < 10)
				return `0${this.time}s`
			else
				return `${this.time}s`
		}
	}
}
</script>

<style scoped>
.sign{
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 10;
	background-color: rgba(0,0,0,0.3);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.sign .content{
	position: relative;
	width: 300px;
	height: 300px;
	border-radius: 10px;
	overflow: hidden;
}

.sign .box{
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: rgba(255,255,255,0.9);
	padding: 10px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: var(--transition-speed);
}

.sign .box input{
	margin: 5px auto;
	width: 80%;
}
.sign .box button{
	margin: 10px 0;
	width: 50%;
}
.sign .box .back{
	position: absolute;
	top: 10px;
	color: #FFFFFF;
	background-color: var(--green1);
	padding: 5px;
	font-size: 0.8em;
}
.sign .box .rand{
	margin: 5px auto;
	width: 80%;
	display: flex;
}
.sign .box .rand input{
	margin: 0;
}
.sign .box .rand button{
	margin: 0 0 0 5px;
	white-space: nowrap;
}
.sign .box .rand button:active{
	transform: none;
}
.sign .box .rand.ban button{
	background-color: #5c6064;
}

.sign .sign-in{
	transform: translateX(100%);
}
.sign .sign-in .back{
	left: 0;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}

.sign .find-psw{
	transform: translateX(-100%);
}
.sign .find-psw .back{
	right: 0;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}

.sign .login .help{
	margin-top: 10px;
	font-size: 0.9em;
}
.sign .login .help span{
	margin: 0 5px;
}
</style>
