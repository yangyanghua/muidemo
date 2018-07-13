;$(function(){
	var httpSveiveUrl = '';
	var currentHost = location.host;
	var protocol  = window.location.protocol;   
	
	if (currentHost == '192.168.9.243:8080') {
		//httpSveiveUrl = 'http://192.168.9.245:8094/front/api/v1/scanCode/getInfoByCode';	
		httpSveiveUrl = 'http://tsgapp-api.iflashbuy.com:8383/front/api/v1/scanCode/getInfoByCode';	
	
	}else if(currentHost=='tsgapp-scaninfo.iflashbuy.com:8383'){
		
		httpSveiveUrl = 'http://tsgapp-api.iflashbuy.com:8383/front/api/v1/scanCode/getInfoByCode';
	
	}else if(currentHost =='sgapp-scaninfo.iflashbuy.com'){
		
		httpSveiveUrl = 'http://sgapp-api.iflashbuy.com/front/api/v1/scanCode/getInfoByCode';
	
	}else if(currentHost=='sgapp-scaninfo.z-code.cn' ){
	
		httpSveiveUrl = 'http://sgapp-api.z-code.cn/front/api/v1/scanCode/getInfoByCode';
	
	}else if(currentHost=='ysgapp-scaninfo.z-code.cn'){
		httpSveiveUrl = 'http://ysgapp-api.z-code.cn/front/api/v1/scanCode/getInfoByCode';
	}
	
	//获取URL参数
	var getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r !== null) {
			return decodeURI(r[2]);
		}
		return null;
	};	  
var $productImg   = $('#productImg'),//商品图片
	$proIndicator = $('#proIndicator'),//商品图片分页
	$productsName = $('#productsName'),//商品名字
	$brand  	  = $('#brand'),//商品品牌	
	$sourceArea   = $('#sourceArea'),//原产地
	$productionEnt= $('#productionEnt'),//生产企业
	$entAddress	  = $('#entAddress'),//生产地址	
	$jyImages     = $('.jyImages'),//检验证书
	$yclContent	  = $('.yclContent'),//原材料信息	
	$slider1Group = $('#slider1Group'),//工厂实拍
	$proInfoHtml  = $('.proInfoHtml'),//商品描述
	$buyBtns      = $('#buyBtns');//购买地址

	//获取code值
	var codeValue = '';
	var zcode = getUrlParam('zcode');
	var code  = getUrlParam('code');
	codeValue = code || zcode;	
	if(codeValue==null){
	   codeValue='';
	}
	//是否闪购商品详情进入该页面，是的话就隐藏购买按钮
	$('.options').hide();
