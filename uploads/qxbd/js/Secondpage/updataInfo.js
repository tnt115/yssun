var updataInfo = {
		images:{
				    localId: [],
				    serverId: []
				  },
	surePage : function() {
		switch (base.getUrlParmas()) {
		case "0":
			if(localStorage.getItem("ImagePath")!=null){
				$(".info_img").attr("src",localStorage.getItem("ImagePath"))
			}
			$("#userName").val(localStorage.getItem("userName"));
			$("#userMobile").val(localStorage.getItem("strMobile"));
			$("#userStyle").val(localStorage.getItem("strSignture"));
			if(localStorage.getItem("state")=="0"){
				$("#info>div:eq(3)").css("display","none")
			}else{
				$("#class_info").val(localStorage.getItem("strClassName"));
			}
			$("#updataInfo").html("个人资料")
			$("#info,#btn").css("display", "block")
			break;
		case "1":
			$("#updataInfo").html("修改密码")
			$("#pwd,#btn").css("display", "block")
			break;
		}
	},
	// 拍照、本地选图
	chooseImage : function() {
		wx.chooseImage({
			count:1,
			sizeType: ['compressed'],
			success : function(res) {
				updataInfo.images.localId.push(res.localIds);
				$(".info_img").attr("src",res.localIds);
				
			}
		});
	},
	/*修改用户资料*/
	uploadInfoData:function(){
		var sendUrl=""
		var senData=""
		switch (base.getUrlParmas()) {
		case "0":
			if($("#userName").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:"用户名称不能为空!",
					flag:true,
					success:()=>{
						
					}
				});
				return false;
			}
			if($("#userMobile").val()!=""){
				if(!(/^1[34578]\d{9}$/).test($("#userMobile").val())){
					base.dialog({
						type:"2",
						title:"",
						text:"请输入正确的手机号码!",
						flag:true,
						success:()=>{
							
						}
					});
					return false;
				}
			}
			 base.Toast("loading","修改中...",true);
			senData+="uidUserId="+base.getUidUserId()+"&strRealName="+$("#userName").val()+"&strMobile="+$("#userMobile").val()+"&strSignture="+$("#userStyle").val()+"&wechat_accesstoken="+localStorage.getItem("wechat_accesstoken");
			sendUrl=base.getContextPath()+'/control/h5/users/saveuserinfo.htm';
			if(updataInfo.images.localId.length>0){
				 wx.uploadImage({
					 isShowProgressTips:0,
			          localId: updataInfo.images.localId+"",
			          success: function (res) {
			        	updataInfo.images.serverId.push(res.serverId)
			        	senData+="&media_id="+updataInfo.images.serverId+""
			        	updataInfo.ajaxUploadInfo(sendUrl,senData,false)
			          },
			          fail: function (res) {
			        	 base.Toast("loading","wx上传失败",true);
			        	 setTimeout(()=>{
			        			 base.Toast("loading","wx上传失败",false); 
			        	 },800)
			            console.log(JSON.stringify(res));
			          }
			        });
			}else{
				updataInfo.ajaxUploadInfo(sendUrl,senData,false)
			}
			break;
		case "1":
			if($("#oldPwd").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:"请输入原密码!",
					flag:true,
					success:()=>{
						
					}
				});
				return false;
			}
			if($("#password").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:"请输入新密码!",
					flag:true,
					success:()=>{
						
					}
				});
				return false;
			}
			if($("#surePwd").val()==""){
				base.dialog({
					type:"2",
					title:"",
					text:"确认密码不能为空!",
					flag:true,
					success:()=>{
						
					}
				});
				return false;
			}
			if($("#password").val()!=$("#surePwd").val()){
				base.dialog({
					type:"2",
					title:"",
					text:"两次密码不一致!",
					flag:true,
					success:()=>{
						
					}
				});
				return false;
			}
			 base.Toast("loading","修改中...",true);
			senData+="uidUserId="+base.getUidUserId(true)+"&strPassword="+$("#password").val()+"&oldstrPassword="+$("#oldPwd").val();
			sendUrl=base.getContextPath()+'/control/h5/users/updateStrPassword.htm';
			updataInfo.ajaxUploadInfo(sendUrl,senData,true)
			break;
		}
	},
	/*用ajax上传到服务器*/
	ajaxUploadInfo:function(sendUrl,senData,type){
		$.ajax({
			type:"POST",
			url:sendUrl,
			data:senData,
			dataType:"JSON",
			success:function(data){
				base.Toast("loading","正在保存...",false);
					if(data.success){
						if(type){
							window.location.replace("../../index.html")
						}else{
							updataInfo.images.localId=[];
							window.location.replace("../../index.html")
						}
					}else{
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
				base.Toast("loading","正在保存...",false);
				location.replace(base.getContextPath()+'/h5/error.html')
			}
		})
	},
	/*绑定所有的事件*/
	bindEvent:function(){
		$("#update_img,.info_img").on("click",function(){
			updataInfo.chooseImage();
		})
		$("#btn").on("click",function(){
			updataInfo.uploadInfoData();
		})
	},
	init : function() {
		this.surePage();
		base.getWxConfig("updataInfo")
	}
}
$(function() {
	updataInfo.init();
})
