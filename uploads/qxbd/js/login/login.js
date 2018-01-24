var login = {
	getDevic: function() {
		$(".login").css({
			"width": $(window).width(),
			"height": $(window).height()
		})
	},
	/*登录*/
	user_login: function(data) {
		var sendData=null;
		if(data!=undefined){
			if(base.GetQueryString("wx_openid")!=null){
				data+="&wx_openid="+base.GetQueryString("wx_openid");
			}else if(localStorage.getItem("wx_openid")!=undefined){
				data+="&wx_openid="+localStorage.getItem("wx_openid");
			}
			sendData=data;
		}else{
			sendData="username="+$(".text").val()+"&password="+$(".psd").val()
			if(base.GetQueryString("wx_openid")!=null){
				sendData+="&wx_openid="+base.GetQueryString("wx_openid");
			}else if(localStorage.getItem("wx_openid")!=undefined){
				sendData+="&wx_openid="+localStorage.getItem("wx_openid");
			}
		}
		var userName = login.userName();
		var pwd = login.pwd();
		if(pwd && userName) {
			base.Toast("loading","登录中...",true);
			$.ajax({
				type: "post",
				url: base.getContextPath() + '/control/h5/login/loginCheck.htm',
				data: sendData,
				async: true,
				success: function(data) {
					base.Toast("loading","登录中...",false);
					if(data.success) {
						sessionStorage.clear();
						localStorage.setItem("iRoleID",data.object.iRoleID);
						if(base.GetQueryString("wechat_accesstoken")!=null){
							localStorage.setItem("wechat_accesstoken",base.GetQueryString("wechat_accesstoken"))
						}
						if(base.GetQueryString("wx_openid")!=null){
							localStorage.setItem("wx_openid",base.GetQueryString("wx_openid"))
						}
						if(data.object.length>1){
							var html='',teach='',farmy='',Class_='';
							html+='<ul class="mui-table-view">';
							for(var i=0;i<data.object.length;i++){
								if(data.object[i].iRoleID<6){
									teach+='<li class="mui-table-view-cell" strUserName='+data.object[i].strUserName+'>';
									teach+='<a href="javaScript:"><span class="mui-icon iconfont1 icon-jiaoshi"></span>'+data.object[i].strRealName+'('+data.object[i].strUserName+')</a>';
									teach+='</li>';
								}else{
									if(data.object[i].childList!=undefined){
										farmy+='<li class="mui-table-view-cell" strUserName='+data.object[i].strUserName+' list='+data.object[i].childList.length+'>';
									}else{
										farmy+='<li class="mui-table-view-cell" strUserName='+data.object[i].strUserName+'>';
									}
									farmy+='<a href="javaScript:"><span class="mui-icon iconfont1 icon-jiachang"></span>'+data.object[i].strRealName+'('+data.object[i].strUserName+')</a>';
									farmy+='</li>';
								}
							}
							    html+=teach+farmy;
								html+='</ul>'
							$(".mui-scroll").html(html);
							mui('#middlePopover').popover('show')
							return false;
						}
						if(data.object.url!=null) {
								window.location.replace(base.getContextPath() + data.object.url+"?wx_openid="+localStorage.getItem("wx_openid")+"&wechat_accesstoken="+localStorage.getItem("wechat_accesstoken"))
							localStorage.setItem("state",data.object.state)
							if(data.object.uidParentId!=undefined){
								localStorage.setItem("uidParentId",escape(data.object.uidParentId))
							}
							if(data.object.uidTeacherId!=undefined){
								localStorage.setItem("uidTeacherId",escape(data.object.uidTeacherId))
							}
						} else {
							base.dialog({
								type:"2",
								title:"",
								text:"你当前账号不支持此平台",
								flag:true,
								success:()=>{
									
								}
							});
						}
					} else {
						base.dialog({
							type:"2",
							title:"",
							text:data.object,
							flag:true,
							success:()=>{
								
							}
						});
					}
				},
				error: function(data, xhm) {
					base.Toast("loading","登录中...",false);    //关闭 加载层
					base.dialog({
						type:"2",
						title:"",
						text:`系统错误，请联系管理员${data.status}`,
						flag:true,
						success:()=>{
							
						}
					});
				}
			});
		}

	},
	/*验证用户名*/
	userName: function() {
		if($(".text").val() == "") {
			$(".login_msg").eq(0).show()
			$(".login-bar li:eq(0)").css("margin-bottom", "0");
			return false;
		} else {
			$(".login_msg").eq(0).hide()
			$(".login-bar li:eq(0)").css("margin-bottom", "30px");
			return true;
		}
	},
	/*验证密码*/
	pwd: function() {
		if($(".psd").val() == "") {
			$(".login_msg").eq(1).show()
			return false;
		} else {
			$(".login_msg").eq(1).hide()
			return true;
		}

	},
	/*绑定所有的事件*/
	bindEven: function() {
		$(".submit").on("click", function() {
			login.user_login();
		})
		$(".text").blur(function() {
			login.userName()
		})
		$(".psd").blur(function() {
			login.pwd()
		})
		mui('.mui-scroll-wrapper').scroll();
		mui('body').on('shown', '.mui-popover', function(e) {
		});
		mui('body').on('hidden', '.mui-popover', function(e) {
		});
		$(".mui-scroll").on("click",".mui-table-view-cell",function(){
			var data="username="+$(this).attr("strusername")+"&password="+$(".psd").val();
			login.user_login(data);
		})
	},
	init: function() {
		this.getDevic();
		this.bindEven();
	}
}
$(function() {
	login.init();
}())