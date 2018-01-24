var index = {
	toggSrc: function() {
		$(".mui-bar a").on("tap", function() {
			switch($(this).attr("id")) {
				case "Home":
					index.initPage("1")
					sessionStorage.setItem("id", 1);
					break;
				case "My":
					index.initPage("2")
					sessionStorage.setItem("id", 2);
					break;
				case "Msg":
					index.initPage("3")
					sessionStorage.setItem("id", 3);
					break;
			}
		})
	},
	/* 点击头像修改资料 */
	/**
	 * 绑定所有的方法
	 */
	updataInfo: function() {
		$("#HeadPortrait img").on("click", function() {
			window.location.href = "Secondpage/updataInfo/updataInfo.html?surepage=0"
		})
		$("#updataPwd").on("click", function() {
			window.location.href = "Secondpage/updataInfo/updataInfo.html?surepage=1"
		})
		$("#LogOut,#SwitchCard").on("click",function(event){
			switch (event.target.getAttribute("id")) {
			case "SwitchCard":
				index.userCard_switch();
				// index.indexpublic(false); //切换账号
				return false
			case "LogOut":
/*
 * mui.confirm('确认退出？', '温馨提示!', function(e) { //退出登录 if (e.index == 1) {
 * index.indexpublic(true) } }) return false
 */
				base.dialog({
					type:"1",
					title:"温馨提示",
					text:"确认退出?",
					flag:true,
					success:()=>{
						index.indexpublic(true);
					}
				});
				return false
			}
		})
		
	},
	/* 修复切换账号 */
	userCard_switch(data,flag){
		base.Toast("loading","请稍后...",true);
		let sendData=data==undefined?"strMobile="+localStorage.getItem("strMobile")+"&password="+encodeURIComponent(localStorage.getItem("strMd5Pwd"))+"&wx_openid="+localStorage.getItem("wx_openid"):data;
		$.ajax({
			type:"post",
			url:base.getContextPath()+'/control/h5/login/loginCheckByPhone.htm',
			data:sendData,
			dataType:"JSON",
			success:function(data){
				if(data.object.length==undefined){
					if(data.object.strUserName==localStorage.getItem("strUserName")){
						base.Toast("loading","请稍后...",false);
						base.dialog({
							type:"1",
							title:"温馨提示",
							text:"此账号正在使用，请换其他账号使用",
							flag:true,
							success:()=>{
								
							}
						});
						return false;
					}
					if(data.object.uidParentId!=undefined){
						localStorage.setItem("uidParentId",escape(data.object.uidParentId))
					}
					if(data.object.uidTeacherId!=undefined){
						localStorage.setItem("uidTeacherId",escape(data.object.uidTeacherId))
					}
					localStorage.setItem("state",data.object.state)
					localStorage.setItem("iRoleID",data.object.iRoleID);
					window.location.replace(base.getContextPath() + data.object.url+"?wx_openid="+localStorage.getItem("wx_openid")+"&wechat_accesstoken="+localStorage.getItem("wechat_accesstoken"))
				}else{
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
					base.Toast("loading","请稍后...",false);
					$(".mui-scroll").html(html);
					mui('#middlePopover').popover('show');
					mui('.mui-scroll-wrapper').scroll();
					mui('body').on("tap",".mui-backdrop",function(){
						$("body").css("background-color", "#eee")
						})
				}
				},
			error(data,xhm){
					base.dialog({
						type:"1",
						title:"错误提示",
						text:`获取相关手机号码失败${data.object}`,
						flag:true,
						success:()=>{
							
						}
					});
				}
		})
	},
	shuffling: function() {
		mui("#slider").slider({
			interval: 3000,
		})
		document.querySelector('#slider').addEventListener('slide')
	},
	/* 首页公共方法 */
	indexpublic:function(state){
	if(state){
		base.Toast("loading","正在退出...",true);
	}else{
		base.Toast("loading","切换中...",true);
	}
			$.ajax({
				type: "post",
				url: base.getContextPath() + '/control/h5/login/logout.htm',  
				data: "wx_openid="+localStorage.getItem("wx_openid"),
				async: true,
				success: function(data) {
					base.Toast("loading","正在退出...",false);
					if(data.success){
						if(state){
							//localStorage.clear();
							wx.closeWindow();
						}else{
							window.location.replace("login.html")
						}
					}else{
						base.dialog({
							type:"2",
							title:"",
							text:`获取数据失败!${data.object}`,
							flag:true,
							success:()=>{
							}
						});
					}
				},
				error: function(data, xhm) {
					base.Toast("loading","正在退出...",false);
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
	},
	/* 加载dom模型 */
	loadingDOM: function() {
		if(localStorage.getItem("iRoleID")>=6){
			$("#Sudoku").html(base.Sudoku(1))
		}else{
			$("#Sudoku").html(base.Sudoku(0))
		}
		if($("#bottom>a").hasClass("mui-active")) {
			switch($(this).index()) {
				case 2:
					$("body").css("background-color", "#eee")
					break;
				default:
					$("body").css("background-color", "#fff")
					break;
			}
		}
		if(localStorage.getItem("state") == 1) {
			$("#bottom").css("display", "block")
		} else {
			$("#Msg").css("display", "none")
			$("#bottom").css("display", "block")
		}
	},
	/* 初始化页面配置底部菜单 */
	initPage: function(e) {
		 setTimeout(function(){
				switch(e) {
				case "1":
					$("#Home").find("img").attr("src", "images/index/home_press.png")
					$(".mui-bar a:eq(2)").find("img").attr("src", "images/index/mine-normal.png")
					$(".mui-bar a:eq(1)").find("img").attr("src", "images/index/message_normal.png")
					$("body").css("background-color", "#fff")
					break;
				case "2":
					$("#My").find("img").attr("src", "images/index/mine-press.png")
					$(".mui-bar a:eq(0)").find("img").attr("src", "images/index/home_normal.png")
					$(".mui-bar a:eq(1)").find("img").attr("src", "images/index/message_normal.png")
					$("body").css("background-color", "#eee")
					break;
				case "3":
					$("#Msg").find("img").attr("src", "images/index/message_press.png")
					$(".mui-bar a:eq(0)").find("img").attr("src", "images/index/home_normal.png")
					$(".mui-bar a:eq(2)").find("img").attr("src", "images/index/mine-normal.png")
					$("body").css("background-color", "#fff")
					break;
			}
		 },200)
	},
	/* 初始化页面的时候获取id,进行判断到底部菜单对应的功能项 */
	selectBar: function() {
		switch(sessionStorage.getItem("id")) {
			case "1":
				$(".mui-control-content,#bottom a").removeClass("mui-active")
				$("#home,#Home").addClass("mui-active")
				index.initPage("1")
				break;
			case "2":
				$(".mui-control-content,#bottom a").removeClass("mui-active")
				$("#my,#My").addClass("mui-active")
				index.initPage("2")
				break;
			case "3":
				$(".mui-control-content,#bottom a").removeClass("mui-active")
				$("#message,#Msg").addClass("mui-active")
				index.initPage("3")
				break;
		}
	},
	/* 获取登录用户的信息 */
	getParams:function(flag){
		var senData="uidUserId="+base.getUidUserId();
		if(!flag){
			base.Toast("loading","加载中...",true);
		}
		$.ajax({
			type: "post",
			url: base.getContextPath() + '/control/h5/users/getUserInfo.htm',
			data: senData,
			async: true,
			success: function(data) {
				base.Toast("loading","加载中...",false);
				if(data.success) {
					if(data.object.strImagePath==null){
						localStorage.removeItem("ImagePath");
						if(data.object.iGender==1){
							$("#my_header_img,#head-img,.mui-media-object").attr("src","images/login/boy.png");
						}else if(data.object.iGender==2){
							$("#my_header_img,#head-img,.mui-media-object").attr("src","images/login/girl.png");
						}
					}else{
						$("#my_header_img,#head-img,.mui-media-object").attr("src",data.object.strImagePath);
						localStorage.setItem("ImagePath",data.object.strImagePath)
					}
					if(data.object.iRoleID>5){
						$(".user_Class").text(data.object.strClassName);
					}else{
						$(".user_Class").text(" ");
						$(".user_name").css("top",".5rem")
					}
					// 判断当前用户出否支持切换账号
					if(data.object.iMyUserCount>1){
						localStorage.setItem("strMd5Pwd",data.object.strMd5Pwd);
						$("#userCard_switch").css("display","block");
					}
					localStorage.setItem("strUserName",data.object.strUserName);
					$("#html_title").text(data.object.strSchoolName);
					localStorage.setItem("userName",data.object.strRealName);
					localStorage.setItem("strSignture",data.object.strSignture);
					localStorage.setItem("strMobile",data.object.strMobile);
					localStorage.setItem("uidSchoolId",data.object.uidSchoolId);
					if(data.object.iRoleID>5){    //家长登录保存孩子班级id
						localStorage.setItem("uidClassId",data.object.uidClassId);
					}
					localStorage.setItem("strClassName",data.object.strClassName);
					$(".my_header_content p:eq(1),.user_name,#listName").text(data.object.strRealName)
					$(".my_header_content p:eq(2),.mui-ellipsis").text(data.object.strSignture)
					//关闭切换账号层
					if(flag){
						mui('#middlePopover').popover('hide');
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
				base.Toast("loading","加载中...",false);
				base.dialog({
					type:"2",
					title:"",
					text:`系统错误，请联系管理员!${data.status}`,
					flag:true,
					success:()=>{
					}
				});
			}
		});
	},
	/**
	 * 新增消息数量提醒
	 */
	MessageRemind(){
		base.ajax({
			"sendUrl":base.getContextPath()+'/control/h5/users/getUserPendCount.htm',
			"sendData":"",
			"flag":true,
			"noFrom":true,
			fun:(data)=>{
				let obj="";
				for(let item of data.object){
					switch(item.iResourceId){ 
						case 514:    //514代表家庭作业
							if(item.cnt>0){
								obj=$("#p_homework");
							}
							break;
						case 444:    //444代表学校通知
							if(item.cnt>0){
								obj=$("#school_notice");
							}
							break;
						case 447:    //447代表学校新闻
							if(item.cnt>0){
								obj=$("#School_news");
							}
							break;
						case 9999 :    //9999代表家校互动留言
							if(item.cnt>0){
								obj=$("#msg_badge");
							}
							break;
					}
					obj==""?"":obj.css("display","block");
				}
			}
		})
	},
	/* 把url传过来的值存放到localStorage中 */
	setlocalStorage:function(){
		if(base.GetQueryString("wechat_accesstoken")!=null){
			localStorage.setItem("wechat_accesstoken",base.GetQueryString("wechat_accesstoken"))
			localStorage.setItem("wx_openid",base.GetQueryString("wx_openid"));
		}
		if(base.GetQueryString("uidUserId")!=null){
			localStorage.setItem("uidTeacherId",base.GetQueryString("uidUserId"));
		}
		if(base.GetQueryString("userRoleId")!=null){
			localStorage.setItem("iRoleID",base.GetQueryString("userRoleId"));
		}
		this.getParams();
	},
	/**
	 * 绑定index页面所有的事件
	 */
	BindEvent(){
		$(".mui-scroll").on("click",".mui-table-view-cell",function(){
			var data="strMobile="+$(this).attr("strusername")+"&password="+encodeURIComponent(localStorage.getItem("strMd5Pwd"))+"&wx_openid="+localStorage.getItem("wx_openid")
			index.userCard_switch(data,true);
		})
	},
	init: function() {
		base.verifyUser();
		base.getWxConfig();
		this.setlocalStorage();
		this.MessageRemind();
		this.loadingDOM();
		this.updataInfo()
		this.toggSrc();
		this.selectBar();
		this.BindEvent();
		this.shuffling();
	}
}
$(function() {
	index.init();
})