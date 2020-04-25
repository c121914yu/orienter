<template>
<div class="head">
	<div class="name">
		<span>{{userData.name}}</span>
		<span class="out" @click="signOut">退出</span>
	</div>
	<div 
		v-if="!userData.obj"
		class="join"
	>
		<span 
			v-if="currentPath>=0"
			class="path" 
			@click="changePath">
			路线{{currentPath+1}}
		</span>
		<button v-if="currentPath<0" @click="changePath">选择路线</button>
		<button v-else @click="choosePath">确认路线</button>
	</div>
	
	<div 
		v-else
		class="progress"
	>
		已打卡: {{progress}}
		<button @click="clearPath">重选路线</button>
	</div>
</div>
</template>

<script>
import AMap from "AMap"
import {updateObj} from "../assets/axios/api.js"
export default{
	data(){
		return{
			paths: this.$store.getters.getPaths,
			userData: this.$store.getters.getUserData,
			currentPath: -1
		}
	},
	methods:{
		changePath(){
			this.currentPath++
			if(this.currentPath >= this.paths.length)
				this.currentPath = 0
			this.paths.forEach((path,index) => {
				path.forEach(item => {
					if(index === this.currentPath)
						item.marker.show()
					else
						item.marker.hide()
				})
			})
			this.$emit('moveToObj',this.paths[this.currentPath][0].position)
		},
		choosePath(){
			let obj = this.paths[this.currentPath].map(item => {
				let res = {...item}
				delete res.marker
				return res
			})
			this.$showModel({
				head: "提示",
				text: "确认选择该路线?选择后仍可修改,重新选择会清空已打卡的点.",
				confirmText: "确认",
				cancelText: "取消",
				success: () => {
					updateObj({
						id: this.userData.id,
						obj: JSON.stringify(obj)
					})
					.then(res => {
						this.$showToast({
							text: "选择成功"
						})
						this.$store.commit("setUserObj",this.paths[this.currentPath])
						this.userData = this.$store.getters.getUserData
					})
				}
			})
		},
		clearPath(){
			this.$showModel({
				head: "提示",
				text: "确认重选路线?已打卡点将会被清除.",
				confirmText: "确认",
				cancelText: "取消",
				success: () => {
					updateObj({
						id: this.userData.id,
						obj: ""
					})
					.then(res => {
						this.currentPath = -1
						this.$store.commit("setUserObj","")
						this.userData = this.$store.getters.getUserData
						this.$emit("drawPathMarker")
						this.$showToast({
							text: "重选路线"
						})
					})
				}
			})
		},
		signOut(){
			this.$showModel({
				head: "提示",
				text: "确认退出登录？",
				confirmText: "确认",
				cancelText: "取消",
				success: () => {
					this.$store.state.userData = ""
					localStorage.removeItem("userID")
					this.$router.push({name:"Home"})
				}
			})
		}
	},
	computed:{
		progress(){
			let count = 0
			this.userData.obj.forEach(item => {
				if(item.clock)
					count++
			})
			return `${count} / ${this.userData.obj.length}`
		}
	}
}
</script>

<style scoped>
.head{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 50px;
	background-color: #fefefe;
	padding: 10px;
	box-shadow: var(--box-shadow1);
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 99;
}

.head .name span{
	margin-right: 10px;
	font-size: 0.9em;
}
.head .name span.out{
	color: var(--green2);
	text-decoration: underline;
}

.head .join{
	display: flex;
	align-items: center;
}
.head .join .path{
	margin-right: 15px;
	border: var(--border1);
	padding: 0 10px;
	border-radius: 5px;
}

</style>