//	var isSgIn  = getUrlParam('flag');
//	if(isSgIn){
//		$('.options').hide();
//	}
mui.ajax(httpSveiveUrl,{
	data:{
		code:codeValue
	},
	dataType:'json',//服务器返回json格式数据
	type:'post',//HTTP请求类型
	timeout:10000,//超时时间设置为10秒；	              
	success:function(data){
		console.log(data);
		if(data.code==0){
			//查询无该码信息
			if(!data.data.productId){
				$('.noInfo').show();
				$('title').text('查无相关信息');
				//加载完毕
				$('.loading').fadeOut();
				return false;
			}			
			//商品视频
			$proIndicator.append('<div class="mui-indicator mui-active"></div>');
			if(data.data.productVideoUrl !='null' && data.data.productVideoUrl !=''){
					var videoshtml = '';
					var videos = '<video src="'+data.data.productVideoUrl.split('|')[1]+'" id="video1"  poster="'+data.data.productImgUrl.split(',')[0].split('|')[1]+'">'+
					'</video><span id="playBtn"></span>';
					videoshtml+='<div class="mui-slider-item mui-slider-item-duplicate produtImgs">'+
							'<a href="#">'+
								videos+
							'</a>'+
							'</div>'
			$proIndicator.append('<div class="mui-indicator"></div>');	
			$productImg.append(videoshtml);
			//点播放按钮播放视频
			$('#playBtn').on('click',function(){
				$('#video1').attr('controls','controls');
				$('#playBtn').hide();
				document.getElementById('video1').play();
			})
			//暂停
			$('#video1').on('click',function(){
				$('#video1').removeAttr('controls','controls');
				$('#playBtn').show();
				document.getElementById('video1').pause();
			})			
			}
			
			
			//商品图片
			var productImgs = data.data.productImgUrl.split(',');
			var productHtml = '';
			var proIndicatorHtml = '';
			if(data.data.productVideoUrl==''&&productImgs.length<=1){
				$proIndicator.hide();
			}
			productImgs.forEach(function(item,index){
				productHtml += '<div class="mui-slider-item mui-slider-item-duplicate produtImgs">'+
					'<a href="#">'+
						'<img src="'+item.split('|')[1]+'" data-preview-src="" data-preview-group="1">'+
					'</a>'+
				'</div>';
			if(index>=1){
				proIndicatorHtml+='<div class="mui-indicator"></div>'
			}
			})
			$productImg.append(productHtml);
			$proIndicator.append(proIndicatorHtml);	
			//商品图片轮播实例		
			var slider = mui("#slider");
				slider.slider({
						interval: 0
				});				
			
			//基本信息
			$productsName.text(data.data.productName);
		    if(data.data.brand){$brand.text(data.data.brand); }else{$brand.parent().hide();}
			if(data.data.sourceArea){$sourceArea.text(data.data.sourceArea); }else{$sourceArea.parent().hide();}
			if(data.data.productionEnterprise){$productionEnt.text(data.data.productionEnterprise); }else{$productionEnt.parent().hide();}
			if(data.data.enterpriseAddress){$entAddress.text(data.data.enterpriseAddress); }else{$entAddress.parent().hide();}
			//检验证书
			if(data.data.inspectionCertificate){
				var inspectionCertificates = data.data.inspectionCertificate.split(',');
				var jyImagesHtml = '';			
				inspectionCertificates.forEach(function(item,index){
					jyImagesHtml += '<p style="	background:url('+item+') no-repeat 50% 50%;background-size:cover ;">'+
					'<img src="'+item+'" data-preview-src="" data-preview-group="1" />'+
					'</p>';			
				})
				$jyImages.append(jyImagesHtml);				
			}else{
				$('.jyImages').hide();
			}

			//原材料信息
			if(data.data.materialInformation){
				$yclContent.html(data.data.materialInformation);
			}else{
				$yclContent.parent().hide();	
			}
			//工厂实拍
			if(data.data.factoryScene){
				var factoryScenes =  data.data.factoryScene.split(','); 
				var factorySceneHtml = '';
				factoryScenes.forEach(function(item,index){
					factorySceneHtml += '<div class="mui-slider-item mui-slider-item-duplicate">'+
					'<a class="gcimg" href="#" style="background:url('+item+') no-repeat 50% 50%;background-size:cover ;" >'+
						'<img src="'+item+'" data-preview-src="" data-preview-group="1">'+
					'</a>'+
				'</div>';						
				})
				$slider1Group.html(factorySceneHtml);
			//工厂实拍轮播实例
			var slider1 = mui('#slider1');
				slider1.slider({
						interval: 0
					});					
				
			}else{
				$('.gcImages').hide();
			}	
			//商品描述
			if(data.data.productDescribe&&!data.data.traceInfoId){
				$proInfoHtml.html(data.data.productDescribe);
			}else{
				$proInfoHtml.parent().hide();	
			}			
			//购买地址
			if(data.data.buyUrl){
				var buyUrls = data.data.buyUrl.split(',');
				var buyBtnsHtml = '';
				buyUrls.forEach(function(item,index){
				 if(item.indexOf('iflashbuy')!=-1){
					buyBtnsHtml += '<li class="mui-table-view-cell">'+
						'<a href="'+item.split('|')[1]+'" style="font-size: 14px;color: #F26749;font-weight: bold;">'+item.split('|')[0]+'</a>'+
					'</li>';				 	
				 }else{
					buyBtnsHtml += '<li class="mui-table-view-cell">'+
						'<a href="'+item.split('|')[1]+'" style="font-size: 14px;color: #999999;">'+item.split('|')[0]+'</a>'+
					'</li>';					 	
				 }
				})
				$buyBtns.append(buyBtnsHtml);				
			}else{
				//没有购买链接，默认添加闪购真品购买链接
				var buyBtnsHtml = '<li class="mui-table-view-cell">'+
						'<a href="http://m.iflashbuy.com/product/index.html?id='+data.data.productId+'" style="font-size: 14px;color: #F26749;font-weight: bold;">闪购真品</a>'+
					'</li>';
				$buyBtns.append(buyBtnsHtml);	
			}	
		//加载完毕
		$('.loading').fadeOut();			
		}else{
			mui.alert(data.message, function() {console.log('error')});				
		}
	},
	error:function(xhr,type,errorThrown){
		//异常处理；
		mui.alert('网络错误', function() {
			console.log(type);		
		});		
	}
});

//开启图片预览功能
 	mui.previewImage();
 	//每次只能预览当前组图片
		mui('.jyImages').on('tap','img',function(){
			$('body').find('img').removeAttr('data-preview-group');
			$('.jyImages').find('img').attr('data-preview-group','1')
		})
		mui('#slider1Group').on('tap','img',function(){
			$('body').find('img').removeAttr('data-preview-group');
			$('#slider1Group').find('img').attr('data-preview-group','1');
			
		})
		mui('#productImg').on('tap','img',function(){
			$('body').find('img').removeAttr('data-preview-group');
			$('#productImg').find('img').attr('data-preview-group','1');
		})		
 	var options = {
					 scrollY: true, //是否竖向滚动
					 scrollX: false, //是否横向滚动
					 startX: 0, //初始化时滚动至x
					 startY: 0, //初始化时滚动至y
					 indicators: true, //是否显示滚动条
					 deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
					 bounce: true //是否启用回弹
					}

			mui('.mui-scroll-wrapper').scroll(options);
	var toTop = function(){
		 mui('.mui-scroll-wrapper').scroll().scrollTo(0,0,100);//100毫秒滚动到顶
	};
			
		mui('body').on('tap', '.mui-popover-action li>a', function() {
			var a = this,
				parent;
			//根据点击按钮，反推当前是哪个actionsheet
			for (parent = a.parentNode; parent != document.body; parent = parent.parentNode) {
				if (parent.classList.contains('mui-popover-action')) {
					break;
				}
			}
			//关闭actionsheet
			//跳转
			location.href = this.href;
			mui('#' + parent.id).popover('toggle');
		})
		//非视频slide,视频停止播放。
			document.querySelector('#slider').addEventListener('slide', function(event) {
			  //注意slideNumber是从0开始的；
			  if(event.detail.slideNumber!=0){
			  	if(document.getElementById('video1')){
			  		$('#video1').removeAttr('controls');
			  		document.getElementById('video1').pause();
			  		$('#playBtn').show();
			  	}
			  	
			  }

			});	

	
})
