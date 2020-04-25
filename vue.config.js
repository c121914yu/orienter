module.exports = {
	outputDir: "dist", //输出目录
	assetsDir: 'assets' ,//输入静态资源的目录
	publicPath: './', //部署时基本url
	indexPath: "index.html", //指定index.html输出路径(相对于dist)
	lintOnSave: false, //是否开启eslint保存检测
	devServer: { //生产环境配置
		open: false,
		// host: 'localhost',
		host: "192.168.1.17",
		port: 8080,
		https: true,
		hotOnly: false,
	  proxy: {
			'/api': {
				target: "http://app.rmsdmedia.com",
				ws: true,
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					"^/api": "",
				}
			}
		}, 
		before: app => {}
	},
	configureWebpack: {
		externals: {
			'AMap': 'AMap' // 高德地图配置
		}
	}
}