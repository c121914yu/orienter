<template>
	<div class="model popup">
		<div class="container">
			<h3>{{head}}</h3>
			<p class="content">{{text}}</p>
			<div class="btn">
				<p 
					:style="'color:' + confirmColor"
					@click="confirm"
				>
					{{confirmText}}
				</p>
				<p 
					class="cancel" 
					v-if="cancelText != ''"
					@click="cancel"
				>
					{{cancelText}}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			head: "",
			text: "",
			confirmText: "",
			cancelText: "",
			confirmColor: "var(--green2)"
		}
	},
	methods:{
		confirm(){
			if(this.success)
				this.success()
			this.cancel()
		},
		cancel(){
			const dom = document.querySelector(".model")
			document.body.removeChild(dom)
		}
	}
}
</script>

<style>
.model{
	background-color: rgba(0,0,0,0.1);
}
.model .container{
	width: 80%;
	max-width: 300px;
	height: 150px;
	padding: 10px;
	background-color: rgba(250,250,250,1);
	box-shadow: var(--box-shadow1);
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	overflow: hidden;
}

.model .content{
	margin-top: 5px;
	width: 100%;
}
.model .btn{
	position: absolute;
	bottom: 0;
	width: 100%;
	background-color: #f4f4f4;
	display: flex;
	text-align: center;
	font-weight: 500;
	font-size: 1.1em;
}
.model .btn p{
	flex: 1;
	padding: 5px 0;
}
.model .btn .cancel{
	border-left: var(--border1);
}
</style>
