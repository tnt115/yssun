var release={
		ListGrade:[],
		ListLlass:[],
		localId: [],
		serverId: [],
		countImg:"",
		sendUrl:"",
	/*点击拍照*/
	getPicture:function(){
		$(".default").on("tap",function(){
			$("#textarea,input").blur();
		})
		mui('body').on('tap', '.Features li>a', function(event) {
			var a = this,parent;
			for (parent = a.parentNode; parent != document.body; parent = parent.parentNode) {
				if (parent.classList.contains('mui-popover-action')) {
					break;
				}
			}
			mui('#' + parent.id).popover('toggle');
			var type=[];
			switch ($(this).parent().index()){
				case 0:
					type.push("camera");
					break;
				case 1:
					type.push("album");
					break;
			}
			wx.chooseImage({
			    count: release.computCount(), 
			    sizeType: ['compressed'], 
			    sourceType:type, 
			    success: function (res) {
			        var localIds = res.localIds; 
			        for(var i=0;i<localIds.length;i++){
			         $(".pic").append('<img src="'+localIds[i]+'" data-preview-src="" data-preview-group="1" >')
			        		/*$(".pic").append('<img src="'+localIds[i]+'" data_img='+localIds[i]+' class="add_imgList">')*/
			        	  release.localId.push(localIds[i]);
			        }
			        release.countImg-=localIds.length;
			        release.computCount();
			        release.setImgWidth();
			        
			    }
			});
		})
	},
	/*获取年级底部菜单*/
	getListGrade:function(){
		var response=base.getListGrade(base.getUidUserId());
		if(response.readyState==4&&response.status==200){
			var text=JSON.parse(response.responseText)
				for(var i=0;i<text.object.length;i++){
					release.ListGrade.push({
						text:text.object[i].strGradeName,
						value:text.object[i].uidGradeId
					})
				}
		}else{
			base.dialog({
				type:"2",
				title:"",
				text:"获取数据异常!",
				flag:true,
				success:()=>{
					
				}
			});
		}
	},
	/*获取班级底部菜单*/
	getListLlass:function(uidGradeId){
		release.ListLlass=[]
		var response=base.getListLlass(base.getUidUserId(),uidGradeId);
		if(response.readyState==4&&response.status==200){
			var text=JSON.parse(response.responseText)
				for ( var i = 0; i < text.object.length; i++) {
					release.ListLlass.push({
						text:text.object[i].strClassName,
						value:text.object[i].uidClassId
					})
				}
		}else{
			base.dialog({
				type:"2",
				title:"",
				text:"获取数据异常!",
				flag:true,
				success:()=>{
					
				}
			});
		}
	},
	/*再发送给后端之前必须进行验证操作,及把图片上传到微信服务器*/
	regData:function(){
		var senData=""
		if($("#textarea").val()==""){
			base.dialog({
				type:"2",
				title:"",
				text:"通知描述不能为空!",
				flag:true,
				success:()=>{
					
				}
			});
			return false
		}
		if($(".showUserPicker:eq(1)").children().attr("data_uid")==undefined){
			base.dialog({
				type:"2",
				title:"",
				text:"请选择发布到的班级!",
				flag:true,
				success:()=>{
					
				}
			});
			return false
		}
		base.Toast("loading","正在发布...",true);
		if(base.GetQueryString("state")==1){
			senData="&strContent="+$("#textarea").val()
		}else if(base.GetQueryString("state")==2){
			senData="&strHonorName="+$("#textarea").val()
		}
		if(release.localId.length>0){
			 senData+="&uidUserId="+base.getUidUserId()+"&wechat_accesstoken="+localStorage.getItem("wechat_accesstoken")+"&uidClassId="+$(".showUserPicker:eq(1)").children().attr("data_uid");
		    var i = 0, length = release.localId.length;
		    function upload() {
		      wx.uploadImage({
		    	isShowProgressTips:0,
		        localId: release.localId[i],
		        success: function (res) {
		          i++;
		          release.serverId.push(res.serverId)
		          if (i < length) {
		            upload();
		          }else{
		        	  senData+="&media_id="+release.serverId+"";
		        	  release.sendAjax(senData)
		          }
		        },
		        fail: function (res) {
		        	console.log(JSON.stringify(res));
		        }
		      });
		    }
		    upload();
		}else{
			senData+="&uidUserId="+base.getUidUserId()+"&wechat_accesstoken="+localStorage.getItem("wechat_accesstoken")+"&uidClassId="+$(".showUserPicker:eq(1)").children().attr("data_uid");
       	  release.sendAjax(senData)
		}
	},
	/*点击发布的时候发送数据到后端*/
	sendAjax:function(senData){
		$.ajax({
			type: "post",
			url: release.sendUrl,
			data: senData,
			async: false,
			success: function(data) {
				if(data.success){
					if(base.GetQueryString("state")==1){
						location.replace("ClassStyle.html?index=1")
					}else if(base.GetQueryString("state")==2){
						location.replace("ClassStyle.html?index=2")
					}
					
				}else{
					base.Toast("loading","正在发布...",false);
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
				base.dialog({
					type:"2",
					title:"",
					text:"系统错误，请联系管理员"+data.status,
					flag:true,
					success:()=>{
						
					}
				});
					/*location.replace(base.getContextPath()+'/h5/error.html')*/
			}
		});
	},
	setImgWidth:function(){
		$(".pic>img").css({"width":$(".pic a").width(),"height":$(".pic a").width()})
	},
	/*计算用户选择的照片数量*/
	computCount:function(){
		if(release.countImg==0){
			 $(".pic a").css("display","none");
			 return 0
		}else{
			$(".pic a").css("display","inline-block");
			return release.countImg
		}
	},
	/*绑定所有的方法*/
	allBind:function(){
		$(".showUserPicker").on("click",function(event){
			if($(this).parent().index()==1){
				base.bomSelect(this,release.ListGrade,release);
			}else{
				if($(".showUserPicker:eq(0)").children().attr("data_uid")==undefined){
					base.dialog({
						type:"2",
						title:"",
						text:"请先选择年级！",
						flag:true,
						success:()=>{
							
						}
					});
					return 
				}else{
					base.bomSelect(this,release.ListLlass);
				}
			}
		})
		$("#btn").on("click",function(){
			release.regData();
		})
		/*浏览图片的时候删除图片操作*/
		$(".mui-preview-header").append('<img src="../images/Secondpage/ClassStyle/drop.png" id="drop">')
		$(".mui-preview-header").on("click","#drop",function(){
			base.dialog({
				type:"1",
				title:"友情提示",
				text:"确定要删除?",
				flag:true,
				success:()=>{
					var index=$(".mui-preview-indicator")[0].innerText.substring(0,1)-1;
					 release.localId.splice(index,1)
					 $(".pic>img").eq(index).remove();
					 release.countImg+=1;
					release.computCount();
					previewImage.close();
				}
			});
		})
	},
	/*初始化页面*/
	initPage:function(){
		if(base.GetQueryString("state")==1){
			$("#pageTitle").text("班级风采发布")
			release.sendUrl=base.getContextPath() + '/control/h5/classalbum/saveAlbumH5.htm';
			release.countImg=9
		}else if(base.GetQueryString("state")==2){
			$("#pageTitle").text("班级荣誉发布")
			release.countImg=1
			release.sendUrl=base.getContextPath()+'/control/h5/classhonor/saveClassHonorH5.htm';
		}
		
		//新增使用微信sdk预览图片
		$(".pic").on("tap",".add_imgList",function(){
			let imgList=[];
			let src=$(this).attr("data_img");
			$(".add_imgList").each(function(){
				imgList.push($(this).attr("data_img"))
			})
			wx.previewImage({
			    current:src, 
			    urls:imgList,
			});
		})
	},
	init:function(){
		base.verifyUser();
		base.getWxConfig();
		this.initPage();
		this.allBind();
		this.getListGrade();
		this.getPicture();
	}
}
$(function(){
	release.init();
})
