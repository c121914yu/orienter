<template>
	<div class="main">
		<Head 
			@drawPathMarker="drawPathMarker"
			@moveToObj="moveToObj">
		</Head>
		<introduct 
			v-if="currentObj!=''" 
			:obj="currentObj"
			:selfLocaltion="selfLocaltion"
			:selfCircle="selfCircle"
			@closeIntroduct="closeIntroduct">
		</introduct>
		<div class="map" id="map"></div>
	</div>
</template>

<script>
import AMap from "AMap"
import Head from "../components/head.vue"
import introduct from "../components/introduct.vue"
var load
export default{
	data(){
		return{
			map: "",
			selfLocaltion: this.$store.getters.getPaths[0][0].position,
			selfCircle: "",
			currentObj: "",
			userData: "",
			paths: this.$store.getters.getPaths
		}
	},
	methods:{
		init(){
			// 加载地图
			this.map = new AMap.Map('map', {
				center: this.paths[0][0].position, //初始化地图中心点,若不写则默认是当前位置
				zoom: 17, //初始化地图层级,越大越细
				resizeEnable: true, //是否监控地图容器尺寸变化
				expandZoomRange: true, //支持可以扩展最大缩放级别
			})
			this.drawPathMarker()
		},
		drawPathMarker(){
			this.userData = this.$store.getters.getUserData
			this.map.clearMap()
			this.getSelfPosition()
			// 如果没有选择路径则绘制所有的点
			if(!this.userData.obj){
				this.paths.forEach(path => {
					path.forEach(item => {
						item.clock = false
						item.marker = this.addObjMarker(item)
					})
				})
				this.$store.commit('setPaths',this.paths)
			}
			// 已报名
			else{
				this.userData.obj.forEach(item => {
					item.marker = this.addObjMarker(item)
				})
				this.$store.commit('setUserObj',this.userData.obj)
			}
		},
		//添加目标地点标记
		addObjMarker(obj){
			let icon = new AMap.Icon({
				image: obj.clock ? "http://blogs.jinlongyuchitang.cn/icon/mark_blue.png" : "http://blogs.jinlongyuchitang.cn/icon/mark_red.png",
				size: new AMap.Size(20,34),
				imageSize: new AMap.Size(20, 34),
			})
			let marker = new AMap.Marker({
				map: this.map,
				position: obj.position,
				icon,
				animation: "AMAP_ANIMATION_DROP",
				label: {
					content: `<div class="marker">${obj.introduct.name}</div>`,
					direction : "right",
					offset : new AMap.Pixel(5,0),
				}
			})
			// 添加点击事件
			marker.on("click",(e) => {
				setTimeout(() => {
					this.currentObj = obj
				})
			})
			return marker
		},
		// 获取当前位置坐标
		getSelfPosition(){
			load = this.$loading()
			var that = this
			AMap.plugin('AMap.Geolocation', function() {
			   let geolocation = new AMap.Geolocation({
						enableHighAccuracy: true,//是否使用高精度定位，默认:true
						timeout: 10000,          //超过10秒后停止定位，默认：无穷大
						maximumAge: 0,           //定位结果缓存0毫秒，默认：0
						convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						showButton: true,        //显示定位按钮，默认：true
						buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
						buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
						showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
						panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
						zoomToAccuracy:true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
						GeoLocationFirst: true,
						noIpLocate: 1
				 })
			
				that.map.addControl(geolocation)
			  geolocation.getCurrentPosition()
			  AMap.event.addListener(geolocation, 'complete', onComplete)
			  AMap.event.addListener(geolocation, 'error', onError)
			
			  function onComplete(data){
					that.selfLocaltion = data.position
					addLocationMark()
					load.hide()
			  }
			  function onError(err){
					console.log(err)
					addLocationMark()
					load.hide()
			  }
			})
			function addLocationMark(center){
				if(that.selfCircle)
					that.map.remove(that.selfCircle)
				that.selfCircle = new AMap.Circle({
					map: that.map,
					center: that.selfLocaltion,
					radius : 20,
					strokeColor: "#5b8ff9",
					strokeOpacity: 0.4,
					strokeWeight: 1,
					fillColor: "#5b8ff9",
					fillOpacity: 0.4
				})
			}
		},
		moveToObj(position){
			this.map.setCenter(position)
		},
		closeIntroduct(){
			this.currentObj = ""
		}
	},
	mounted() {
		this.init()
	},
	components:{
		Head,
		introduct
	},
	beforeRouteEnter(from,to,next) {
		next(vm => {
			if(!vm.userData.hasOwnProperty("id")){
				vm.$router.push({name:'home'})
				vm.$showToast({
					type: "warn",
					text: "请先登录"
				})
			}
		})
	}
}
</script>

<style>
.main{
	width: 100vw;
	height: 100vh;
}
.main .map{
	width: 100%;
	height: 100%;
}

.main .localtion{
	position: fixed;
	right: 20px;
	bottom: 30px;
	width: 35px;
	height: 35px;
	text-align: center;
	line-height: 35px;
	border-radius: 5px;
	background-color: #FFFFFF;
	border: var(--border1);
	font-size: 1.6em;
	z-index: 99;
}

/* 标签文字 */
.amap-marker-label{
	border: var(--border1);
	box-shadow: var(--box-shadow2);
	border-radius: 5px;
}
</style>
