var detailPeople = {
	getDevic: function() {
		$(".header").css({
			"width": $(window).width(),
			"height": $(window).height()
		})
		$(".mui-control-content").css("min-height",$(window).height()-100+"px")
		$(".people_header>li p").width($(".people_header>li").width())
	},
	/*根据uidParentId获取当前家长的直属孩子*/
	getChildList: function() {
		//判断服务器传过来的childUserId是否等于"null";
		var sendData="";
		if(base.GetQueryString("uidUserId")!=null){
			sendData=`uidParentId=${base.GetQueryString("uidUserId")}`   //服务器自动登录
		}else{
			sendData=`uidParentId=${localStorage.getItem("uidParentId")}`   //用户手动登录
		}
		var index = layer.load(2, {
			shade: 0.1
		});
		$.ajax({
			type: "post",
			url: base.getContextPath() + '/control/h5/parent/listChildByParent.htm',
			async: true,
			data: sendData,
			dataType:"JSON",
			success: function(data) {
				layer.close(index);
				if(data.success) {
					if(data.object.length==1){
						detailPeople.hrefNewPage(data.object[0].uidStudentId);
						if(base.GetQueryString("wechat_accesstoken")!=null){
							localStorage.setItem("wechat_accesstoken",base.GetQueryString("wechat_accesstoken"));
						}
						return false;
					}
						var html=""
								for(var i=0;i<data.object.length;i++){
									if(i!=0&&i%2==0){
										html+='</ul>';
									}
									if(i%2==0){
										html+='<ul class="people_header">';
									}
									html+='<li ><a href="javaScript:" data_uidStudentId='+data.object[i].uidStudentId+'>'
									html+='<p class="people_header_img">'
									if(data.object[i].strImagePath==null){
										if(data.object[i].stucommon.iGender==1){
											html+='<img src="../../images/login/boy.png"></p>'
										}else if(data.object[i].stucommon.iGender==2){
											html+='<img src="../../images/login/girl.png"></p>'
										}
									}else{
										html+='<img src="'+data.object[i].strImagePath+'"></p>'
									}
									html+='<p class="people_name">'+data.object[i].stucommon.strRealName+'</p>'
									html+='<p class="people_adress">'+data.object[i].stucommon.strSchoolName+'</p>'
									html+='</a></li>'
								}
						$(".header").html(html);
				} else {
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
				layer.close(index);
				location.replace(base.getContextPath()+'/h5/error.html')
			}
		});
	},
	/*绑定用户*/
	bindAll:function(){
		$(".header").on("click","a",function(){
			var uidStudentId=$(this).attr("data_uidStudentId");
			detailPeople.hrefNewPage(uidStudentId);
		})
	},
	//跳转到首页，并存储用户id
	hrefNewPage(uidStudentId){
		localStorage.setItem("uidStudentId",uidStudentId);
		if(base.GetQueryString("childUserId")!="null"&&base.GetQueryString("childUserId")!=null){
			localStorage.setItem("uidStudentId",base.GetQueryString("childUserId"))
		}
		$.ajax({
			type: "post",
			url: base.getContextPath() + '/control/h5/parent/saveChildByParent.htm',
			async: true,
			data: `uidParentId=${uidStudentId}`,
			dataType:"JSON",
			success:data=>{
				if(data.success){
					console.log(`uidStudentId存储成功:+${data}`);
				}
				window.location.replace('../../index.html')
			},
			error:data=>{
				console.log(`uidStudentId存储成功：${data}`);
				window.location.replace('../../index.html')
			}
		})
	},
	initPage(){
		if(base.GetQueryString("wechat_accesstoken")!=null){
			localStorage.setItem("wechat_accesstoken",base.GetQueryString("wechat_accesstoken"));
		}
		if(base.GetQueryString("userRoleId")!=null){
			localStorage.setItem("iRoleID",base.GetQueryString("userRoleId"));
		}
		if(base.GetQueryString("wx_openid")!=null){
			localStorage.setItem("wx_openid",base.GetQueryString("wx_openid"));
		}
	},
	init: function() {
		/*base.verifyUser();*/
		this.getDevic();
		this.initPage();
		this.bindAll();
		this.getChildList();
	}
}
$(function() {
	detailPeople.init();
}())
