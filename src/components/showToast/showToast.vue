<template>
	<div 
		:style="'opacity:' + opacity"
		class="toast popup"
		@click="removeDom"
	>
		<div class="container">
			<i class="iconfont" :class="'icon-' + type"></i>
			<h3>{{text}}</h3>
		</div>
	</div>
</template>

<script>
var timer
export default{
	data(){
		return{
			show: true,
			opacity: 0,
			type: "",
			text: "",
			time: 1500
		}
	},
	methods:{
		removeDom(){
			let dom = document.querySelector('.toast')
			clearInterval(timer)
			if(dom)
				document.body.removeChild(dom)
		}
	},
	mounted() {
		setTimeout(() => {
			this.opacity = 1
		},10)
		
		setTimeout(() => {
			this.opacity = 0
		},this.time)
		
		timer = setInterval(() => {
			this.removeDom()
		},this.time+800)
	}
}
</script>

<style scoped>
.toast{
	opacity: 0;
	z-index: 99;
}
.toast .container{
	height: 150px;
	min-width: 150px;
	padding: 0 5px;
	color: #FFFFFF;
	background-color: rgba(0,0,0,0.4);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.toast .container .iconfont{
	font-size: 3em;
}
</style>
