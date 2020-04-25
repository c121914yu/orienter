<template>
	<div class="introduct popup">
		<div class="container">
			<h3>{{obj.introduct.name}}</h3>
			<p class="content">{{obj.introduct.text}}</p>
			<div class="btns">
				<p 
					v-if="$store.state.userData.obj"
					class="clock-in" 
					@click="clock"
				>
					{{obj.clock? "已打卡" : "打卡"}}
				</p>
				<p v-else class="clock-in"  @click="cancel">确认</p>
				<p class="cancel" @click="cancel">取消</p>
			</div>
		</div>
	</div>
</template>

<script>
import {updateObj} from "../assets/axios/api.js"
export default{
	data(){
		return{
			objMarkers: this.$store.state.userData.obj,
		}
	},
	props:{
		obj: Object,
		selfLocaltion: Array,
		selfCircle: Object,
	},
	methods:{
		clock(){
			if(this.obj.clock) return
			const currentObj = this.objMarkers[this.objMarkers.indexOf(this.obj)]
			if(this.selfCircle.contains(currentObj.position)){
				currentObj.clock = true
				const userObj = this.$store.state.userData.obj.map(item => {
					return {
						clock: item.clock,
						introduct: item.introduct,
						position: item.position
					}
				})
				currentObj.clock = false
				updateObj({
					id: this.$store.state.userData.id,
					obj: JSON.stringify(userObj)
				}).then(res => {
					currentObj.clock = true
					currentObj.marker.setIcon(new AMap.Icon({
						image: "http://blogs.jinlongyuchitang.cn/icon/mark_blue.png",
						size: new AMap.Size(20,34),
						imageSize: new AMap.Size(20, 34),
					})) 
					this.$showToast({
						text: `${currentObj.introduct.name}打卡成功`
					})
				})
			}
			else
				this.$showToast({
					type: "error",
					text: `${currentObj.introduct.name}不在打卡范围`
				})
		},
		cancel(){
			this.$emit('closeIntroduct')
		}
	}
}
</script>

<style scoped>
.introduct{
	z-index: 99;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}
.introduct .container{
	width: 85vw;
	max-width: 300px;
	min-height: 40vh;
	max-height: 70vh;
	background-color: rgba(255,255,255,0.9);
	box-shadow: var(--box-shadow1);
	position: relative;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.introduct .container h3{
	text-align: center;
}

.introduct .content{
	flex: 1;
	margin: 5px 0 35px 0;
	padding: 0 5px;
	overflow: auto;
}

.introduct .btns{
	position: absolute;
	bottom: 0;
	width: 100%;
	display: flex;
	align-items: center;
}
.introduct .btns p{
	width: 50%;
	height: 30px;
	text-align: center;
	line-height: 30px;
}
.introduct .btns p.clock-in{
	color: #FFFFFF;
	background-color: var(--green1);
}
.introduct .btns p.cancel{
	background-color: #f5f5f5;
}
</style>
