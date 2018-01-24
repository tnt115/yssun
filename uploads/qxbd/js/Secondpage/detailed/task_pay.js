var prepay_id=""
var paySign=""
var appId=""
var timeStamp=""
var nonceStr=""
var packageStr=""
var signType=""
var detailed={
		
	    onBridgeReady:function(){
	    	//alert(appId+","+paySign);
	    	WeixinJSBridge.invoke(
	                'getBrandWCPayRequest', {
	                     "appId":appId,     //公众号名称，由商户传入
	                     "paySign":paySign,         //微信签名
	                     "timeStamp":timeStamp, //时间戳，自1970年以来的秒数
	                     "nonceStr":nonceStr , //随机串
	                     "package":packageStr,  //预支付交易会话标识
	                     "signType":signType     //微信签名方式
	                 },
	              function(res){
	                	 if(res.err_msg == "get_brand_wcpay_request:ok" ) {
	                		 mui.alert('支持成功!', '', function() {
	                			 wx.closeWindow();
	 						});
	                		  
				         }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
				        	 mui.alert('支持已经被取消!', '', function() {
				        		 wx.closeWindow();
	 						});
				               
				         }else if(res.err_msg == "get_brand_wcpay_request:fail" ){
				        	 mui.alert('支付失败,请联系管理员!', '', function() {
				        		 wx.closeWindow();
	 						});
				              
				         } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
	                 }
	            );
	    }
	    ,
	    callpay:function(){
	    	 
	    	if (typeof WeixinJSBridge == "undefined"){
	    		 
	            if( document.addEventListener ){
	                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	            }else if (document.attachEvent){
	                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
	                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	            }
	        }else{
	        	 
	        	detailed.onBridgeReady();
	        }
	    }
	    ,
		setPrepayReq:function(){
			    var sendUrl=""
				var sendData=""
				sendUrl=base.getContextPath()+'/wxpay/prepayReq.do';
				//sendUrl='http://test.woxiaotong.cn/elecSecurity/wxpay/prepayReq.do';
				sendData="uidUserId="+base.getUidUserId()+'&iTaskId='+base.GetQueryString("iTaskId")+"&iTaskItemId="+base.GetQueryString("iTaskItemId")+"&open_id="+base.GetQueryString("open_id");
				$.ajax({
					type:"POST",
					url:sendUrl,
					data:sendData,
					dataType:"JSON",
					success:function(data){
						if(data.success){
							appId = data.object.appId;
			        		paySign = data.object.paySign;
			        		timeStamp = data.object.timeStamp;
			        		nonceStr = data.object.nonceStr;
			        		packageStr = data.object.packageStr;
			        		signType = data.object.signType;
			        		detailed.callpay();
			        		
						}else{
							base.dialog({
								type:"2",
								title:"",
								text:data.object,
								flag:true,
								success:()=>{
									//location.replace(base.getContextPath()+'/h5/index.html')
								}
							});
						}
					},
					error: function(data, xhm) {
							location.replace(base.getContextPath()+'/h5/sys_error.html')
					}
				})
				
		},
		
		setContent:function(){
			var sendUrl=""
			var sendData=""
			 
			$("#pageTitle").text("支付订单")
			sendUrl=base.getContextPath()+'/wxpaytask/getPayTaskItemDetailById.do';
			sendData="uidUserId="+base.getUidUserId()+'&iTaskId='+base.GetQueryString("iTaskId")+"&iTaskItemId="+base.GetQueryString("iTaskItemId");
			 
			$.ajax({
				type:"POST",
				url:sendUrl,
				data:sendData,
				dataType:"JSON",
				success:function(data){
					if(data.success){
						
						$(".taskitem_title").html("<h3>"+data.object.tbPayTask.strTitle+"   </h3>   <h6>时间:"+data.object.tbPayTaskItem.strDtCreate+"</h6>");
						$(".taskitem_order").html("<h5>订单号:  "+data.object.tbPayTaskItem.out_trade_no+"</h5>");
						$(".taskitem_user").html("<h5>用户:  "+data.object.tbPayTaskItem.school_NAME+""+data.object.tbPayTaskItem.class_NAME+"  "+data.object.tbPayTaskItem.student_NAME+" "+data.object.tbPayTaskItem.student_NO+"  </h5>");
						$(".taskitem_damount").html("<h3><font color='red'>￥"+data.object.tbPayTask.dAmount+"</font></h3>");
						if(data.object.tbPayTaskItem.iStatus==1){
							$("#btn").prop("disabled",true);
							$("#btn").html("您已经完成支付!");
							$("#btn").click(()=>{
								 
							})
						}
					}else{
						base.dialog({
							type:"2",
							title:"",
							text:data.object,
							flag:true,
							success:()=>{
								//location.replace(base.getContextPath()+'/h5/index.html')
								
							}
						});
					}
				},
				error: function(data, xhm) {
						location.replace(base.getContextPath()+'/h5/sys_error.html')
				}
			})
			
		},
		 
		bind(){
			$(".weui-footer__link").click(()=>{
				//location.replace(base.getContextPath()+'/h5/index.html')
			})
			
			$("#btn").click(()=>{
				detailed.setPrepayReq();
				return ;
			})
		},
		init:function(){
			this.bind();
			this.setContent();
		}
}
$(function(){
	detailed.init();
})
